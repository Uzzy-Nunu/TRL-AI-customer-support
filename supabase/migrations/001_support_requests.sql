create extension if not exists citext;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  owner_key text not null,
  name text not null check (char_length(name) between 2 and 100),
  email citext not null,
  subject text not null check (char_length(subject) between 3 and 160),
  complaint text not null check (char_length(complaint) between 10 and 5000),
  customer_category text check (customer_category is null or customer_category in ('ORDERS','SHIPPING','RETURNS','PRODUCTS','PAYMENTS','ACCOUNT','OTHER')),
  category text not null default 'OTHER' check (category in ('ORDERS','SHIPPING','RETURNS','PRODUCTS','PAYMENTS','ACCOUNT','OTHER')),
  urgency text not null default 'NORMAL' check (urgency in ('LOW','NORMAL','HIGH')),
  summary text check (summary is null or char_length(summary) <= 300),
  ai_response text check (ai_response is null or char_length(ai_response) <= 4000),
  safe_next_step text check (safe_next_step is null or char_length(safe_next_step) <= 500),
  needs_escalation boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING','AI_RESPONDED','RESOLVED')),
  order_reference text check (order_reference is null or char_length(order_reference) <= 80),
  provider_model text,
  provider_latency_ms integer,
  failure_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists support_requests_owner_created_idx on public.support_requests (owner_key, created_at desc);
create index if not exists support_requests_user_created_idx on public.support_requests (user_id, created_at desc);
create index if not exists support_requests_status_updated_idx on public.support_requests (status, updated_at desc);
create index if not exists support_requests_category_created_idx on public.support_requests (category, created_at desc);

create or replace function public.set_support_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_requests_updated_at on public.support_requests;
create trigger support_requests_updated_at before update on public.support_requests
for each row execute function public.set_support_requests_updated_at();

alter table public.support_requests enable row level security;
drop policy if exists "Users can read their own support requests" on public.support_requests;
create policy "Users can read their own support requests" on public.support_requests
for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users can create their own support requests" on public.support_requests;
create policy "Users can create their own support requests" on public.support_requests
for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Users can resolve their own support requests" on public.support_requests;
create policy "Users can resolve their own support requests" on public.support_requests
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
