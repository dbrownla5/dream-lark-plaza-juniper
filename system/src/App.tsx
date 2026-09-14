import { useEffect, useState } from "react";
import { api, type Agent } from "./api";
import { Today } from "./pages/Today";
import { Chat } from "./pages/Chat";
import { Agents } from "./pages/Agents";
import { Files } from "./pages/Files";
import { Work } from "./pages/Work";
import { Memory } from "./pages/Memory";

const NAV = [
  { route: "today", label: "Today" },
  { route: "chat", label: "Chat" },
  { route: "agents", label: "Agents" },
  { route: "photos", label: "Photos" },
  { route: "documents", label: "Documents" },
  { route: "work", label: "Work" },
  { route: "memory", label: "Memory" },
] as const;

function currentRoute(): string {
  return window.location.hash.replace(/^#\/?/, "") || "today";
}

export default function App() {
  const [route, setRoute] = useState(currentRoute);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    api
      .get<{ agents: Agent[] }>("/agents")
      .then((r) => setAgents(r.agents))
      .catch(() => {});
  }, []);

  function go(next: string) {
    window.location.hash = `/${next}`;
    setRoute(next);
    window.scrollTo(0, 0);
  }

  const agentMatch = /^agent\/(\d+)$/.exec(route);
  const openAgent = agentMatch ? agents.find((a) => a.id === Number(agentMatch[1])) : undefined;
  const navActive = agentMatch ? "agents" : route;

  let page;
  if (agentMatch) {
    page = openAgent ? (
      <Chat threadId={openAgent.threadId} agent={openAgent} />
    ) : (
      <div className="p-8 text-stone-500">Opening…</div>
    );
  } else {
    switch (route) {
      case "chat":
        page = <Chat threadId="general" />;
        break;
      case "agents":
        page = <Agents onOpen={(a) => go(`agent/${a.id}`)} />;
        break;
      case "photos":
        page = <Files surface="photos" />;
        break;
      case "documents":
        page = <Files surface="documents" />;
        break;
      case "work":
        page = <Work />;
        break;
      case "memory":
        page = <Memory />;
        break;
      default:
        page = <Today go={go} />;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Desktop: a rail you can see at a glance. Mobile: a bar under your thumb. */}
      <nav className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-stone-200 bg-white px-3 py-6 sm:flex">
        <p className="mb-6 px-3 text-sm font-semibold tracking-tight text-stone-900">
          Dayna's system
        </p>
        {NAV.map((n) => (
          <button
            key={n.route}
            onClick={() => go(n.route)}
            className={`rounded-xl px-3 py-2.5 text-left text-[15px] font-medium transition ${
              navActive === n.route
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {n.label}
          </button>
        ))}
        {agentMatch && openAgent && (
          <p className="mt-4 border-t border-stone-200 px-3 pt-4 text-sm leading-snug text-stone-500">
            Open: {openAgent.name}
          </p>
        )}
      </nav>

      <main className="sm:pl-60">{page}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex gap-1 overflow-x-auto border-t border-stone-200 bg-white px-2 py-2 sm:hidden">
        {NAV.map((n) => (
          <button
            key={n.route}
            onClick={() => go(n.route)}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
              navActive === n.route ? "bg-stone-900 text-white" : "text-stone-600"
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
