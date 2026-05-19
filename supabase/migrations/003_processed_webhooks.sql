-- Track Stripe webhook events we've already processed.
-- Stripe will retry webhooks on transient failures; this guard prevents
-- us marking a painting sold twice or sending duplicate emails.

create table processed_webhooks (
  event_id text primary key,
  processed_at timestamptz not null default now()
);

-- RLS: keep it locked down. Only the service-role admin client touches it.
alter table processed_webhooks enable row level security;
