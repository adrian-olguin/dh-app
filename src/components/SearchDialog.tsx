import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Video, Headphones, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useWatchVideos } from "@/hooks/useWatchVideos";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToContent: (payload: { type: "devotional" | "audio" | "video"; id: string }) => void;
}

type DevotionalResult = {
  id: string; // stable id (published_at)
  title: string;
  type: "devotional";
  date: string;
  verse?: string;
  excerpt?: string;
};

type AudioResult = {
  id: string; // stable id (published_at)
  title: string;
  type: "audio";
  date: string;
  description?: string;
  duration?: string;
};

type VideoResult = {
  id: string;
  title: string;
  type: "video";
  date?: string;
  duration?: string;
};

type SearchResult = DevotionalResult | AudioResult | VideoResult;

type SupabaseDevotional = {
  id: string;
  title: string;
  excerpt: string;
  verse?: string;
  image_url?: string;
  published_at: string;
};

type SupabasePodcast = {
  id: string;
  title: string;
  description: string;
  duration: string;
  image_url?: string;
  audio_url?: string;
  published_at: string;
  link?: string;
};

export const SearchDialog = ({ open, onOpenChange, onNavigateToContent }: SearchDialogProps) => {
  const { i18n } = useTranslation();
  const { featuredVideo, recentVideos, isLoading: loadingVideos } = useWatchVideos();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: devotionals = [],
    isLoading: loadingDevotionals,
  } = useQuery({
    queryKey: ["search-devotionals", i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-pastor-rick-content", {
        body: { type: "devotional", language: i18n.language },
      });

      if (error) throw error;
      if (!data?.success || !data?.articles) {
        throw new Error("Failed to fetch devotionals");
      }

      return (data.articles as SupabaseDevotional[]).map((article) => ({
        // Use published_at as stable id to align with ReadTab list
        id: article.published_at || article.id,
        title: article.title,
        excerpt: article.excerpt,
        verse: article.verse,
        date: article.published_at,
        type: "devotional" as const,
      })) as DevotionalResult[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const {
    data: audioEpisodes = [],
    isLoading: loadingAudio,
  } = useQuery({
    queryKey: ["search-podcasts", i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-pastor-rick-content", {
        body: { type: "podcast", language: i18n.language },
      });

      if (error) throw error;
      if (!data?.success || !data?.podcasts) {
        throw new Error("Failed to fetch episodes");
      }

      return (data.podcasts as SupabasePodcast[]).map((podcast) => ({
        // Use link as primary id to align with ListenTab list
        id: podcast.link || podcast.published_at || podcast.id,
        title: podcast.title,
        description: podcast.description,
        // Duration in the feed is often missing; omit to avoid showing 0:00
        duration: podcast.duration || undefined,
        date: podcast.published_at,
        type: "audio" as const,
      })) as AudioResult[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const videos: VideoResult[] = useMemo(
    () =>
      [featuredVideo, ...recentVideos]
        .filter((video): video is NonNullable<typeof video> => video !== null)
        .map((video) => ({
          id: video.id,
          title: video.title,
          duration: video.duration,
          type: "video" as const,
        })),
    [featuredVideo, recentVideos]
  );

  const allResults: SearchResult[] = useMemo(
    () => [...devotionals, ...audioEpisodes, ...videos],
    [devotionals, audioEpisodes, videos]
  );

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const byTab = (item: SearchResult) => {
      if (activeTab === "all") return true;
      if (activeTab === "devotionals") return item.type === "devotional";
      if (activeTab === "audio") return item.type === "audio";
      if (activeTab === "videos") return item.type === "video";
      return true;
    };

    const byText = (item: SearchResult) => {
      if (!query) return true;
      const haystack = [
        item.title,
        "description" in item ? item.description : "",
        "excerpt" in item ? item.excerpt : "",
        "verse" in item ? item.verse : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    };

    return allResults.filter((item) => byTab(item) && byText(item));
  }, [allResults, activeTab, searchQuery]);

  const counts = {
    all: allResults.length,
    devotionals: allResults.filter((item) => item.type === "devotional").length,
    audio: allResults.filter((item) => item.type === "audio").length,
    videos: allResults.filter((item) => item.type === "video").length,
  };

  const handleSelect = (item: SearchResult) => {
    onNavigateToContent({ type: item.type, id: item.id });
    onOpenChange(false);
  };

  const renderResultCard = (item: SearchResult) => {
    const Icon = item.type === "video" ? Video : item.type === "audio" ? Headphones : BookOpen;

    return (
      <Card
        key={`${item.type}-${item.id}`}
        className="hover:shadow-md transition-shadow cursor-pointer border-border/80"
        onClick={() => handleSelect(item)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2">{item.title}</h3>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
                    <span className="capitalize">{item.type}</span>
                    {item.date && (
                      <>
                        <span>•</span>
                        <span>{format(new Date(item.date), "MMM d, yyyy")}</span>
                      </>
                    )}
                    {"duration" in item && item.duration && item.type !== "audio" && (
                      <>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </>
                    )}
                    {"verse" in item && item.verse && (
                      <>
                        <span>•</span>
                        <span>{item.verse}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  Open
                </Button>
              </div>
              {"description" in item && item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              )}
              {"excerpt" in item && item.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const resetSearch = () => setSearchQuery("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col gap-3">
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Find what you need"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-24"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3"
                onClick={resetSearch}
              >
                Clear
              </Button>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 overflow-hidden flex flex-col gap-3"
          >
            <TabsList className="grid grid-cols-4 w-full bg-muted/50 text-xs">
              <TabsTrigger className="px-2 py-2 leading-tight" value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger className="px-2 py-2 leading-tight" value="devotionals">Devos ({counts.devotionals})</TabsTrigger>
              <TabsTrigger className="px-2 py-2 leading-tight" value="audio">Audio ({counts.audio})</TabsTrigger>
              <TabsTrigger className="px-2 py-2 leading-tight" value="videos">Videos ({counts.videos})</TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              Showing {filteredResults.length} result{filteredResults.length === 1 ? "" : "s"}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(loadingDevotionals || loadingAudio || loadingVideos) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading content from Read, Listen, and Watch…
                </div>
              )}

              {!loadingDevotionals && !loadingAudio && !loadingVideos && filteredResults.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No results found. Try another keyword.
                </div>
              )}

              {filteredResults.map(renderResultCard)}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
