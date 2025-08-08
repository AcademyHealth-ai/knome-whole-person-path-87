-- Create partner/content tables for multi-tenant content packs (public preview)
-- 1) partners table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public read policy for preview
CREATE POLICY IF NOT EXISTS "Partners are publicly readable"
ON public.partners FOR SELECT USING (true);

-- 2) content_packs table
CREATE TABLE IF NOT EXISTS public.content_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  license TEXT,
  attribution TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_packs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Content packs are publicly readable"
ON public.content_packs FOR SELECT USING (is_public = true);

-- 3) lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES public.content_packs(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body_markdown TEXT,
  media JSONB,
  order_index INT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (pack_id, slug)
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Lessons are publicly readable"
ON public.lessons FOR SELECT USING (is_published = true);

-- 4) partner_content_map table
CREATE TABLE IF NOT EXISTS public.partner_content_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.content_packs(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (partner_id, pack_id)
);

ALTER TABLE public.partner_content_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Partner content map is publicly readable"
ON public.partner_content_map FOR SELECT USING (enabled = true);

-- Timestamps trigger for updated_at (reuse existing function)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_partners_updated_at'
  ) THEN
    CREATE TRIGGER trg_partners_updated_at
    BEFORE UPDATE ON public.partners
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_content_packs_updated_at'
  ) THEN
    CREATE TRIGGER trg_content_packs_updated_at
    BEFORE UPDATE ON public.content_packs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_lessons_updated_at'
  ) THEN
    CREATE TRIGGER trg_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_partner_content_map_updated_at'
  ) THEN
    CREATE TRIGGER trg_partner_content_map_updated_at
    BEFORE UPDATE ON public.partner_content_map
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(slug);
CREATE INDEX IF NOT EXISTS idx_packs_slug ON public.content_packs(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_pack_order ON public.lessons(pack_id, order_index);
CREATE INDEX IF NOT EXISTS idx_partner_content_map_partner ON public.partner_content_map(partner_id);

-- Seed minimal data for Turnaround/Center for Whole-Child Education preview (safe public references)
DO $$
DECLARE
  v_partner_id UUID;
  v_pack_id UUID;
BEGIN
  -- Upsert partner
  INSERT INTO public.partners (slug, name, brand)
  VALUES ('turnaround', 'Center for Whole-Child Education (formerly Turnaround USA)', '{"primaryColor":"#1F4E79","accentColor":"#F3B229","logo":""}'::jsonb)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_partner_id;

  -- Upsert content pack
  INSERT INTO public.content_packs (slug, title, description, source_url, license, attribution, is_public)
  VALUES (
    'building-blocks-basics',
    'Building Blocks Basics',
    'A high-level orientation to the public Building Blocks tools and concepts.',
    'https://turnaroundusa.org/what-we-do/tools/',
    'Public/no-cost resources — use with attribution. Verify latest licensing at source.',
    'Source: Center for Whole-Child Education (Turnaround USA) — https://turnaroundusa.org',
    true
  )
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO v_pack_id;

  -- Link partner to pack
  INSERT INTO public.partner_content_map (partner_id, pack_id, enabled)
  VALUES (v_partner_id, v_pack_id, true)
  ON CONFLICT (partner_id, pack_id) DO UPDATE SET enabled = EXCLUDED.enabled;

  -- Seed 3 sample lessons (idempotent by (pack_id, slug))
  INSERT INTO public.lessons (pack_id, slug, title, summary, body_markdown, order_index, is_published)
  VALUES 
    (v_pack_id, 'intro-building-blocks', 'Introduction to Building Blocks',
     'Overview of the Building Blocks framework and how it supports whole-child development.',
     '# Introduction\n\nThis module orients you to the Building Blocks tools available publicly.\n\nExplore the official tools page: https://turnaroundusa.org/what-we-do/tools/\n\nUse these concepts to structure routines, relationships, and environments that buffer stress and build skills.',
     1, true)
  ON CONFLICT (pack_id, slug) DO NOTHING;

  INSERT INTO public.lessons (pack_id, slug, title, summary, body_markdown, order_index, is_published)
  VALUES 
    (v_pack_id, 'stress-buffering-relationships', 'Stress-Buffering Relationships',
     'Why relationships are foundational for buffering stress and fostering resilience.',
     '# Stress-Buffering Relationships\n\nStrong, consistent relationships help young people manage stress and learn effectively.\n\nSee related tools and guidance at the official page above.',
     2, true)
  ON CONFLICT (pack_id, slug) DO NOTHING;

  INSERT INTO public.lessons (pack_id, slug, title, summary, body_markdown, order_index, is_published)
  VALUES 
    (v_pack_id, 'skill-building-routines', 'Skill-Building and Routines',
     'Using predictable routines to support skill development and wellbeing.',
     '# Skill-Building and Routines\n\nPredictable routines support executive function and self-regulation.\n\nRefer to the public tools to adapt routines for your context.',
     3, true)
  ON CONFLICT (pack_id, slug) DO NOTHING;
END $$;