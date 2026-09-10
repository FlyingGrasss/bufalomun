import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in to upload files." } }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: { code: "BLOB_NOT_CONFIGURED", message: "Image uploads are not configured." } }, { status: 503 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ error: { code: "INVALID_FILE", message: "Choose a JPG, PNG, or WebP image smaller than 5 MB." } }, { status: 422 });
  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const blob = await put(`bufalomun/${crypto.randomUUID()}.${extension}`, file, { access: "public", addRandomSuffix: false });
  return NextResponse.json({ url: blob.url });
}
