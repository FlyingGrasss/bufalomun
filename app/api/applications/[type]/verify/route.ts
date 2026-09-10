import { NextResponse } from "next/server";
import { appendApplication } from "@/lib/applications/sheets";
import { allowRequest, equalHash, hashCode, requestIp, sha256, stableJson } from "@/lib/applications/security";
import { isApplicationType, validateApplication } from "@/lib/applications/validation";
import { prisma } from "@/lib/prisma";
import { getPublicContent } from "@/lib/site-settings";

const error = (status: number, code: string, message: string, details?: unknown) => NextResponse.json({ ok: false, error: { code, message, details } }, { status });

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) return error(404, "APPLICATION_NOT_FOUND", "This application does not exist.");
  if (!process.env.DATABASE_URL || !process.env.APPLICATION_CODE_SECRET) return error(503, "SERVICE_NOT_CONFIGURED", "Applications are being prepared. Please try again later.");
  const ip = requestIp(request);
  if (!await allowRequest(`${ip}:${type}:verify`)) return error(429, "RATE_LIMITED", "Too many attempts. Please wait before trying again.");
  let body: { challengeId?: unknown; code?: unknown; payload?: unknown };
  try { body = await request.json(); } catch { return error(400, "INVALID_JSON", "The verification request could not be read."); }
  if (typeof body.challengeId !== "string" || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) return error(422, "INVALID_CODE", "Enter the six-digit code from your email.");
  const { settings } = await getPublicContent();
  const result = validateApplication(type, body.payload, settings);
  if (!result.ok) return error(422, "VALIDATION_FAILED", "Please review your application.", result.errors);
  const challenge = await prisma.verificationChallenge.findUnique({ where: { id: body.challengeId } });
  if (!challenge || challenge.email !== result.email || challenge.applicationType !== type) return error(400, "CHALLENGE_INVALID", "This verification request is no longer valid.");
  if (challenge.expiresAt <= new Date()) return error(410, "CODE_EXPIRED", "This code has expired. Request a new one.");
  if (challenge.attempts >= 5) return error(429, "CODE_LOCKED", "Too many incorrect codes. Request a new one.");
  if (!equalHash(challenge.payloadHash, sha256(stableJson(result.payload)))) return error(409, "APPLICATION_CHANGED", "Your application changed after the code was sent. Request a new code.");
  if (!equalHash(challenge.codeHash, hashCode(body.code, challenge.id))) {
    await prisma.verificationChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    return error(422, "INVALID_CODE", "That code is not correct.");
  }

  const previous = await prisma.submissionClaim.findUnique({ where: { email_applicationType: { email: result.email, applicationType: type } } });
  if (previous?.status === "COMPLETED") return NextResponse.json({ ok: true, alreadySubmitted: true });
  const claim = await prisma.submissionClaim.upsert({ where: { email_applicationType: { email: result.email, applicationType: type } }, create: { email: result.email, applicationType: type, status: "PROCESSING" }, update: { status: "PROCESSING", attempts: { increment: 1 }, lastErrorCode: null } });
  try {
    await appendApplication(type, result.payload, claim.id);
    await prisma.$transaction([
      prisma.submissionClaim.update({ where: { email_applicationType: { email: result.email, applicationType: type } }, data: { status: "COMPLETED", completedAt: new Date() } }),
      prisma.verificationChallenge.delete({ where: { id: challenge.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (cause) {
    const code = cause instanceof Error && cause.message === "SHEETS_NOT_CONFIGURED" ? "SHEETS_NOT_CONFIGURED" : "DELIVERY_FAILED";
    await prisma.submissionClaim.update({ where: { email_applicationType: { email: result.email, applicationType: type } }, data: { status: "FAILED", lastErrorCode: code } }).catch(() => undefined);
    return error(503, code, "Your application was verified but could not be delivered. Please try submitting again.");
  }
}
