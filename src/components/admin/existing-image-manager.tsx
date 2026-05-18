"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addArtworkImage,
  deleteArtworkImage,
  setPrimaryImage,
} from "@/lib/admin/artworks";

export type ExistingImage = {
  id: string;
  publicId: string;
  alt: string;
  isPrimary: boolean;
  url: string;
};

type Props = {
  artworkId: string;
  images: ExistingImage[];
};

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadPreset: string;
};

type CloudinaryResponse = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
};

async function uploadOne(file: File) {
  const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Failed to get upload signature");
  const sign: SignResponse = await signRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", sign.folder);
  form.append("upload_preset", sign.uploadPreset);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!uploadRes.ok) {
    throw new Error(`Cloudinary error: ${await uploadRes.text()}`);
  }
  const data: CloudinaryResponse = await uploadRes.json();
  return {
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    alt: file.name.replace(/\.[^.]+$/, ""),
  };
}

export function ExistingImageManager({ artworkId, images }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onAdd(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const uploaded = await uploadOne(file);
        const result = await addArtworkImage(artworkId, uploaded);
        if (!result.ok) {
          setError(result.error);
          break;
        }
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function onDelete(imageId: string) {
    if (images.length <= 1) {
      alert("Each artwork must have at least one image.");
      return;
    }
    if (!confirm("Remove this image? It will be deleted from Cloudinary.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteArtworkImage(imageId);
      if (!result.ok) alert(`Delete failed: ${result.error}`);
      else router.refresh();
    });
  }

  function onSetPrimary(imageId: string) {
    startTransition(async () => {
      const result = await setPrimaryImage(imageId);
      if (!result.ok) alert(`Failed: ${result.error}`);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <p className="text-xs uppercase tracking-[0.18em] text-navy">
          Images ({images.length})
        </p>
        <label className="text-xs uppercase tracking-[0.18em] text-navy cursor-pointer hover:text-gold transition-colors">
          {busy ? "Uploading..." : "+ Add image"}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(e) => onAdd(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="mb-3 text-xs text-[#7f1d1d]">{error}</p>
      )}

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img) => (
          <li
            key={img.id}
            className="relative bg-cream-soft p-2 border border-line"
          >
            {img.isPrimary && (
              <span className="absolute top-3 left-3 z-10 px-1.5 py-0.5 bg-navy text-cream text-[9px] uppercase tracking-[0.2em]">
                Primary
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt}
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="mt-2 flex gap-2">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => onSetPrimary(img.id)}
                  disabled={pending}
                  className="flex-1 text-[10px] uppercase tracking-[0.18em] py-1.5 border border-navy text-navy hover:bg-navy hover:text-cream transition-colors disabled:opacity-50"
                >
                  Set primary
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(img.id)}
                disabled={pending}
                className="flex-1 text-[10px] uppercase tracking-[0.18em] py-1.5 border border-line text-muted hover:border-[#7f1d1d] hover:text-[#7f1d1d] transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
