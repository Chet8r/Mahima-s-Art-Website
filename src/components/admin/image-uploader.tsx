"use client";

import { useCallback, useState } from "react";

export type UploadedImage = {
  publicId: string;
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
};

type Props = {
  value: UploadedImage[];
  onChange: (next: UploadedImage[]) => void;
};

type CloudinaryResponse = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
};

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadPreset: string;
};

async function uploadOne(file: File): Promise<UploadedImage> {
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
    const text = await uploadRes.text();
    throw new Error(`Cloudinary error: ${text}`);
  }
  const data: CloudinaryResponse = await uploadRes.json();

  return {
    publicId: data.public_id,
    url: data.secure_url,
    width: data.width,
    height: data.height,
    alt: file.name.replace(/\.[^.]+$/, ""),
  };
}

export function ImageUploader({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setBusy(true);
      setError(null);
      try {
        const uploads = await Promise.all(
          Array.from(files).map((f) => uploadOne(f))
        );
        onChange([...value, ...uploads]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [value, onChange]
  );

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function setAlt(idx: number, alt: string) {
    onChange(value.map((img, i) => (i === idx ? { ...img, alt } : img)));
  }

  return (
    <div>
      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-navy mb-2">
          Images {value.length > 0 && `(${value.length})`}
        </span>
        <div className="border-2 border-dashed border-line bg-white hover:border-navy/40 transition-colors p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:border file:border-navy file:bg-cream file:text-navy file:text-xs file:uppercase file:tracking-[0.18em] file:cursor-pointer hover:file:bg-navy hover:file:text-cream"
          />
          <p className="mt-3 text-xs text-muted">
            {busy
              ? "Uploading..."
              : "Drop files or click to browse. The first image is shown on the grid."}
          </p>
        </div>
      </label>

      {error && (
        <p className="mt-2 text-xs text-[#7f1d1d]">{error}</p>
      )}

      {value.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((img, idx) => (
            <li
              key={img.publicId}
              className="relative bg-cream-soft p-2 border border-line"
            >
              {idx === 0 && (
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
              <input
                type="text"
                value={img.alt}
                onChange={(e) => setAlt(idx, e.target.value)}
                placeholder="Alt text"
                className="mt-2 w-full text-xs px-2 py-1.5 bg-white border border-line focus:border-navy outline-none"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="mt-2 w-full text-[10px] uppercase tracking-[0.18em] py-1.5 border border-line text-muted hover:border-[#7f1d1d] hover:text-[#7f1d1d] transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
