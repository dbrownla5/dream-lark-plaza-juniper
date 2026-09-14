/**
 * Chat that remembers.
 *
 * Two kinds of thread, same machinery:
 *   - 'general'   : the ordinary assistant, for day-to-day questions.
 *   - 'role:<n>'  : one occupation's own chat. Dayna picks the agent by opening
 *                   it; nothing routes her there behind her back.
 *
 * Both threads read the same living context, so moving between pages does not
 * lose what she has already said. Her words are stored as her words; what the
 * model says back is stored as inference, never mixed in.
 */
import type { Sql } from "./db.ts";
import { newId } from "./ids.ts";
import { getRole, ROLES } from "./roles.ts";
import { invokeLlm } from "./llm.ts";
import { retrieveForTask, writeContext, listContext } from "./context.ts";
import { recordUsage } from "./workspace.ts";

export type ChatMessage = {
  id: string;
  thread_id: string;
  role_id: number | null;
  author: string;
  body: string;
  blocked_reason: string | null;
  created_at: string;
};

const MSG_SELECT = `id, thread_id, role_id, author, body, blocked_reason, created_at::text as created_at`;

export function threadIdForRole(roleId: number): string {
  return `role:${roleId}`;
}

export async function listMessages(
  sql: Sql,
  userId: string,
  threadId: string,
  limit = 60,
): Promise<ChatMessage[]> {
  const rows = await sql.query<ChatMessage>(
    `select ${MSG_SELECT} from chat_messages
     where user_id = $1 and thread_id = $2
     order by created_at desc limit $3`,
    [userId, threadId, limit],
  );
  return rows.reverse();
}

export async function listThreads(sql: Sql, userId: string) {
  return sql.query(
    `select thread_id, role_id, count(*)::int as n,
            max(created_at)::text as last_at,
            (array_agg(body order by created_at desc))[1] as last_body
     from chat_messages where user_id = $1
     group by thread_id, role_id order by max(created_at) desc limit 60`,
    [userId],
  );
}

const GENERAL_SYSTEM = `You are Dayna's assistant inside her own system. You are talking to her, not about her.

How to be useful to her:
- She is an operator, not a coder. Never hand her terminal commands, code, config, or a console to click through.
- She thinks out loud and dictates. Read for intent, not literal wording. Garbled text: say so lightly and keep going.
- Answer the question she asked. Do not return a list of everything that could be wrong, a plan for a plan, or a questionnaire.
- If something is genuinely unresolvable, ask ONE consequential question. Not a set.
- Her own words in the context below are hers. Anything an agent concluded is inference and is labeled as such. Never repeat inference back as if she said it.
- Do not invent facts about her business, her clients, her inventory, or her files. Uncertain is an acceptable answer.`;

function roleSystem(roleId: number): string {
  const role = getRole(roleId);
  return `You are the ${role.name} in Dayna's system. This is your own chat with her.

Your permanent job: ${role.job}

In scope for you: ${role.inScope}
Out of scope for you: ${role.outOfScope}
Your authority: ${role.authority}
You may not: ${role.prohibitions}
When you fail or cannot proceed: ${role.failureBehavior}
Separation from other roles: ${role.separation}

You are an occupation, not a project bot. Dayna may bring you completely different work on different days; that is normal and you keep the same boundaries either way.

If she asks you for something that belongs to another occupation, say plainly which role owns it and offer to hand it over. Do not do it yourself and do not refuse coldly.

She is an operator, not a coder. No terminal commands, no code, no console steps. Answer what she asked; if something is genuinely unresolvable, ask one question, not a list. Never invent facts or identities — uncertain is an acceptable answer.`;
}

/**
 * Send one message and get the reply. A model failure comes back as a visible
 * failed message, never as silence and never as a fabricated answer.
 */
export async function sendMessage(
  sql: Sql,
  opts: { userId: string; threadId: string; roleId: number | null; body: string },
): Promise<{ user: ChatMessage; reply: ChatMessage }> {
  const userMsgId = newId("msg");

  // Her words, kept as hers, in the living context every page reads.
  const record = await writeContext(sql, {
    userId: opts.userId,
    kind: "user_statement",
    body: opts.body,
    author: "dayna",
    source: opts.roleId ? `chat:role:${opts.roleId}` : "chat:general",
  });

  await sql.query(
    `insert into chat_messages (id, user_id, thread_id, role_id, author, body, context_id)
     values ($1,$2,$3,$4,'dayna',$5,$6)`,
    [userMsgId, opts.userId, opts.threadId, opts.roleId, opts.body, record.id],
  );

  const history = await listMessages(sql, opts.userId, opts.threadId, 20);
  const memory = opts.roleId
    ? await retrieveForTask(sql, { userId: opts.userId, roleId: opts.roleId, limit: 25 })
    : await listContext(sql, opts.userId, 25);

  const memoryBlock = memory
    .filter((m) => m.id !== record.id)
    .map((m) => `[${m.kind}${m.author === "dayna" ? " — Dayna's own words" : ""}] ${m.body}`)
    .join("\n");

  const transcript = history
    .slice(0, -1)
    .map((m) => `${m.author === "dayna" ? "Dayna" : "You"}: ${m.body}`)
    .join("\n");

  const system = opts.roleId ? roleSystem(opts.roleId) : GENERAL_SYSTEM;
  const result = await invokeLlm({
    system,
    user:
      (memoryBlock ? `What the system already holds:\n${memoryBlock}\n\n` : "") +
      (transcript ? `Earlier in this conversation:\n${transcript}\n\n` : "") +
      `Dayna says:\n${opts.body}`,
    maxTokens: 1100,
  });

  const replyId = newId("msg");
  if (!result.ok) {
    await sql.query(
      `insert into chat_messages (id, user_id, thread_id, role_id, author, body, blocked_reason)
       values ($1,$2,$3,$4,'system',$5,$6)`,
      [
        replyId,
        opts.userId,
        opts.threadId,
        opts.roleId,
        "I couldn't answer — the model call failed. What you said is saved and nothing was made up in its place.",
        result.error,
      ],
    );
  } else {
    await recordUsage(sql, { userId: opts.userId, kind: "chat", costCents: result.costCents });
    await sql.query(
      `insert into chat_messages (id, user_id, thread_id, role_id, author, body)
       values ($1,$2,$3,$4,'agent',$5)`,
      [replyId, opts.userId, opts.threadId, opts.roleId, result.text.trim()],
    );
  }

  const [user] = await sql.query<ChatMessage>(
    `select ${MSG_SELECT} from chat_messages where id = $1`,
    [userMsgId],
  );
  const [reply] = await sql.query<ChatMessage>(
    `select ${MSG_SELECT} from chat_messages where id = $1`,
    [replyId],
  );
  return { user, reply };
}

/** Every occupation, with enough of its contract to know why you'd open it. */
export function agentDirectory() {
  return ROLES.map((r) => ({
    id: r.id,
    name: r.name,
    family: r.family,
    job: r.job,
    inScope: r.inScope,
    outOfScope: r.outOfScope,
    threadId: threadIdForRole(r.id),
  }));
}
