import { useEffect, useRef, useState } from "react";
import { api, when, type Agent, type Message } from "../api";
import { Button, Page } from "../ui";

/**
 * One chat component, two uses: the ordinary assistant, and each agent's own
 * chat. The agent version carries its role contract at the top so it is
 * obvious who you are talking to and what they will and won't touch.
 */
export function Chat({ threadId, agent }: { threadId: string; agent?: Agent }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    setMessages([]);
    api
      .get<{ messages: Message[] }>(`/chat/${encodeURIComponent(threadId)}`)
      .then((r) => live && setMessages(r.messages))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [threadId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sending]);

  async function send() {
    const body = draft.trim();
    if (!body || sending) return;
    setDraft("");
    setSending(true);
    setError(null);
    const optimistic: Message = {
      id: `pending-${Date.now()}`,
      thread_id: threadId,
      role_id: agent?.id ?? null,
      author: "dayna",
      body,
      blocked_reason: null,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    try {
      const r = await api.post<{ user: Message; reply: Message }>(
        `/chat/${encodeURIComponent(threadId)}`,
        { body },
      );
      setMessages((m) => [...m.filter((x) => x.id !== optimistic.id), r.user, r.reply]);
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
      setDraft(body);
      setError(e instanceof Error ? e.message : "Something went wrong sending that.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Page
      title={agent ? agent.name : "Chat"}
      lede={
        agent
          ? undefined
          : "Ordinary questions, thinking out loud, whatever's in front of you. What you say here is remembered on every other page."
      }
    >
      {agent && (
        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-[15px] leading-relaxed text-stone-700">{agent.job}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Brings you
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-stone-600">{agent.inScope}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Won't touch
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-stone-600">{agent.outOfScope}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="space-y-4">
        {messages.length === 0 && !sending && (
          <p className="py-8 text-center text-[15px] text-stone-500">
            {agent
              ? `Tell ${agent.name.split(" ")[0]} what you need. It keeps what you've said elsewhere.`
              : "Start anywhere. Dictating a mess is fine."}
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.author === "dayna" ? "flex justify-end" : "flex"}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                m.author === "dayna"
                  ? "bg-stone-900 text-white"
                  : m.author === "system"
                    ? "border border-rose-200 bg-rose-50 text-rose-900"
                    : "border border-stone-200 bg-white text-stone-800"
              }`}
            >
              {m.body}
              {m.blocked_reason && (
                <span className="mt-2 block text-xs opacity-70">{m.blocked_reason}</span>
              )}
              <span
                className={`mt-2 block text-xs ${
                  m.author === "dayna" ? "text-stone-400" : "text-stone-400"
                }`}
              >
                {when(m.created_at)}
              </span>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex">
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-[15px] text-stone-400">
              thinking…
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-stone-100/95 px-4 py-3 backdrop-blur sm:pl-64">
        <div className="mx-auto flex max-w-5xl items-end gap-2 sm:px-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
            }}
            rows={1}
            placeholder="Say it however it comes out…"
            className="max-h-40 min-h-[46px] flex-1 resize-y rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-[15px] outline-none focus:border-stone-500"
          />
          <Button onClick={send} disabled={sending || !draft.trim()}>
            Send
          </Button>
        </div>
      </div>
    </Page>
  );
}
