const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
  pubDate: string;
}

interface CacheEntry {
  episodes: Episode[];
  feedTitle: string;
  timestamp: number;
}

// In-memory cache with 5 minute TTL
let cache: CacheEntry | null = null;
const CACHE_TTL = 5 * 60 * 1000;

// How many episodes you want to allow
// Set to itemMatches.length for unlimited
const LIMIT = 200;

// Helper to extract tag content
function extractTagContent(xml: string, tag: string, startIndex = 0): string {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  const cdataPattern = /<!\[CDATA\[(.*?)\]\]>/s;

  const startPos = xml.indexOf(openTag, startIndex);
  if (startPos === -1) return "";

  const contentStart = startPos + openTag.length;
  const endPos = xml.indexOf(closeTag, contentStart);
  if (endPos === -1) return "";

  let content = xml.substring(contentStart, endPos).trim();

  const cdataMatch = content.match(cdataPattern);
  if (cdataMatch) {
    content = cdataMatch[1];
  }

  return content;
}

// Helper to extract attributes
function extractAttribute(
  xml: string,
  tag: string,
  attribute: string,
  startIndex = 0
): string {
  const tagPattern = new RegExp(`<${tag}[^>]*${attribute}=["']([^"']*)["'][^>]*>`);
  const match = xml.slice(startIndex).match(tagPattern);
  return match ? match[1] : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();

    // Serve cached data
    if (cache && now - cache.timestamp < CACHE_TTL) {
      console.log(
        "Returning cached episodes (age:",
        Math.round((now - cache.timestamp) / 1000),
        "seconds)"
      );

      return new Response(
        JSON.stringify({
          success: true,
          episodes: cache.episodes,
          feedTitle: cache.feedTitle,
          cached: true,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${Math.round(
              CACHE_TTL / 1000
            )}`,
          },
        }
      );
    }

    console.log("Cache miss — fetching RSS feed…");

    // Your feed URL
    const feedUrl =
      "const feedUrl = 'https://www.pastorrick.com/rss/en/broadcast/feed';";

    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();

    console.log("RSS feed fetched — parsing…");

    // Split into <item> blocks
    const itemBlocks = xmlText.split("<item>").slice(1);
    console.log(`Found ${itemBlocks.length} items in feed`);

    const episodes: Episode[] = [];

    // Loop through all items (up to LIMIT)
    const count = Math.min(itemBlocks.length, LIMIT);

    for (let i = 0; i < count; i++) {
      const itemXml = itemBlocks[i];

      const title = extractTagContent(itemXml, "title");
      const description = extractTagContent(itemXml, "description");
      const pubDate = extractTagContent(itemXml, "pubDate");
      const audioUrl = extractAttribute(itemXml, "enclosure", "url");
      const duration = extractTagContent(itemXml, "itunes:duration");

      // Try multiple possible image sources
      let thumbnail =
        extractAttribute(itemXml, "itunes:image", "href") ||
        extractAttribute(itemXml, "media:thumbnail", "url") ||
        extractAttribute(itemXml, "media:content", "url");

      // Default thumbnail fallback
      if (!thumbnail) {
        thumbnail =
          "https://static.libsyn.com/p/assets/1/9/d/9/19d95b4001eb1d18/RickWarren-DH_1400x1400.jpg";
      }

      // Format display date
      let formattedDate = "Recent";
      try {
        const d = new Date(pubDate);
        formattedDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch (_) {}

      if (title && audioUrl) {
        episodes.push({
          id: `episode-${i + 1}`,
          title: title.trim(),
          description: description.trim().substring(0, 200),
          date: formattedDate,
          duration: duration || "0:00",
          thumbnail,
          audioUrl,
          pubDate,
        });
      }
    }

    console.log(`Parsed ${episodes.length} total episodes`);

    // Update cache
    cache = {
      episodes,
      feedTitle: "Pastor Rick's Daily Hope",
      timestamp: Date.now(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        episodes,
        feedTitle: cache.feedTitle,
        cached: false,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${Math.round(
            CACHE_TTL / 1000
          )}`,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching RSS:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
