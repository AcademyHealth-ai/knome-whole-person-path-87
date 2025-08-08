-- Seed sample lessons for the Turnaround partner's Building Blocks content pack if missing
WITH pack AS (
  SELECT cp.id
  FROM public.content_packs cp
  WHERE cp.slug = 'building-blocks-basics'
  LIMIT 1
)
INSERT INTO public.lessons (id, pack_id, slug, title, summary, body_markdown, media, order_index, is_published)
SELECT gen_random_uuid(), p.id, v.slug, v.title, v.summary, v.body_markdown, v.media::jsonb, v.order_index, true
FROM pack p,
(VALUES
  ('basics-intro', 'Building Blocks: Introduction', 'Overview of whole-child building blocks and why they matter.', '# Building Blocks: Introduction\n\nThis lesson introduces the foundational components that support whole-child development and sets expectations for the series.', '{}', 1),
  ('self-regulation', 'Self-Regulation Basics', 'Core strategies for student self-regulation.', '# Self-Regulation Basics\n\nExplore practical approaches to help students recognize emotions, build coping strategies, and strengthen executive function.', '{}', 2),
  ('relationships', 'Relationships and Belonging', 'Practices to build strong relationships and belonging.', '# Relationships and Belonging\n\nTechniques and routines that cultivate trust, safety, and a strong sense of belonging in classrooms and schools.', '{}', 3)
) AS v(slug, title, summary, body_markdown, media, order_index)
WHERE NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.slug = v.slug
);
