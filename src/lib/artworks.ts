export type ArtworkStatus = "available" | "reserved" | "sold";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  status: ArtworkStatus;
  imageUrl: string;
  description: string;
};

const placeholder = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const artworks: Artwork[] = [
  {
    id: "1",
    slug: "evening-harbour",
    title: "Evening Harbour",
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "40 × 50 cm",
    price: 480,
    status: "available",
    imageUrl: placeholder("mahi-1"),
    description:
      "A study of light over still water at dusk. Layered glazes build a deep, lingering blue.",
  },
  {
    id: "2",
    slug: "morning-light",
    title: "Morning Light",
    year: 2025,
    medium: "Oil on linen",
    dimensions: "30 × 40 cm",
    price: 360,
    status: "sold",
    imageUrl: placeholder("mahi-2"),
    description:
      "Captured in early hours by the window — warm whites against soft shadow.",
  },
  {
    id: "3",
    slug: "field-of-cobalt",
    title: "Field of Cobalt",
    year: 2024,
    medium: "Oil on canvas",
    dimensions: "50 × 70 cm",
    price: 720,
    status: "available",
    imageUrl: placeholder("mahi-3"),
    description:
      "Inspired by lavender fields under cloud — a meditation on saturation and quiet.",
  },
  {
    id: "4",
    slug: "still-life-with-pears",
    title: "Still Life with Pears",
    year: 2024,
    medium: "Oil on board",
    dimensions: "25 × 30 cm",
    price: 280,
    status: "available",
    imageUrl: placeholder("mahi-4"),
    description:
      "Three pears, a linen cloth, and the patience of a long afternoon.",
  },
  {
    id: "5",
    slug: "coastal-fog",
    title: "Coastal Fog",
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "45 × 60 cm",
    price: 560,
    status: "reserved",
    imageUrl: placeholder("mahi-5"),
    description:
      "The horizon disappears into vapour — painted on location over three mornings.",
  },
  {
    id: "6",
    slug: "navy-and-bone",
    title: "Navy and Bone",
    year: 2024,
    medium: "Oil on linen",
    dimensions: "35 × 45 cm",
    price: 420,
    status: "available",
    imageUrl: placeholder("mahi-6"),
    description:
      "An abstract composition built around two anchoring tones.",
  },
  {
    id: "7",
    slug: "after-the-rain",
    title: "After the Rain",
    year: 2025,
    medium: "Oil on canvas",
    dimensions: "40 × 40 cm",
    price: 400,
    status: "available",
    imageUrl: placeholder("mahi-7"),
    description:
      "Reflections on wet pavement — a small love letter to ordinary streets.",
  },
  {
    id: "8",
    slug: "studio-window",
    title: "Studio Window",
    year: 2024,
    medium: "Oil on board",
    dimensions: "20 × 25 cm",
    price: 220,
    status: "sold",
    imageUrl: placeholder("mahi-8"),
    description: "The view from the easel on a grey Tuesday.",
  },
];

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}

export function formatPrice(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
