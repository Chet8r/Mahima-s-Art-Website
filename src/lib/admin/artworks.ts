"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { cloudinary } from "@/lib/cloudinary";
import type { ArtworkStatus } from "@/lib/artwork-types";

export type ArtworkFormInput = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  pricePence: number;
  status: ArtworkStatus;
  description: string;
};

export type UploadedImage = {
  publicId: string;
  width: number | null;
  height: number | null;
  alt: string;
};

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/art/[slug]", "page");
}

function revalidateAll() {
  revalidatePublic();
  revalidatePath("/admin", "layout");
}

export async function createArtwork(
  input: ArtworkFormInput,
  images: UploadedImage[]
): Promise<ActionResult> {
  const db = supabaseAdmin();

  const { data: maxRow } = await db
    .from("artworks")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxRow?.position ?? 0) + 1;

  const { data: artwork, error } = await db
    .from("artworks")
    .insert({
      slug: input.slug,
      title: input.title,
      year: input.year,
      medium: input.medium,
      dimensions: input.dimensions,
      price_pence: input.pricePence,
      status: input.status,
      description: input.description,
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error || !artwork) {
    return { ok: false, error: error?.message ?? "Failed to create artwork" };
  }

  if (images.length > 0) {
    const rows = images.map((img, i) => ({
      artwork_id: artwork.id,
      cloudinary_public_id: img.publicId,
      alt: img.alt || input.title,
      position: i,
      is_primary: i === 0,
      width: img.width,
      height: img.height,
    }));
    const { error: imgError } = await db.from("artwork_images").insert(rows);
    if (imgError) {
      return { ok: false, error: imgError.message };
    }
  }

  revalidateAll();
  return { ok: true, id: artwork.id };
}

export async function updateArtwork(
  id: string,
  input: ArtworkFormInput
): Promise<ActionResult> {
  const db = supabaseAdmin();
  const { error } = await db
    .from("artworks")
    .update({
      slug: input.slug,
      title: input.title,
      year: input.year,
      medium: input.medium,
      dimensions: input.dimensions,
      price_pence: input.pricePence,
      status: input.status,
      description: input.description,
    })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true, id };
}

export async function deleteArtwork(id: string): Promise<ActionResult> {
  const db = supabaseAdmin();

  const { data: imageRows, error: imgFetchError } = await db
    .from("artwork_images")
    .select("cloudinary_public_id")
    .eq("artwork_id", id);

  if (imgFetchError) return { ok: false, error: imgFetchError.message };

  for (const img of imageRows ?? []) {
    if (img.cloudinary_public_id.startsWith("placeholder/")) continue;
    try {
      await cloudinary.uploader.destroy(img.cloudinary_public_id);
    } catch (e) {
      console.error("Cloudinary delete failed", img.cloudinary_public_id, e);
    }
  }

  const { error } = await db.from("artworks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true, id };
}

export async function reorderArtworks(
  orderedIds: string[]
): Promise<ActionResult> {
  const db = supabaseAdmin();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await db
      .from("artworks")
      .update({ position: i + 1 })
      .eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  revalidateAll();
  return { ok: true, id: orderedIds[0] ?? "" };
}

export async function setArtworkPublished(
  id: string,
  isPublished: boolean
): Promise<ActionResult> {
  const db = supabaseAdmin();
  const { error } = await db
    .from("artworks")
    .update({ is_published: isPublished })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id };
}

export async function addArtworkImage(
  artworkId: string,
  image: UploadedImage
): Promise<ActionResult> {
  const db = supabaseAdmin();

  const { data: existing } = await db
    .from("artwork_images")
    .select("id, position")
    .eq("artwork_id", artworkId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (existing?.position ?? -1) + 1;
  const isFirst = !existing;

  const { error } = await db.from("artwork_images").insert({
    artwork_id: artworkId,
    cloudinary_public_id: image.publicId,
    alt: image.alt,
    position: nextPosition,
    is_primary: isFirst,
    width: image.width,
    height: image.height,
  });

  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id: artworkId };
}

export async function deleteArtworkImage(
  imageId: string
): Promise<ActionResult> {
  const db = supabaseAdmin();

  const { data: img, error: fetchError } = await db
    .from("artwork_images")
    .select("artwork_id, cloudinary_public_id, is_primary")
    .eq("id", imageId)
    .maybeSingle();

  if (fetchError || !img) {
    return { ok: false, error: fetchError?.message ?? "Image not found" };
  }

  if (!img.cloudinary_public_id.startsWith("placeholder/")) {
    try {
      await cloudinary.uploader.destroy(img.cloudinary_public_id);
    } catch (e) {
      console.error("Cloudinary delete failed", img.cloudinary_public_id, e);
    }
  }

  const { error } = await db.from("artwork_images").delete().eq("id", imageId);
  if (error) return { ok: false, error: error.message };

  if (img.is_primary) {
    const { data: next } = await db
      .from("artwork_images")
      .select("id")
      .eq("artwork_id", img.artwork_id)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (next) {
      await db
        .from("artwork_images")
        .update({ is_primary: true })
        .eq("id", next.id);
    }
  }

  revalidateAll();
  return { ok: true, id: img.artwork_id };
}

export async function setPrimaryImage(
  imageId: string
): Promise<ActionResult> {
  const db = supabaseAdmin();

  const { data: img, error: fetchError } = await db
    .from("artwork_images")
    .select("artwork_id")
    .eq("id", imageId)
    .maybeSingle();

  if (fetchError || !img) {
    return { ok: false, error: fetchError?.message ?? "Image not found" };
  }

  const { error: clearError } = await db
    .from("artwork_images")
    .update({ is_primary: false })
    .eq("artwork_id", img.artwork_id);
  if (clearError) return { ok: false, error: clearError.message };

  const { error: setError } = await db
    .from("artwork_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (setError) return { ok: false, error: setError.message };

  revalidateAll();
  return { ok: true, id: img.artwork_id };
}
