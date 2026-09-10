import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const stableJson = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  return JSON.stringify(value);
};
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const makeCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
export const hashCode = (code: string, challengeId: string) => sha256(`${challengeId}:${code}:${process.env.APPLICATION_CODE_SECRET || "development-only"}`);
export function equalHash(a: string, b: string) { const left = Buffer.from(a); const right = Buffer.from(b); return left.length === right.length && timingSafeEqual(left, right); }

export async function allowRequest(_identity: string) { return true; }
export function requestIp(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"; }

