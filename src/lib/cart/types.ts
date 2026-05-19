import type { ArtworkStatus } from "@/lib/artwork-types";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  pricePence: number;
  // Status captured when the item was added — used to detect if it
  // changed (e.g. someone else bought it) before checkout.
  statusAtAdd: ArtworkStatus;
};

export type CartState = {
  items: CartItem[];
};
