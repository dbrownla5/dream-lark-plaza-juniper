import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user } = useCurrentUserState();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  if (!authEnabled || user) return <Navigate to="/" />;

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Well Lived Citizen</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-fg">Your operating system</h1>
        <p className="mt-3 text-sm text-muted">One sign-in so your words and files stay yours.</p>
        <div className="mt-6 space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              disabled={busy !== null}
              onClick={() => {
                setErr(null);
                setBusy(p.providerId);
                void signIn(p.providerId, { callbackURL: "/" }).catch((e: unknown) => {
                  setErr(e instanceof Error ? e.message : "Sign-in did not open.");
                  setBusy(null);
                });
              }}
              className="min-h-11 w-full rounded-md border border-border bg-bg px-4 py-3 text-sm font-medium text-fg hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {busy === p.providerId ? "Opening…" : `Continue with ${p.label}`}
            </button>
          ))}
        </div>
        {err ? <p className="mt-4 text-sm text-danger">{err}</p> : null}
      </div>
    </main>
  );
}
