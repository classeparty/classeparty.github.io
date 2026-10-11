-- =====================================================================
-- CLASSE PARTY - base de données du site communautaire
-- À copier-coller UNE FOIS dans Supabase : menu « SQL Editor » > « New query » > Run
-- =====================================================================

-- ---------- PROFILS DES PROFS ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default 'Prof' check (char_length(display_name) between 2 and 40),
  ecole text default '' check (char_length(ecole) <= 80),
  bio text default '' check (char_length(bio) <= 500),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profils lisibles" on public.profiles;
create policy "profils lisibles" on public.profiles for select using (true);
drop policy if exists "modifier son profil" on public.profiles;
create policy "modifier son profil" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- personne ne peut se donner le rôle administrateur lui-même
revoke update on public.profiles from authenticated, anon;
grant update (display_name, ecole, bio) on public.profiles to authenticated;

-- profil créé automatiquement à l'inscription
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)), 40));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- ---------- COURS (fichiers de questions) ----------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  titre text not null check (char_length(titre) between 3 and 80),
  matiere text not null check (char_length(matiere) between 2 and 40),
  niveau text not null check (char_length(niveau) between 2 and 40),
  description text not null default '' check (char_length(description) <= 500),
  contenu text not null check (char_length(contenu) <= 200000),
  nb_questions int not null default 0,
  public boolean not null default false,
  likes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;
drop policy if exists "lire cours" on public.courses;
create policy "lire cours" on public.courses for select using (public or owner = auth.uid() or public.is_admin());
drop policy if exists "créer ses cours" on public.courses;
create policy "créer ses cours" on public.courses for insert with check (owner = auth.uid());
drop policy if exists "modifier ses cours" on public.courses;
create policy "modifier ses cours" on public.courses for update using (owner = auth.uid() or public.is_admin()) with check (owner = auth.uid() or public.is_admin());
drop policy if exists "supprimer ses cours" on public.courses;
create policy "supprimer ses cours" on public.courses for delete using (owner = auth.uid() or public.is_admin());
-- seuls ces champs sont modifiables (pas l'auteur ni le nombre de j'aime)
revoke update on public.courses from authenticated, anon;
grant update (titre, matiere, niveau, description, contenu, nb_questions, public, updated_at) on public.courses to authenticated;

-- ---------- J'AIME ----------
create table if not exists public.course_likes (
  course_id uuid references public.courses on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  primary key (course_id, user_id)
);
alter table public.course_likes enable row level security;
drop policy if exists "voir j'aime" on public.course_likes;
create policy "voir j'aime" on public.course_likes for select using (true);
drop policy if exists "aimer" on public.course_likes;
create policy "aimer" on public.course_likes for insert with check (user_id = auth.uid());
drop policy if exists "ne plus aimer" on public.course_likes;
create policy "ne plus aimer" on public.course_likes for delete using (user_id = auth.uid());

create or replace function public.sync_likes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.courses set likes = (select count(*) from public.course_likes where course_id = coalesce(new.course_id, old.course_id))
  where id = coalesce(new.course_id, old.course_id);
  return null;
end; $$;
drop trigger if exists likes_changed on public.course_likes;
create trigger likes_changed after insert or delete on public.course_likes for each row execute procedure public.sync_likes();

-- ---------- FORUM ----------
create table if not exists public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  author uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  categorie text not null check (categorie in ('general', 'cours', 'aide', 'idees')),
  titre text not null check (char_length(titre) between 3 and 120),
  created_at timestamptz not null default now(),
  last_post_at timestamptz not null default now(),
  nb_messages int not null default 0
);
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics on delete cascade,
  author uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  contenu text not null check (char_length(contenu) between 1 and 5000),
  created_at timestamptz not null default now()
);
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;
drop policy if exists "lire sujets" on public.forum_topics;
create policy "lire sujets" on public.forum_topics for select using (true);
drop policy if exists "créer sujet" on public.forum_topics;
create policy "créer sujet" on public.forum_topics for insert with check (author = auth.uid());
drop policy if exists "supprimer sujet" on public.forum_topics;
create policy "supprimer sujet" on public.forum_topics for delete using (author = auth.uid() or public.is_admin());
drop policy if exists "lire messages" on public.forum_posts;
create policy "lire messages" on public.forum_posts for select using (true);
drop policy if exists "écrire message" on public.forum_posts;
create policy "écrire message" on public.forum_posts for insert with check (author = auth.uid());
drop policy if exists "modifier message" on public.forum_posts;
create policy "modifier message" on public.forum_posts for update using (author = auth.uid()) with check (author = auth.uid());
drop policy if exists "supprimer message" on public.forum_posts;
create policy "supprimer message" on public.forum_posts for delete using (author = auth.uid() or public.is_admin());

create or replace function public.sync_topic() returns trigger
language plpgsql security definer set search_path = public as $$
declare t uuid := coalesce(new.topic_id, old.topic_id);
begin
  update public.forum_topics set
    nb_messages = (select count(*) from public.forum_posts where topic_id = t),
    last_post_at = coalesce((select max(created_at) from public.forum_posts where topic_id = t), created_at)
  where id = t;
  return null;
end; $$;
drop trigger if exists posts_changed on public.forum_posts;
create trigger posts_changed after insert or delete on public.forum_posts for each row execute procedure public.sync_topic();

-- ---------- SIGNALEMENTS (modération) ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  cible_type text not null check (cible_type in ('cours', 'sujet', 'message')),
  cible_id uuid not null,
  raison text not null check (char_length(raison) between 3 and 500),
  traite boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "signaler" on public.reports;
create policy "signaler" on public.reports for insert with check (reporter = auth.uid());
drop policy if exists "admin lit signalements" on public.reports;
create policy "admin lit signalements" on public.reports for select using (public.is_admin());
drop policy if exists "admin traite signalements" on public.reports;
create policy "admin traite signalements" on public.reports for update using (public.is_admin()) with check (public.is_admin());

-- ---------- DROITS D'ACCÈS (au cas où les tables ne sont pas exposées automatiquement) ----------
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.courses, public.course_likes, public.forum_topics, public.forum_posts to anon, authenticated;
grant insert, delete on public.courses, public.course_likes, public.forum_topics, public.forum_posts to authenticated;
grant update (contenu) on public.forum_posts to authenticated;
grant insert, select on public.reports to authenticated;
grant update (traite) on public.reports to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- =====================================================================
-- APRÈS TON INSCRIPTION SUR LE SITE, donne-toi le rôle d'administrateur :
-- remplace l'adresse ci-dessous par la tienne, enlève les deux tirets du début et lance (Run).
-- update public.profiles set is_admin = true where id = (select id from auth.users where email = 'ton.adresse@exemple.be');
-- =====================================================================
