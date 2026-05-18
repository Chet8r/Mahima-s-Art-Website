-- Seed data — 8 placeholder paintings.
-- Safe to run multiple times: clears existing data first.

truncate artwork_images cascade;
truncate artworks cascade;

with inserted as (
  insert into artworks
    (slug, title, year, medium, dimensions, price_pence, status, description, position)
  values
    ('evening-harbour',        'Evening Harbour',        2025, 'Oil on canvas', '40 × 50 cm', 48000, 'available', 'A study of light over still water at dusk. Layered glazes build a deep, lingering blue.', 1),
    ('morning-light',          'Morning Light',          2025, 'Oil on linen',  '30 × 40 cm', 36000, 'sold',      'Captured in early hours by the window — warm whites against soft shadow.', 2),
    ('field-of-cobalt',        'Field of Cobalt',        2024, 'Oil on canvas', '50 × 70 cm', 72000, 'available', 'Inspired by lavender fields under cloud — a meditation on saturation and quiet.', 3),
    ('still-life-with-pears',  'Still Life with Pears',  2024, 'Oil on board',  '25 × 30 cm', 28000, 'available', 'Three pears, a linen cloth, and the patience of a long afternoon.', 4),
    ('coastal-fog',            'Coastal Fog',            2025, 'Oil on canvas', '45 × 60 cm', 56000, 'reserved',  'The horizon disappears into vapour — painted on location over three mornings.', 5),
    ('navy-and-bone',          'Navy and Bone',          2024, 'Oil on linen',  '35 × 45 cm', 42000, 'available', 'An abstract composition built around two anchoring tones.', 6),
    ('after-the-rain',         'After the Rain',         2025, 'Oil on canvas', '40 × 40 cm', 40000, 'available', 'Reflections on wet pavement — a small love letter to ordinary streets.', 7),
    ('studio-window',          'Studio Window',          2024, 'Oil on board',  '20 × 25 cm', 22000, 'sold',      'The view from the easel on a grey Tuesday.', 8)
  returning id, slug
)
insert into artwork_images (artwork_id, cloudinary_public_id, alt, is_primary, position)
select id, 'placeholder/' || slug, slug, true, 0 from inserted;
