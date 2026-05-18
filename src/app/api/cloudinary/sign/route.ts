import { NextResponse } from "next/server";
import { signUpload, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";

// TODO: gate this behind admin auth once auth is wired up.
// For now it's open so we can prototype uploads.

export async function POST() {
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
