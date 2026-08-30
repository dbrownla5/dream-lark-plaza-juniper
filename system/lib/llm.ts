import { redactSecrets } from "./guardrails.ts";

// Two ways to reach Gemini, picked by environment:
//  - VERTEX_PROJECT set  -> Vertex AI (billed to the Google Cloud project /
//    startup credits). Auth is the machine's own identity on Cloud Run
//    (metadata server), or a GOOGLE_OAUTH_TOKEN env for local runs. No keys.
//  - otherwise           -> the Gemini API keyed by GEMINI_API_KEY.
// LLM_BASE_URL/LLM_MODEL/LLM_API_KEY still override for any OpenAI-compatible
// provider.
export const LLM_MODEL = process.env.LLM_MODEL?.trim() || "gemini-3.6-flash";
const VERTEX_PROJECT = process.env.VERTEX_PROJECT?.trim();
export const LLM_BASE = (
  process.env.LLM_BASE_URL?.trim() ||
  (VERTEX_PROJECT
    ? `https://aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/global/endpoints/openapi`
    : "https://generativelanguage.googleapis.com/v1beta/openai")
).replace(/\/+$/, "");
const WIRE_MODEL = VERTEX_PROJECT ? `google/${LLM_MODEL}` : LLM_MODEL;

function resolveApiKey(): string | undefined {
  return (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY)?.trim() || undefined;
}

let cachedToken: { value: string; expires: number } | null = null;
async function vertexToken(): Promise<string | null> {
  if (process.env.GOOGLE_OAUTH_TOKEN?.trim()) return process.env.GOOGLE_OAUTH_TOKEN.trim();
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.value;
  try {
    // Cloud Run / any GCP runtime: the service's own identity.
    const res = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      { headers: { "Metadata-Flavor": "Google" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    cachedToken = {
      value: json.access_token,
      expires: Date.now() + Math.max(60, (json.expires_in ?? 300) - 120) * 1000,
    };
    return cachedToken.value;
  } catch {
    return null;
  }
}

async function authHeader(): Promise<string | null> {
  if (VERTEX_PROJECT) {
    const t = await vertexToken();
    return t ? `Bearer ${t}` : null;
  }
  const key = resolveApiKey();
  return key ? `Bearer ${key}` : null;
}

export function llmAvailable(): boolean {
  return Boolean(VERTEX_PROJECT || resolveApiKey());
}

export type LlmOk = {
  ok: true;
  text: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costCents: number;
};

export type LlmFail = {
  ok: false;
  error: string;
  code: "LLM_UNAVAILABLE" | "LLM_ERROR" | "LLM_EMPTY";
};

export type LlmResult = LlmOk | LlmFail;

function estimateCostCents(prompt: number, completion: number): number {
  // Conservative ceiling used for spend control, not billing.
  return (prompt * 0.0005 + completion * 0.0015) / 10;
}

export async function invokeLlm(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  json?: boolean;
}): Promise<LlmResult> {
  const auth = await authHeader();
  if (!auth) {
    return {
      ok: false,
      code: "LLM_UNAVAILABLE",
      error:
        "Occupational judgment cannot run: the language model is not available. The file was preserved. Nothing was invented.",
    };
  }
  const system = redactSecrets(opts.system);
  const user = redactSecrets(opts.user);
  try {
    const body: Record<string, unknown> = {
      model: WIRE_MODEL,
      max_tokens: opts.maxTokens ?? 900,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    };
    if (opts.json) {
      body.response_format = { type: "json_object" };
    }
    let res = await fetch(`${LLM_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    if (!res.ok && res.status === 400 && body.response_format) {
      // Some OpenAI-compatible layers reject response_format; retry without it.
      delete body.response_format;
      res = await fetch(`${LLM_BASE}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: auth },
        body: JSON.stringify(body),
      });
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        code: "LLM_ERROR",
        error: `LLM API error ${res.status}: ${body.slice(0, 400)}`,
      };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) {
      return { ok: false, code: "LLM_EMPTY", error: "The model returned an empty response." };
    }
    const promptTokens = json.usage?.prompt_tokens ?? 0;
    const completionTokens = json.usage?.completion_tokens ?? 0;
    return {
      ok: true,
      text,
      model: json.model ?? LLM_MODEL,
      promptTokens,
      completionTokens,
      costCents: estimateCostCents(promptTokens, completionTokens),
    };
  } catch (err) {
    return {
      ok: false,
      code: "LLM_ERROR",
      error: err instanceof Error ? err.message : "LLM request failed",
    };
  }
}

export async function invokeVision(opts: {
  prompt: string;
  imageBase64: string;
  mime: string;
}): Promise<LlmResult> {
  const auth = await authHeader();
  if (!auth) {
    return {
      ok: false,
      code: "LLM_UNAVAILABLE",
      error:
        "Vision analysis is not available. The original is preserved. The item is in review — identity was not invented.",
    };
  }
  try {
    const res = await fetch(`${LLM_BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        model: WIRE_MODEL,
        max_tokens: 800,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              "You analyze images for cataloging. Describe visible geometry, color, text, and defects. Never invent a brand, title, person, or identity. If uncertain, say uncertain. Return JSON only: {description, text_seen, quality, confidence, uncertain_reasons}.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: redactSecrets(opts.prompt) },
              {
                type: "image_url",
                image_url: {
                  url: `data:${opts.mime};base64,${opts.imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        code: "LLM_ERROR",
        error: `LLM vision error ${res.status}: ${body.slice(0, 400)}`,
      };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };
    const text = json.choices?.[0]?.message?.content ?? "";
    if (!text.trim()) {
      return { ok: false, code: "LLM_EMPTY", error: "Vision returned empty." };
    }
    const promptTokens = json.usage?.prompt_tokens ?? 0;
    const completionTokens = json.usage?.completion_tokens ?? 0;
    return {
      ok: true,
      text,
      model: json.model ?? LLM_MODEL,
      promptTokens,
      completionTokens,
      costCents: estimateCostCents(promptTokens, completionTokens),
    };
  } catch (err) {
    return {
      ok: false,
      code: "LLM_ERROR",
      error: err instanceof Error ? err.message : "Vision request failed",
    };
  }
}
