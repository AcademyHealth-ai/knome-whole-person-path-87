import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/hooks/useCanonical";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SafeAreaView from "@/components/ios/SafeAreaView";
import IOSCard from "@/components/ios/IOSCard";
import IOSButton from "@/components/ios/IOSButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Save, Trash2, Globe } from "lucide-react";

interface ContentPack {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ContentPacks = () => {
  const { user } = useAuth();
  const canonicalUrl = useCanonical();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<ContentPack[]>([]);

  // Create form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Editing state per pack id
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  const loadPacks = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("content_packs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Load packs error", error);
      toast({ variant: "destructive", title: "Failed to load packs", description: error.message });
    } else {
      setPacks(data as ContentPack[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreate = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast({ variant: "destructive", title: "Title is required" });
      return;
    }
    const values = { title: title.trim(), slug: slug || slugify(title), description: description || null, is_public: isPublic, user_id: user.id };
    const { data, error } = await supabase.from("content_packs").insert([values]).select("*").single();
    if (error) {
      toast({ variant: "destructive", title: "Create failed", description: error.message });
      return;
    }
    setPacks((prev) => [data as ContentPack, ...prev]);
    setTitle("");
    setSlug("");
    setDescription("");
    setIsPublic(true);
    toast({ title: "Content pack created" });
  };

  const startEdit = (p: ContentPack) => {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditDescription(p.description || "");
    setEditIsPublic(p.is_public);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    const { error, data } = await supabase
      .from("content_packs")
      .update({ title: editTitle.trim(), description: editDescription || null, is_public: editIsPublic })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
      return;
    }
    setPacks((prev) => prev.map((p) => (p.id === id ? (data as ContentPack) : p)));
    setEditingId(null);
    toast({ title: "Content pack updated" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("content_packs").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    setPacks((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Content pack deleted" });
  };

  return (
    <SafeAreaView className="bg-background">
      <Helmet>
        <title>My Content Packs – Knome</title>
        <meta name="description" content="Create, update, and manage your content packs." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="container mx-auto px-4 py-6 space-y-6">
        <IOSCard className="bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="text-2xl font-bold text-foreground mb-2">My Content Packs</h1>
          <p className="text-muted-foreground">Create, edit, and delete your content packs. Public packs are visible to everyone.</p>
        </IOSCard>

        {/* Create New Pack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> New content pack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Wellness Basics" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Slug</label>
                <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="auto-generated" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short summary..." />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isPublic} onCheckedChange={setIsPublic} id="new-pack-public" />
              <label htmlFor="new-pack-public" className="text-sm text-muted-foreground flex items-center gap-1">
                <Globe className="h-4 w-4 text-primary" /> Public
              </label>
            </div>
            <div className="flex justify-end">
              <IOSButton onClick={handleCreate}>Create</IOSButton>
            </div>
          </CardContent>
        </Card>

        {/* List Packs */}
        <Card>
          <CardHeader>
            <CardTitle>Your packs {loading && <Loader2 className="h-4 w-4 inline animate-spin ml-2" />}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {packs.length === 0 && !loading && (
              <div className="text-sm text-muted-foreground">No packs yet. Create your first one above.</div>
            )}

            {packs.map((p) => (
              <IOSCard key={p.id} className="">
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Title</label>
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Slug</label>
                        <Input value={p.slug} disabled />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Description</label>
                      <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={editIsPublic} onCheckedChange={setEditIsPublic} id={`pub-${p.id}`} />
                      <label htmlFor={`pub-${p.id}`} className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-4 w-4 text-primary" /> Public
                      </label>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
                      <Button onClick={() => saveEdit(p.id)}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{p.title}</h3>
                        {p.is_public ? (
                          <Badge variant="secondary">Public</Badge>
                        ) : (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      {p.description && (
                        <p className="text-sm text-muted-foreground">{p.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <IOSButton variant="outline" size="sm" onClick={() => startEdit(p)}>Edit</IOSButton>
                      <IOSButton variant="outline" size="sm" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IOSButton>
                    </div>
                  </div>
                )}
              </IOSCard>
            ))}
          </CardContent>
        </Card>
      </div>
    </SafeAreaView>
  );
};

export default ContentPacks;
