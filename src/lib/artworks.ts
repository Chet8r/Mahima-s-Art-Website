import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import type { Artwork, ArtworkStatus } from "@/lib/artwork-types";

export type { Artwork, ArtworkStatus };
export { formatPrice } from "@/lib/format";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function imageUrlFromPublicId(publicId: string): string {
  if (publicId.startsWith("placeholder/")) {
    const seed = publicId.replace("placeholder/", "");
    return `https://picsum.photos/seed/${seed}/800/1000`;
  }
  if (!CLOUDINARY_CLOUD) {
    return `https://picsum.photos/seed/${encodeURIComponent(publicId)}/800/1000`;
  }
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto/${publicId}`;
}

type ArtworkWithImages = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  price_pence: number;
  status: ArtworkStatus;
  description: string;
  position: number;
  artwork_images: {
    cloudinary_public_id: string;
    alt: string;
    is_primary: boolean;
    position: number;
    width: number | null;
    height: number | null;
  }[];
};

function toArtwork(row: ArtworkWithImages): Artwork {
  const sorted = [...row.artwork_images].sort(
    (a, b) => a.position - b.position
  );
  const primary = sorted.find((i) => i.is_primary) ?? sorted[0];
  const ordered = primary
    ? [primary, ...sorted.filter((i) => i !== primary)]
    : sorted;

  const primaryAspect =
    primary && primary.width && primary.height
      ? primary.width / primary.height
      : null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions,
    price: row.price_pence / 100,
    status: row.status,
    imageUrl: primary
      ? imageUrlFromPublicId(primary.cloudinary_public_id)
      : `https://picsum.photos/seed/${row.slug}/800/1000`,
    primaryAspect,
    images: ordered.map((i) => ({
      url: imageUrlFromPublicId(i.cloudinary_public_id),
      alt: i.alt || row.title,
      width: i.width,
      height: i.height,
    })),
    description: row.description,
  };
}

const ARTWORK_COLUMNS =
  "id, slug, title, year, medium, dimensions, price_pence, status, description, position, artwork_images(cloudinary_public_id, alt, is_primary, position, width, height)";

export async function getAllArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabaseServer
    .from("artworks")
    .select(ARTWORK_COLUMNS)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Failed to load artworks", error);
    return [];
  }

  return (data as ArtworkWithImages[]).map(toArtwork);
}

export async function getArtworkBySlug(
  slug: string
): Promise<Artwork | null> {
  const { data, error } = await supabaseServer
    .from("artworks")
    .select(ARTWORK_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load artwork", error);
    return null;
  }
  if (!data) return null;
  return toArtwork(data as ArtworkWithImages);
}
