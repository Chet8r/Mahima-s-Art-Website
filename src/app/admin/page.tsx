import Link from "next/link";
import { listAdminArtworks, thumbUrl } from "@/lib/admin/queries";
import {
  SortableArtworkList,
  type SortableArtwork,
} from "@/components/admin/sortable-list";

export default async function AdminHome() {
  const artworks = await listAdminArtworks();
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const items: SortableArtwork[] = artworks.map((a) => {
    const primary = a.images.find((i) => i.isPrimary) ?? a.images[0];
    return {
      id: a.id,
      title: a.title,
      medium: a.medium,
      dimensions: a.dimensions,
      year: a.year,
      pricePence: a.pricePence,
      status: a.status,
      isPublished: a.isPublished,
      thumbnailUrl: primary ? thumbUrl(primary.publicId, cloud) : null,
      thumbnailAlt: primary?.alt ?? a.title,
    };
  });

  return (
    <section className="mx-auto max-w-6xl px-6 sm:px-10 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold mb-2">
            Admin
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-navy leading-tight">
            Artworks
          </h1>
          <p className="mt-2 text-sm text-muted">
            {artworks.length} {artworks.length === 1 ? "piece" : "pieces"} ·{" "}
            {artworks.filter((a) => a.isPublished).length} public,{" "}
            {artworks.filter((a) => !a.isPublished).length} hidden.
          </p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center h-11 px-6 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors"
        >
          + New artwork
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-line">
          <p className="font-display text-xl text-navy">No artworks yet</p>
          <p className="mt-2 text-sm text-muted">
            Add your first piece to get started.
          </p>
        </div>
      ) : (
        <SortableArtworkList initial={items} />
      )}
    </section>
  );
}
