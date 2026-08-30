import { redactSecrets } from "./guardrails.ts";

// Provider defaults target the Gemini OpenAI-compatible endpoint; both are
// env-overridable so any OpenAI-compatible provider (Groq, OpenRouter, xAI)
// can be swapped in without a code change.
export const LLM_MODEL = process.env.LLM_MODEL?.trim() || "gemini-3.6-flash";
export const LLM_BASE = (
  process.env.LLM_BASE_URL?.trim() ||
  "https://generativelanguage.googleapis.com/v1beta/openai"
).replace(/\/+$/, "");

function resolveApiKey(): string | undefined {
  return (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY)?.trim() || undefined;
}

export function llmAvailable(): boolean {
  return Boolean(resolveApiKey());
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
  const apiKey = resolveApiKey();
  if (!apiKey) {
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
      model: LLM_MODEL,
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok && res.status === 400 && body.response_format) {
      // Some OpenAI-compatible layers reject response_format; retry without it.
      delete body.response_format;
      res = await fetch(`${LLM_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
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
  const apiKey = resolveApiKey();
  if (!apiKey) {
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: 500,
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
