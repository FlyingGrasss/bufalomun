import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const stableJson = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
};
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const makeCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
export const hashCode = (code: string, challengeId: string) => sha256(`${challengeId}:${code}:${process.env.APPLICATION_CODE_SECRET || "development-only"}`);
export function equalHash(a: string, b: string) { const left = Buffer.from(a); const right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right); }

let limiter: Ratelimit | null | undefined;
function getLimiter() {
  if (limiter !== undefined) return limiter;
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return limiter = null;
  limiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "15 m"), prefix: "bufalomun:applications" });
  return limiter;
}
export async function allowRequest(identity: string) {
  const service = getLimiter();
  if (!service) return process.env.NODE_ENV !== "production";
  try { return (await service.limit(identity)).success; } catch { return false; }
}
export function requestIp(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"; }
