import { useEffect, useMemo, useState } from "react";
import { api, type Agent } from "../api";
import { Page } from "../ui";

const FAMILY_LABEL: Record<string, string> = {
  navigation: "Keeping things straight",
  career: "Career and work",
  writing: "Writing and correspondence",
  business: "Business, offers, marketing",
  records: "Money and records",
  resale: "Resale",
  media: "Photos, files, originals",
  technical: "Technical",
};

const FAMILY_ORDER = [
  "navigation",
  "media",
  "resale",
  "writing",
  "business",
  "records",
  "career",
  "technical",
];

export function Agents({ onOpen }: { onOpen: (agent: Agent) => void }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get<{ agents: Agent[] }>("/agents").then((r) => setAgents(r.agents));
  }, []);

  const grouped = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const matched = needle
      ? agents.filter(
          (a) =>
            a.name.toLowerCase().includes(needle) ||
            a.job.toLowerCase().includes(needle) ||
            a.inScope.toLowerCase().includes(needle),
        )
      : agents;
    return FAMILY_ORDER.map((f) => ({
      family: f,
      label: FAMILY_LABEL[f] ?? f,
      items: matched.filter((a) => a.family === f),
    })).filter((g) => g.items.length);
  }, [agents, q]);

  return (
    <Page
      title="Your agents"
      lede="Forty of them, each with one occupation. Open one and you're in that agent's own chat — it only does its own job, and it says so when something belongs to someone else."
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find one — try 'photos', 'pricing', 'resume'…"
        className="mb-7 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-[15px] outline-none focus:border-stone-500"
      />

      {agents.length === 0 && <p className="text-stone-500">Loading…</p>}

      <div className="space-y-8">
        {grouped.map((g) => (
          <section key={g.family}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {g.label}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onOpen(a)}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-stone-400 hover:shadow"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[15px] font-semibold text-stone-900">{a.name}</h3>
                    <span className="text-xs text-stone-400">#{a.id}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-stone-600">
                    {a.job}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-stone-500 group-hover:text-stone-900">
                    Open this chat →
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
