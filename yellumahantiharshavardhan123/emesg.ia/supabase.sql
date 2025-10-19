-- E-MESG MVP Database Schema & Policies

create extension if not exists pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  photo_url text,
  status text,
  last_seen timestamptz DEFAULT now(),
  bio text
);

CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  media_url text,
  created_at timestamptz DEFAULT now(),
  seen boolean DEFAULT false,
  delivered boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photo text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participants uuid[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  media_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.group_reads (
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.vibes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_url text,
  caption text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "profiles self or public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles self upsert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "chats read participants" ON public.chats FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "chats insert self" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "messages read participants" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats c
    WHERE c.id = chat_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);
CREATE POLICY "messages insert sender is participant" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chats c
    WHERE c.id = chat_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  ) AND sender_id = auth.uid()
);
CREATE POLICY "messages update participants" ON public.messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.chats c
    WHERE c.id = chat_id AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
  )
);

CREATE POLICY "groups read participant" ON public.groups FOR SELECT USING (
  auth.uid() = ANY(participants)
);
CREATE POLICY "groups insert creator" ON public.groups FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "groups update participant" ON public.groups FOR UPDATE USING (
  auth.uid() = ANY(participants)
);

CREATE POLICY "group_messages read participant" ON public.group_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND auth.uid() = ANY(g.participants))
);
CREATE POLICY "group_messages insert participant" ON public.group_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND auth.uid() = ANY(g.participants)) AND sender_id = auth.uid()
);

CREATE POLICY "group_reads upsert participant" ON public.group_reads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND auth.uid() = ANY(g.participants)) AND user_id = auth.uid()
);
CREATE POLICY "group_reads update participant" ON public.group_reads FOR UPDATE USING (
  user_id = auth.uid()
);

CREATE POLICY "vibes public read active" ON public.vibes FOR SELECT USING (now() < expires_at);
CREATE POLICY "vibes insert self" ON public.vibes FOR INSERT WITH CHECK (user_id = auth.uid());

-- Storage buckets (public read for MVP)
insert into storage.buckets (id, name, public) values ('chat-media','chat-media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('vibes','vibes', true) on conflict (id) do nothing;

alter table storage.objects enable row level security;

create policy "Public read for chat-media and vibes" on storage.objects for select using (
  bucket_id in ('chat-media','vibes')
);

create policy "Authenticated uploads to chat-media and vibes" on storage.objects for insert with check (
  auth.role() = 'authenticated' and bucket_id in ('chat-media','vibes')
);
