-- Apply in Supabase SQL editor. Manage content/leads through authenticated Supabase Studio.
-- No public access to enquiries. Never place the service-role key in a NEXT_PUBLIC variable.
create table if not exists public.enquiries (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null, email text not null, phone text not null,
 country text, property text not null, message text not null,
 locale text not null check(locale in ('en','es','ca')),
 consent boolean not null check(consent), privacy_version text not null
);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
create table if not exists public.notification_outbox (
 id uuid primary key default gen_random_uuid(),
 enquiry_id uuid not null references public.enquiries(id) on delete cascade,
 created_at timestamptz not null default now(),
 delivered_at timestamptz, attempts integer not null default 0
);
alter table public.notification_outbox enable row level security;
revoke all on public.notification_outbox from anon, authenticated;
create or replace function public.enqueue_enquiry() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.notification_outbox(enquiry_id) values(new.id); return new; end;
$$;
drop trigger if exists enquiry_notification on public.enquiries;
create trigger enquiry_notification after insert on public.enquiries for each row execute function public.enqueue_enquiry();
create table if not exists public.residences (
 slug text primary key,
 published boolean not null default false,
 verified boolean not null default false,
 content jsonb not null,
 updated_at timestamptz not null default now(),
 check(not published or verified)
);
alter table public.residences enable row level security;
create policy "Read verified published residences" on public.residences for select to anon using(published and verified);
-- Configure Storage policies separately. Only editors may upload; validate GLB, image, video,
-- PDF and panorama MIME types and sizes. Do not allow public HTML/JS uploads.
