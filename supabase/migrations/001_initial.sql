-- Mahi Art — initial schema
-- Run this in Supabase SQL Editor (or via supabase CLI).

-- ────────────────────────────────────────────────────────────────
-- artworks
-- ────────────────────────────────────────────────────────────────
create type artwork_status as enum ('available', 'reserved', 'sold');

create table artworks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  year smallint not null,
  medium text not null,
  dimensions text not null,
  price_pence integer not null check (price_pence >= 0),
  status artwork_status not null default 'available',
  description text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artworks_status_idx on artworks (status);
create index artworks_position_idx on artworks (position);

-- ────────────────────────────────────────────────────────────────
-- artwork_images (one-to-many)
-- ────────────────────────────────────────────────────────────────
create table artwork_images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks (id) on delete cascade,
  cloudinary_public_id text not null,
  alt text not null default '',
  position integer not null default 0,
  is_primary boolean not null default false,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create index artwork_images_artwork_idx on artwork_images (artwork_id);
create unique index artwork_images_one_primary_per_artwork
  on artwork_images (artwork_id)
  where is_primary;

-- ────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ────────────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger artworks_set_updated_at
  before update on artworks
  for each row execute function set_updated_at();

-- ────────────────────────────────────────────────────────────────
-- Row Level Security
-- Public can read available data. All writes happen via the
-- server using the service role key, which bypasses RLS.
-- ────────────────────────────────────────────────────────────────
alter table artworks enable row level security;
alter table artwork_images enable row level security;

create policy "Public read artworks"
  on artworks for select
  using (true);

create policy "Public read artwork_images"
  on artwork_images for select
  using (true);
