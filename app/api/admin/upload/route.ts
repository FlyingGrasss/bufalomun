import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";


export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in to upload files." } },
      { status: 401 }
    );
  }

  const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseSecret) {
    return NextResponse.json(
      { error: { code: "SERVICE_UNCONFIGURED", message: "Supabase service key is not configured." } },
      { status: 503 }
    );
  }
  const projectRef = process.env.SUPABASE_PROJECT_REF || "ypiavkaiyeweqjycmwfx";
  const bucketName =
    process.env.SUPABASE_STORAGE_BUCKET || "bufalomun secretariat and committee images";

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File) || file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: { code: "INVALID_FILE", message: "Choose an image smaller than 25 MB." } },
      { status: 422 }
    );
  }

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const safeBase = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
  const fileName = `${Date.now()}-${safeBase}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const encodedBucket = encodeURIComponent(bucketName);
  const uploadUrl = `https://${projectRef}.supabase.co/storage/v1/object/${encodedBucket}/${fileName}`;

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseSecret,
        Authorization: `Bearer ${supabaseSecret}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: buffer,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Supabase storage upload failed:", res.status, errorText);
      return NextResponse.json(
        { error: { code: "UPLOAD_FAILED", message: "Could not upload image to storage bucket." } },
        { status: 500 }
      );
    }

    const publicUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${encodedBucket}/${fileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: { code: "UPLOAD_FAILED", message: error instanceof Error ? error.message : "Upload failed." } },
      { status: 500 }
    );
  }
}

