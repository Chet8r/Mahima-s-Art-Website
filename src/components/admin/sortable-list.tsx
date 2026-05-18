"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderArtworks } from "@/lib/admin/artworks";
import { formatPrice } from "@/lib/format";
import { AdminRowActions } from "./row-actions";

export type SortableArtwork = {
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  year: number;
  pricePence: number;
  status: "available" | "reserved" | "sold";
  isPublished: boolean;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
};

export function SortableArtworkList({
  initial,
}: {
  initial: SortableArtwork[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Re-sync local state whenever the server sends fresh data
  // (e.g. after delete or reorder triggers a router.refresh()).
  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    startTransition(async () => {
      const result = await reorderArtworks(next.map((i) => i.id));
      if (!result.ok) {
        setError(result.error);
        setItems(items);
      } else {
        setError(null);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 text-xs text-muted">
        <span>
          {pending
            ? "Saving order..."
            : "Drag rows to reorder. Top row appears first on the site."}
        </span>
        {error && <span className="text-[#7f1d1d]">{error}</span>}
      </div>

      <div className="bg-white border border-line">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {items.map((a) => (
                <SortableRow key={a.id} artwork={a} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableRow({ artwork: a }: { artwork: SortableArtwork }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: a.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-line last:border-b-0 bg-white ${
        isDragging ? "shadow-lg z-10 relative" : ""
      } ${!a.isPublished ? "bg-cream-soft/60" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        suppressHydrationWarning
        className="w-6 h-6 inline-flex items-center justify-center text-muted hover:text-navy cursor-grab active:cursor-grabbing touch-none"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="w-4 h-4"
          fill="currentColor"
        >
          <circle cx="9" cy="6" r="1.4" />
          <circle cx="9" cy="12" r="1.4" />
          <circle cx="9" cy="18" r="1.4" />
          <circle cx="15" cy="6" r="1.4" />
          <circle cx="15" cy="12" r="1.4" />
          <circle cx="15" cy="18" r="1.4" />
        </svg>
      </button>

      <div
        className={`w-14 h-[70px] bg-cream-soft shrink-0 overflow-hidden ${
          !a.isPublished ? "opacity-50" : ""
        }`}
      >
        {a.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.thumbnailUrl}
            alt={a.thumbnailAlt}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <Link
        href={`/admin/${a.id}/edit`}
        className={`flex-1 min-w-0 hover:text-gold transition-colors ${
          !a.isPublished ? "opacity-70" : ""
        }`}
      >
        <p className="font-display text-lg text-navy truncate flex items-center gap-2">
          {a.title}
          {!a.isPublished && (
            <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em] bg-muted/15 text-muted border border-line">
              Hidden
            </span>
          )}
        </p>
        <p className="text-xs text-muted mt-0.5">
          {a.medium} · {a.dimensions} · {a.year}
        </p>
      </Link>

      <div className="hidden sm:block text-sm text-navy w-20 text-right">
        {formatPrice(a.pricePence / 100)}
      </div>

      <StatusPill status={a.status} />
      <AdminRowActions
        id={a.id}
        title={a.title}
        isPublished={a.isPublished}
      />
    </li>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; chip: string }> = {
    available: {
      label: "Available",
      chip:
        "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/30 dark-admin:bg-emerald-400/15 dark-admin:text-emerald-300 dark-admin:ring-emerald-400/30",
    },
    reserved: {
      label: "Reserved",
      chip:
        "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/30 dark-admin:bg-amber-400/15 dark-admin:text-amber-300 dark-admin:ring-amber-400/30",
    },
    sold: {
      label: "Sold",
      chip:
        "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/30 dark-admin:bg-rose-400/15 dark-admin:text-rose-300 dark-admin:ring-rose-400/30",
    },
  };
  const { label, chip } = config[status] ?? config.available;
  return (
    <span
      className={`hidden md:inline-flex items-center justify-center min-w-[88px] px-2.5 py-1 text-[11px] font-medium rounded ${chip}`}
    >
      {label}
    </span>
  );
}
