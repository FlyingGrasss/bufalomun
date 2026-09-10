"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { allowRequest } from "@/lib/applications/security";
import { clearAdminSession, createAdminSession, isAdmin, verifyAdminPassword } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { normalizeSettings } from "@/lib/site-settings";
import { toSlug } from "@/lib/slug";

async function requireAdmin() { if (!await isAdmin()) redirect("/admin"); }
async function validOrigin() { const source = (await headers()).get("origin"); const expected = process.env.ADMIN_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL; return !expected || source === expected; }

export async function login(formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!await allowRequest(`${ip}:admin-login`) || !await validOrigin()) redirect("/admin?error=login");
  if (!verifyAdminPassword(String(formData.get("password") || ""))) redirect("/admin?error=login");
  await createAdminSession(); redirect("/admin");
}
export async function logout() { await clearAdminSession(); redirect("/"); }
export async function saveSettings(formData: FormData) {
  await requireAdmin(); if (!await validOrigin()) throw new Error("Invalid origin");
  let data: unknown; try { data = JSON.parse(String(formData.get("settings") || "")); } catch { redirect("/admin?error=json"); }
  const settings = normalizeSettings(data);
  await prisma.conferenceSettings.upsert({ where: { id: 1 }, create: { id: 1, data: settings }, update: { data: settings } });
  updateTag("site-content"); redirect("/admin?saved=settings");
}
export async function createCommittee(formData: FormData) {
  await requireAdmin(); const name = String(formData.get("name") || "").trim(); if (!name) return;
  await prisma.committee.create({ data: { name, slug: toSlug(name), description: String(formData.get("description") || ""), imageUrl: String(formData.get("imageUrl") || "") || null, isPublished: formData.get("isPublished") === "on" } }); updateTag("site-content"); redirect("/admin?saved=committee");
}
export async function deleteCommittee(formData: FormData) { await requireAdmin(); await prisma.committee.delete({ where: { id: Number(formData.get("id")) } }); updateTag("site-content"); redirect("/admin"); }
export async function updateCommittee(formData: FormData) {
  await requireAdmin(); const id = Number(formData.get("id")); const name = String(formData.get("name") || "").trim(); if (!id || !name) return;
  await prisma.committee.update({ where: { id }, data: { name, slug: toSlug(name), description: String(formData.get("description") || ""), imageUrl: String(formData.get("imageUrl") || "") || null, isPublished: formData.get("isPublished") === "on" } }); updateTag("site-content"); redirect("/admin?saved=committee");
}
export async function createTeamMember(formData: FormData) {
  await requireAdmin(); const name = String(formData.get("name") || "").trim(); if (!name) return;
  await prisma.teamMember.create({ data: { name, slug: toSlug(name), role: String(formData.get("role") || ""), bio: String(formData.get("bio") || ""), imageUrl: String(formData.get("imageUrl") || "") || null, instagram: String(formData.get("instagram") || "") || null, isPublished: formData.get("isPublished") === "on" } }); updateTag("site-content"); redirect("/admin?saved=team");
}
export async function deleteTeamMember(formData: FormData) { await requireAdmin(); await prisma.teamMember.delete({ where: { id: Number(formData.get("id")) } }); updateTag("site-content"); redirect("/admin"); }
export async function updateTeamMember(formData: FormData) {
  await requireAdmin(); const id = Number(formData.get("id")); const name = String(formData.get("name") || "").trim(); if (!id || !name) return;
  await prisma.teamMember.update({ where: { id }, data: { name, slug: toSlug(name), role: String(formData.get("role") || ""), bio: String(formData.get("bio") || ""), imageUrl: String(formData.get("imageUrl") || "") || null, instagram: String(formData.get("instagram") || "") || null, isPublished: formData.get("isPublished") === "on" } }); updateTag("site-content"); redirect("/admin?saved=team");
}
