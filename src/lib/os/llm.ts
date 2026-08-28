import { redactSecrets } from "./guardrails.ts";

export const LLM_MODEL = "grok-4.5";
export const LLM_BASE = "https://api.x.ai/v1";

export function llmAvailable(): boolean {
  return Boolean(process.env.XAI_API_KEY?.trim());
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
}): Promise<LlmResult> {
  const apiKey = process.env.XAI_API_KEY?.trim();
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
    const res = await fetch(`${LLM_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: opts.maxTokens ?? 900,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        code: "LLM_ERROR",
        error: `xAI API error ${res.status}: ${body.slice(0, 400)}`,
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
  const apiKey = process.env.XAI_API_KEY?.trim();
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
        error: `xAI vision error ${res.status}: ${body.slice(0, 400)}`,
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
