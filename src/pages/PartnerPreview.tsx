import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { SafeAreaView } from "@/components/ios/SafeAreaView";
import { IOSCard } from "@/components/ios/IOSCard";
import { IOSButton } from "@/components/ios/IOSButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

const useCanonical = () => {
  const { pathname, search } = useLocation();
  return useMemo(() => `${window.location.origin}${pathname}${search}`, [pathname, search]);
};

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
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: partner.name,
      url: canonical,
    };
  }, [partner, canonical]);

  const pageTitle = partner ? `Partner Preview: ${partner.name}` : "Partner Preview";
  const pageDesc = activePack ? `${activePack.title} – preview lessons and content.` : "Preview partner content and lessons.";

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
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{partner?.name || "Partner Preview"}</h1>
          <IOSButton variant="outline" onClick={() => navigate("/")}>Back Home</IOSButton>
        </header>

        <section className="grid gap-6 lg:grid-cols-3" aria-busy={loading}>
          <div className="lg:col-span-1 space-y-4">
            <IOSCard>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">Content Packs</h2>
                {packs.length === 0 && !loading && (
                  <p className="text-muted-foreground">No content available yet.</p>
                )}
                <ul className="space-y-2">
                  {packs.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => loadLessonsForPack(p.id)}
                        className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                          activePackId === p.id ? "bg-accent" : "hover:bg-accent"
                        }`}
                        aria-current={activePackId === p.id ? "true" : "false"}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{p.title}</span>
                          {activePackId === p.id && <Badge>Active</Badge>}
                        </div>
                        {p.description && (
                          <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </IOSCard>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-3">{activePack?.title || "Lessons"}</h2>
              {loading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : lessons.length === 0 ? (
                <p className="text-muted-foreground">No lessons to show.</p>
              ) : (
                <ol className="space-y-3 list-decimal pl-6">
                  {lessons.map((l) => (
                    <li key={l.id}>
                      <article>
                        <h3 className="font-medium">{l.title}</h3>
                        {l.summary && (
                          <p className="text-sm text-muted-foreground">{l.summary}</p>
                        )}
                      </article>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>
        </section>
      </main>
    </SafeAreaView>
  );
};

export default PartnerPreview;
