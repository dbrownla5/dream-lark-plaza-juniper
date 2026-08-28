import { Link, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Today" },
  { to: "/intake", label: "Bring in" },
  { to: "/agents", label: "Occupations" },
  { to: "/work", label: "Work" },
  { to: "/review", label: "Review" },
  { to: "/context", label: "Memory" },
  { to: "/system", label: "System" },
] as const;

export function Shell({ children, title, lede }: { children: ReactNode; title: string; lede?: string }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setGaveUp(false);
      return;
    }
    const t = window.setTimeout(() => setGaveUp(true), 4000);
    return () => window.clearTimeout(t);
  }, [isPending]);

  if (isPending && !gaveUp) {
    return (
      <div className="min-h-screen bg-bg text-fg">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-display text-lg">Well Lived Citizen</p>
          <p className="mt-2 text-sm text-muted">Opening your system…</p>
          <div className="mt-6 h-40 animate-pulse rounded-xl bg-border/70" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="min-w-0">
            <p className="font-display text-lg tracking-tight text-fg">Well Lived Citizen</p>
            <p className="text-xs text-muted">Occupational OS · not marked WORKING</p>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[12rem] truncate text-sm text-muted sm:inline">
              {user.displayName ?? user.primaryEmail}
            </span>
            <UserButton />
          </div>
        </div>
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "shrink-0 rounded-md px-3 py-2 text-sm no-underline transition-colors duration-150 " +
                  (active
                    ? "bg-primary text-primary-fg"
                    : "text-muted hover:bg-border/60 hover:text-fg")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 max-w-2xl">
          <h1 className="font-display text-3xl tracking-tight text-fg">{title}</h1>
          {lede ? <p className="mt-2 text-muted">{lede}</p> : null}
        </header>
        {children}
      </main>
    </div>
  );
}

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-fg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Status({ value }: { value: string }) {
  const tone =
    value === "done"
      ? "text-ok"
      : value === "blocked" || value === "failed"
        ? "text-danger"
        : value === "waiting_approval" || value === "review"
          ? "text-review"
          : "text-muted";
  return <span className={`font-mono text-xs uppercase tracking-wide ${tone}`}>{value}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
