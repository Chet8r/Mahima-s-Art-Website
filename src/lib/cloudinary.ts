import "server-only";
import { v2 as cloudinary } from "cloudinary";

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloud) throw new Error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
if (!apiKey) throw new Error("Missing CLOUDINARY_API_KEY");
if (!apiSecret) throw new Error("Missing CLOUDINARY_API_SECRET");

cloudinary.config({
  cloud_name: cloud,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.CLOUDINARY_UPLOAD_PRESET ?? "mahi_art_signed";

/**
 * Sign upload params on the server so the browser can upload directly
 * to Cloudinary without ever seeing the API secret.
 */
export function signUpload(params: Record<string, string | number>) {
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = { timestamp, ...params };
  const signature = cloudinary.utils.api_sign_request(toSign, apiSecret!);
  return { signature, timestamp, apiKey: apiKey!, cloudName: cloud! };
}
