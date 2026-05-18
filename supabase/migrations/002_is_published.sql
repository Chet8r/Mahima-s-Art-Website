-- Add visibility flag so artworks can be hidden from the public site
-- without being deleted. Existing rows default to published.

alter table artworks
  add column is_published boolean not null default true;

create index artworks_is_published_idx on artworks (is_published);

-- Tighten the public RLS policy so unpublished rows aren't readable
-- by the publishable key client. Admin still uses the secret key
-- which bypasses RLS.
drop policy if exists "Public read artworks" on artworks;
create policy "Public read artworks"
  on artworks for select
  using (is_published = true);

drop policy if exists "Public read artwork_images" on artwork_images;
create policy "Public read artwork_images"
  on artwork_images for select
  using (
    exists (
      select 1 from artworks
      where artworks.id = artwork_images.artwork_id
        and artworks.is_published = true
    )
  );
