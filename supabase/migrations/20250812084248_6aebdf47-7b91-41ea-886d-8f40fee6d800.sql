-- Standardize on content_packs with user-scoped RLS while preserving public content
-- 1) Add user_id column for ownership (nullable to preserve existing public rows)
ALTER TABLE public.content_packs
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Helpful index for owner lookups
CREATE INDEX IF NOT EXISTS idx_content_packs_user_id ON public.content_packs (user_id);

-- 3) Ensure RLS is enabled
ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;

-- 4) Replace/ensure SELECT policies to allow public reads AND owner reads
DROP POLICY IF EXISTS "Content packs are publicly readable" ON public.content_packs;
DROP POLICY IF EXISTS "Public content packs are readable" ON public.content_packs;
DROP POLICY IF EXISTS "Users can view their own content_packs" ON public.content_packs;

CREATE POLICY "Public content packs are readable"
  ON public.content_packs
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view their own content_packs"
  ON public.content_packs
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5) Mutations restricted to owners
DROP POLICY IF EXISTS "users insert own content_packs" ON public.content_packs;
DROP POLICY IF EXISTS "users update own content_packs" ON public.content_packs;
DROP POLICY IF EXISTS "users delete own content_packs" ON public.content_packs;

CREATE POLICY "users insert own content_packs"
  ON public.content_packs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own content_packs"
  ON public.content_packs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users delete own content_packs"
  ON public.content_packs
  FOR DELETE
  USING (auth.uid() = user_id);