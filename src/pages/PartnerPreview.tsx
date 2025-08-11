import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { SafeAreaView } from "@/components/ios/SafeAreaView";

import { useToast } from "@/hooks/use-toast";
import { PartnerHeader } from "@/components/partners/PartnerHeader";
import { PackList } from "@/components/partners/PackList";
import { LessonList } from "@/components/partners/LessonList";
import { useCanonical } from "@/hooks/useCanonical";

interface PartnerRow {
  id: string;
  slug: string;
  name: string;
  brand: any | null;
}

interface ContentPackRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
}

interface LessonRow {
  id: string;
  pack_id: string;
  slug: string;
  title: string;
  summary: string | null;
  body_markdown: string | null;
  order_index: number | null;
}

const PartnerPreview: React.FC = () => {
  const { slug = "turnaround" } = useParams();
  const navigate = useNavigate();
  const canonical = useCanonical();
  const { toast } = useToast();

  const [partner, setPartner] = useState<PartnerRow | null>(null);
  const [packs, setPacks] = useState<ContentPackRow[]>([]);
  const [activePackId, setActivePackId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: partnerRow, error: pErr } = await supabase
          .from("partners")
          .select("id, slug, name, brand")
          .eq("slug", slug)
          .maybeSingle();
        if (pErr) throw pErr;
        if (!partnerRow) {
          toast({ variant: "destructive", title: "Partner not found" });
          navigate("/", { replace: true });
          return;
        }
        setPartner(partnerRow as PartnerRow);

        const { data: packRows, error: packErr } = await supabase
          .from("partner_content_map")
          .select("content_packs:pack_id(id, slug, title, description)")
          .eq("partner_id", partnerRow.id)
          .eq("enabled", true);
        if (packErr) throw packErr;
        const flattened = (packRows || [])
          .map((r: any) => r.content_packs)
          .filter(Boolean) as ContentPackRow[];
        setPacks(flattened);
        const firstPack = flattened[0];
        setActivePackId(firstPack?.id ?? null);

        if (firstPack) {
          const { data: lessonRows, error: lErr } = await supabase
            .from("lessons")
            .select("id, pack_id, slug, title, summary, body_markdown, order_index")
            .eq("pack_id", firstPack.id)
            .eq("is_published", true)
            .order("order_index", { ascending: true, nullsFirst: false });
          if (lErr) throw lErr;
          setLessons(lessonRows || []);
        } else {
          setLessons([]);
        }
      } catch (err: any) {
        console.error(err);
        toast({ variant: "destructive", title: "Failed to load partner", description: err.message });
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const activePack = packs.find((p) => p.id === activePackId) || null;

  const lessonListSchema = useMemo(() => {
    if (!activePack) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${activePack.title} Lessons`,
      itemListElement: lessons.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.title,
        url: canonical,
        description: l.summary || undefined,
      })),
    };
  }, [activePack, lessons, canonical]);

  const orgSchema = useMemo(() => {
    if (!partner) return null;
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: (partner && (partner.slug === 'turnaround')) ? "The Center for Whole-Child Education" : partner.name,
      url: canonical,
    };
    if ((partner?.slug === 'turnaround')) {
      schema.sameAs = ["https://turnaroundusa.org/what-we-do/tools/"];
    }
    return schema;
  }, [partner, canonical]);

  const isTurnaround = (partner?.slug || slug) === 'turnaround';
  const displayName = isTurnaround
    ? 'The Center for Whole-Child Education (formerly Turnaround for Children)'
    : (partner?.name || 'Partner Preview');
  const toolsUrl = isTurnaround ? 'https://turnaroundusa.org/what-we-do/tools/' : null;
  const tagline = isTurnaround ? 'Evidence-based tools to support whole-child development in schools' : null;

  const pageTitle = isTurnaround
    ? 'Turnaround Whole-Child Education Tools | Partner Preview'
    : (partner ? `Partner Preview: ${partner.name}` : 'Partner Preview');
  const pageDesc = isTurnaround
    ? 'Explore evidence-based tools and sample lessons from The Center for Whole-Child Education (Turnaround).'
    : (activePack ? `${activePack.title} – preview lessons and content.` : 'Preview partner content and lessons.');

  const loadLessonsForPack = async (packId: string) => {
    try {
      setLoading(true);
      setActivePackId(packId);
      const { data: lessonRows, error: lErr } = await supabase
        .from("lessons")
        .select("id, pack_id, slug, title, summary, body_markdown, order_index")
        .eq("pack_id", packId)
        .eq("is_published", true)
        .order("order_index", { ascending: true, nullsFirst: false });
      if (lErr) throw lErr;
      setLessons(lessonRows || []);
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Failed to load lessons", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="min-h-screen bg-gradient-ios">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={canonical} />
        {orgSchema && (
          <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        )}
        {lessonListSchema && (
          <script type="application/ld+json">{JSON.stringify(lessonListSchema)}</script>
        )}
      </Helmet>

      <main className="container mx-auto px-4 py-10">
        <PartnerHeader
          displayName={displayName}
          tagline={tagline}
          toolsUrl={toolsUrl}
          onBack={() => navigate("/")}
        />

        <section className="grid gap-6 lg:grid-cols-3" aria-busy={loading}>
          <PackList
            packs={packs}
            activePackId={activePackId}
            loading={loading}
            onSelect={loadLessonsForPack}
          />
          <LessonList
            title={activePack?.title || "Lessons"}
            lessons={lessons}
            loading={loading}
          />
        </section>
      </main>
    </SafeAreaView>
  );
};

export default PartnerPreview;
