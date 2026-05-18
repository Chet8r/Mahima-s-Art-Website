"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  deleteArtwork,
  setArtworkPublished,
} from "@/lib/admin/artworks";

export function AdminRowActions({
  id,
  title,
  isPublished,
}: {
  id: string;
  title: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onToggleVisibility() {
    setOpen(false);
    startTransition(async () => {
      const result = await setArtworkPublished(id, !isPublished);
      if (!result.ok) {
        alert(`Failed: ${result.error}`);
        return;
      }
      router.refresh();
    });
  }

  function onEdit() {
    setOpen(false);
    router.push(`/admin/${id}/edit`);
  }

  function onDelete() {
    setOpen(false);
    if (
      !confirm(
        `Delete "${title}"?\n\nThis removes the artwork, its images (including from Cloudinary), and cannot be undone.\n\nTip: if you just want to hide it from the public site, use Hide instead.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await deleteArtwork(id);
      if (!result.ok) {
        alert(`Delete failed: ${result.error}`);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 h-9 pl-3 pr-2 text-sm font-medium rounded-md
          bg-white text-slate-700 ring-1 ring-inset ring-slate-200
          hover:bg-slate-50
          dark-admin:bg-slate-800 dark-admin:text-slate-100 dark-admin:ring-slate-700
          dark-admin:hover:bg-slate-700
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {pending ? "Working…" : "Actions"}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-20 min-w-[180px] py-1 rounded-md
            bg-white ring-1 ring-slate-200 shadow-lg
            dark-admin:bg-slate-800 dark-admin:ring-slate-700"
        >
          <MenuItem onClick={onEdit} icon={<EditIcon />}>
            Edit
          </MenuItem>
          <MenuItem
            onClick={onToggleVisibility}
            icon={isPublished ? <EyeOffIcon /> : <EyeIcon />}
          >
            {isPublished ? "Hide" : "Unhide"}
          </MenuItem>
          <div className="my-1 h-px bg-slate-200 dark-admin:bg-slate-700" />
          <MenuItem onClick={onDelete} icon={<TrashIcon />} danger>
            Delete
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  danger,
  icon,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center justify-end gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${
        danger
          ? "text-rose-600 hover:bg-rose-50 dark-admin:text-rose-400 dark-admin:hover:bg-rose-500/10"
          : "text-slate-700 hover:bg-slate-100 dark-admin:text-slate-200 dark-admin:hover:bg-slate-700"
      }`}
    >
      {children}
      <span className="w-4 h-4 shrink-0">{icon}</span>
    </button>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-4 h-4",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      {...iconProps}
      aria-hidden="true"
      className={`w-4 h-4 transition-transform text-slate-400 dark-admin:text-slate-500 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.71 19.71 0 0 1-4 5.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg {...iconProps} aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
