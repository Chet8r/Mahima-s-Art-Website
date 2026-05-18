import { NextResponse } from "next/server";
import { signUpload, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";
import { assertAdmin } from "@/lib/admin/guard";

export async function POST() {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const folder = "mahi-art";
  const signed = signUpload({
    folder,
    upload_preset: CLOUDINARY_UPLOAD_PRESET,
  });

  return NextResponse.json({
    ...signed,
    folder,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  });
}
