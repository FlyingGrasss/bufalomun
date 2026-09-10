import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "bufalomun_admin";
const TTL_SECONDS = 8 * 60 * 60;
type Session = { exp: number; version: string };

function signature(value: string) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(value).digest("base64url"); }
function encode(session: Session) { const payload = Buffer.from(JSON.stringify(session)).toString("base64url"); return `${payload}.${signature(payload)}`; }
function decode(value: string): Session | null {
  const [payload, supplied] = value.split("."); if (!payload || !supplied) return null;
  const expected = signature(payload); const left = Buffer.from(expected); const right = Buffer.from(supplied);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try { const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session; return session.exp > Date.now() && session.version === (process.env.ADMIN_SESSION_VERSION || "1") ? session : null; } catch { return null; }
}
export async function isAdmin() { const value = (await cookies()).get(COOKIE)?.value; return Boolean(value && process.env.ADMIN_SESSION_SECRET && decode(value)); }
export async function createAdminSession() { (await cookies()).set(COOKIE, encode({ exp: Date.now() + TTL_SECONDS * 1000, version: process.env.ADMIN_SESSION_VERSION || "1" }), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL_SECONDS }); }
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
export function verifyAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD_HASH || ""; const [salt, expectedHex] = configured.split(":");
  if (!salt || !expectedHex || password.length > 256) return false;
  const actual = scryptSync(password, salt, 64); const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function assertOrigin() { const expected = process.env.ADMIN_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL; if (!expected) return process.env.NODE_ENV !== "production"; return true; }
