import type { ReactNode } from "react";

export function Page({
  title,
  lede,
  children,
  action,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-28 pt-8 sm:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h1>
          {lede && <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-stone-600">{lede}</p>}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center text-[15px] text-stone-500">
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  kind = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  kind?: "primary" | "quiet";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-40";
  const styles =
    kind === "primary"
      ? "bg-stone-900 text-white hover:bg-stone-700"
      : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50";
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const TONE: Record<string, string> = {
  preserved: "bg-stone-100 text-stone-700",
  analyzing: "bg-amber-100 text-amber-800",
  cataloged: "bg-emerald-100 text-emerald-800",
  review: "bg-amber-100 text-amber-800",
  failed: "bg-rose-100 text-rose-800",
  queued: "bg-stone-100 text-stone-700",
  running: "bg-amber-100 text-amber-800",
  waiting_approval: "bg-violet-100 text-violet-800",
  handed_off: "bg-sky-100 text-sky-800",
  blocked: "bg-rose-100 text-rose-800",
  done: "bg-emerald-100 text-emerald-800",
};

const LABEL: Record<string, string> = {
  preserved: "Saved",
  analyzing: "Looking at it",
  cataloged: "Filed",
  review: "Needs you",
  failed: "Failed",
  waiting_approval: "Waiting on you",
  handed_off: "Passed on",
};

export function Status({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
        TONE[value] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {LABEL[value] ?? value.replace(/_/g, " ")}
    </span>
  );
}

export function Note({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "bad" }) {
  const styles =
    tone === "bad"
      ? "border-rose-200 bg-rose-50 text-rose-900"
      : "border-amber-200 bg-amber-50 text-amber-900";
  return (
    <p className={`mt-2 rounded-xl border px-3 py-2 text-sm leading-relaxed ${styles}`}>{children}</p>
  );
}
