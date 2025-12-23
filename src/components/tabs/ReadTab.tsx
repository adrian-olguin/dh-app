import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Download, Check, Minus, Plus, RotateCcw } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { es, pt } from "date-fns/locale";
import { useOfflineContent } from "@/hooks/useOfflineContent";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  verse: string;
  image_url: string;
  published_at: string;
  date: string;
  link: string;
}

interface SupabaseArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  verse?: string;
  image_url?: string;
  published_at: string;
  link?: string;
}

interface ReadTabProps {
  externalSelection?: { type: "devotional"; id: string } | null;
  onSelectionConsumed?: () => void;
  resetKey?: number;
}

// Helper function to construct devotional URL from title and date
// URL pattern: https://www.pastorrick.com/{lang}/current-teaching/devotional/{slug-year}
const constructDevotionalUrl = (title: string, publishedAt: string, language: string): string => {
  const year = new Date(publishedAt).getFullYear();
  const slug = title
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  const lang = language === 'es' ? 'es' : 'en';
  return `https://www.pastorrick.com/${lang}/current-teaching/devotional/${slug}-${year}`;
};

// Helper to get the best available URL for sharing
const getShareUrl = (article: { link: string; title: string; published_at: string }, language: string): string => {
  // If we have a valid link from the API, use it
  if (article.link && (article.link.startsWith('http://') || article.link.startsWith('https://'))) {
    return article.link;
  }
  // Otherwise construct the URL from title and date
  return constructDevotionalUrl(article.title, article.published_at, language);
};

export const ReadTab = ({ externalSelection, onSelectionConsumed, resetKey }: ReadTabProps) => {
  const { t, i18n } = useTranslation();
  const { saveContent, isContentSaved } = useOfflineContent();
  const [fontSize, setFontSize] = useState(15);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Reset to home view when language changes
  useEffect(() => {
    setSelectedArticle(null);
  }, [i18n.language]);
  
  // Reset to home view when resetKey changes (tab clicked)
  useEffect(() => {
    if (resetKey !== undefined) {
      setSelectedArticle(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [resetKey]);
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'es':
        return es;
      case 'pt':
        return pt;
      default:
        return undefined;
    }
  };

  const { data: articles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['devotional-articles', i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-pastor-rick-content', {
        body: { 
          type: 'devotional',
          language: i18n.language 
        }
      });
      
      if (error) throw error;
      if (!data?.success || !data?.articles) {
        throw new Error('Failed to fetch devotionals');
      }
      
      const articles = (data.articles as SupabaseArticle[]).map((article) => ({
        // Prefer canonical link as id so search + tab match
        id: article.link || article.published_at || article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        verse: article.verse,
        image_url: article.image_url,
        published_at: article.published_at,
        link: article.link || '',
        date: new Date(article.published_at).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      })) as Article[];
      
      // Sort by published_at date (newest first)
      articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      
      return articles;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (externalSelection?.type === "devotional" && articles.length) {
      const match = articles.find((article) => article.id === externalSelection.id);
      if (match) {
        setSelectedArticle(match);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onSelectionConsumed?.();
      }
    }
  }, [externalSelection, articles, onSelectionConsumed]);

  if (error) {
    toast.error('Failed to load devotionals. Click retry to try again.');
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 23));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 11));
  };

  const resetFontSize = () => {
    setFontSize(15);
  };

  const handleDownload = (article: Article) => {
    saveContent({
      id: article.id,
      type: "devotional",
      title: article.title,
      date: article.date,
      content: article,
    });
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    // Scroll to top when opening a devotional
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-2xl mx-auto">
        <Card className="mb-6 shadow-soft overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
            <Skeleton className="h-8 w-3/4 mb-6" />
            <Skeleton className="h-48 w-full mb-6 rounded-lg" />
          </div>
        </Card>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">No devotionals available</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  const currentArticle = selectedArticle || articles[0];
  const isSaved = isContentSaved(currentArticle.id);

  // Function to strip images from HTML content to avoid duplicates
  const stripImagesFromContent = (html: string) => {
    return html.replace(/<img[^>]*>/gi, '');
  };

  // Expanded view
  if (selectedArticle) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)} className="mb-4">
          ← Back
        </Button>
        <Card className="shadow-elevated overflow-hidden">
          <CardHeader className="pb-6 pt-8 px-8 bg-muted/30">
            <CardTitle className="text-2xl mb-2">{selectedArticle.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-4">{selectedArticle.date}</p>
            {selectedArticle.verse && (
              <blockquote className="border-l-4 border-primary pl-4 italic" style={{ fontSize: `${fontSize}px` }}>
                {selectedArticle.verse}
              </blockquote>
            )}
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            {selectedArticle.image_url && (
              <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}
            <div 
              style={{ fontSize: `${fontSize}px` }} 
              className="prose prose-lg dark:prose-invert max-w-none [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:mt-6 [&>h2]:mb-4 [&>h3]:mt-4 [&>h3]:mb-3 [&>ul]:mb-4 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4"
              dangerouslySetInnerHTML={{ __html: stripImagesFromContent(selectedArticle.content) }} 
            />
            <div className="pt-6">
              <ShareButton 
                title={selectedArticle.title} 
                text={selectedArticle.excerpt} 
                url={getShareUrl(selectedArticle, i18n.language)} 
                label="Share" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // List view
  return (
    <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
      <Card className="mb-6 shadow-soft overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{articles[0].date}</span>
            </div>
            <div className="flex items-center gap-2 text-primary text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('read.todaysDevotional')}</span>
            </div>
          </div>
          
          {/* Title Section */}
          <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">{articles[0].title}</h1>
          {articles[0].excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{articles[0].excerpt}</p>
          )}
          <p className="text-xs text-muted-foreground mb-6">{articles[0].date}</p>
          
          {articles[0].image_url && (
            <img src={articles[0].image_url} alt={articles[0].title} className="w-full h-48 object-cover rounded-lg mb-6" />
          )}
          <Button onClick={() => handleArticleClick(articles[0])} className="w-full">{t('read.readToday')}</Button>
        </div>
      </Card>

      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        {t('read.recentDevotionals')}
      </h2>

      <div className="space-y-3">
        {articles.slice(1, 61).map((article) => (
          <Card key={article.id} onClick={() => handleArticleClick(article)} className="cursor-pointer hover:shadow-soft transition-all">
            <CardContent className="flex items-stretch gap-4 p-0">
              {article.image_url && (
                <div className="relative w-28 flex-shrink-0 rounded-l-lg overflow-hidden">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 py-4 pr-4">
                <p className="font-semibold text-base line-clamp-2 mb-1">{article.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
                <p className="text-xs text-muted-foreground">{article.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
