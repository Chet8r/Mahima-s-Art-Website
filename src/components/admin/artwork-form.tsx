"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader, type UploadedImage } from "./image-uploader";
import type { ArtworkStatus } from "@/lib/artwork-types";

type FormValues = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  priceGbp: string;
  status: ArtworkStatus;
  description: string;
};

const STATUSES: ArtworkStatus[] = ["available", "reserved", "sold"];

const EMPTY: FormValues = {
  slug: "",
  title: "",
  year: new Date().getFullYear(),
  medium: "Oil on canvas",
  dimensions: "",
  priceGbp: "",
  status: "available",
  description: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type Props = {
  initialValues?: Partial<FormValues>;
  initialImages?: UploadedImage[];
  mode: "create" | "edit";
  onSubmit: (
    values: FormValues,
    images: UploadedImage[]
  ) => Promise<{ ok: boolean; error?: string }>;
  showImageUploader?: boolean;
};

export function ArtworkForm({
  initialValues,
  initialImages,
  mode,
  onSubmit,
  showImageUploader = true,
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    ...EMPTY,
    ...initialValues,
  });
  const [images, setImages] = useState<UploadedImage[]>(initialImages ?? []);
  const [slugTouched, setSlugTouched] = useState(
    Boolean(initialValues?.slug)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function onTitleChange(title: string) {
    update("title", title);
    if (!slugTouched && mode === "create") {
      setValues((v) => ({ ...v, title, slug: slugify(title) }));
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (showImageUploader && mode === "create" && images.length === 0) {
      setError("Add at least one image.");
      return;
    }
    startTransition(async () => {
      const result = await onSubmit(values, images);
      if (result.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title">
          <input
            type="text"
            required
            value={values.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Slug" hint="URL — auto from title, edit if needed">
          <input
            type="text"
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
            className={inputClasses}
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            required
            min={1900}
            max={2100}
            value={values.year}
            onChange={(e) => update("year", Number(e.target.value))}
            className={inputClasses}
          />
        </Field>
        <Field label="Status">
          <select
            value={values.status}
            onChange={(e) =>
              update("status", e.target.value as ArtworkStatus)
            }
            className={inputClasses}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Medium">
          <input
            type="text"
            required
            value={values.medium}
            onChange={(e) => update("medium", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Dimensions" hint="e.g. 40 × 50 cm">
          <input
            type="text"
            required
            value={values.dimensions}
            onChange={(e) => update("dimensions", e.target.value)}
            className={inputClasses}
          />
        </Field>
        <Field label="Price (GBP)" hint="Whole pounds, no decimal">
          <input
            type="number"
            required
            min={0}
            step={1}
            value={values.priceGbp}
            onChange={(e) => update("priceGbp", e.target.value)}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className={`${inputClasses} resize-y`}
        />
      </Field>

      {showImageUploader && (
        <ImageUploader value={images} onChange={setImages} />
      )}

      {error && (
        <p className="text-sm text-[#7f1d1d] bg-[#7f1d1d]/5 border border-[#7f1d1d]/30 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-line">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending
            ? "Saving..."
            : mode === "create"
            ? "Create artwork"
            : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="inline-flex items-center justify-center h-11 px-7 border border-navy text-navy text-xs uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClasses =
  "w-full h-11 px-3 bg-white border border-line focus:border-navy outline-none transition-colors text-sm";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.18em] text-navy mb-2">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-muted mt-1.5">{hint}</span>}
    </label>
  );
}
