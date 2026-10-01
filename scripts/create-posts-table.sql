-- Prime Video Blog Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  meta_description text,
  content text not null default '',
  cover_image_url text,
  author text default 'Prime Video Editorial',
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for slug lookups
create index if not exists posts_slug_idx on public.posts (slug);
-- Index for listing published posts
create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- RLS: public read for published posts
alter table public.posts enable row level security;

drop policy if exists "Public read published posts" on public.posts;
create policy "Public read published posts"
  on public.posts for select
  using (status = 'published');

drop policy if exists "Service role full access" on public.posts;
create policy "Service role full access"
  on public.posts for all
  using (true)
  with check (true);
