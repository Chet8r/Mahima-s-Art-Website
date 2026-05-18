import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminArtwork, thumbUrl } from "@/lib/admin/queries";
import { EditArtworkForm } from "./form";
import { ExistingImageManager } from "@/components/admin/existing-image-manager";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getAdminArtwork(id);
  if (!artwork) notFound();

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const fullImageUrl = (publicId: string) => {
    if (publicId.startsWith("placeholder/")) {
      return thumbUrl(publicId, cloud);
    }
    if (!cloud) return thumbUrl(publicId, cloud);
    return `https://res.cloudinary.com/${cloud}/image/upload/c_fill,w_400,h_500,f_auto,q_auto/${publicId}`;
  };

  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-navy/70 hover:text-gold transition-colors mb-6"
      >
        ← Back to admin
      </Link>

      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-2">
        Admin · Edit
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-navy leading-tight mb-2">
        {artwork.title}
      </h1>
      <p className="text-xs text-muted mb-8">
        Slug: <code className="text-navy">{artwork.slug}</code>
      </p>

      <div className="mb-12">
        <ExistingImageManager
          artworkId={artwork.id}
          images={artwork.images.map((i) => ({
            id: i.id,
            publicId: i.publicId,
            alt: i.alt,
            isPrimary: i.isPrimary,
            url: fullImageUrl(i.publicId),
          }))}
        />
      </div>

      <EditArtworkForm
        id={artwork.id}
        initial={{
          slug: artwork.slug,
          title: artwork.title,
          year: artwork.year,
          medium: artwork.medium,
          dimensions: artwork.dimensions,
          priceGbp: String(artwork.pricePence / 100),
          status: artwork.status,
          description: artwork.description,
        }}
      />
    </section>
  );
}
