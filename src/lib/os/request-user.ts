import { DEV_USER_ID, getSessionUser } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";
import { authenticateMcp } from "./mcp.ts";

const authOff = import.meta.env.VITE_AUTH_ENABLED === "false";

export async function userIdFromRequest(request: Request): Promise<string> {
  const authz = request.headers.get("authorization") ?? "";
  const bearer = authz.toLowerCase().startsWith("bearer ") ? authz.slice(7).trim() : null;
  const session = await getSessionUser(bearer ?? undefined);
  if (session?.id) return session.id;
  if (bearer) {
    const sql = await getSql();
    return authenticateMcp(sql, { token: bearer });
  }
  if (authOff) return DEV_USER_ID;
  const err = new Error("Unauthorized");
  (err as Error & { status: number }).status = 401;
  throw err;
}
