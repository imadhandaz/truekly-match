-- MIGRATION 001: Security & schema fixes
-- Run in Supabase Dashboard -> SQL Editor

-- 1. Fix Gold/verified RLS bypass
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile (safe fields only)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    gold = (SELECT gold FROM public.profiles WHERE id = auth.uid()) AND
    verified = (SELECT verified FROM public.profiles WHERE id = auth.uid())
  );

-- 2. Message length constraint
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_text_length;
ALTER TABLE public.messages ADD CONSTRAINT messages_text_length CHECK (char_length(text) <= 2000);
