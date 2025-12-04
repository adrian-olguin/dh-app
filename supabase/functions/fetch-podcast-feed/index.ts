const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to extract text content from XML tags
function extractTagContent(xml: string, tag: string, startIndex = 0): string {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  const cdataPattern = /<!\[CDATA\[(.*?)\]\]>/s;
  
  const startPos = xml.indexOf(openTag, startIndex);
  if (startPos === -1) return '';
  
  const contentStart = startPos + openTag.length;
  const endPos = xml.indexOf(closeTag, contentStart);
  if (endPos === -1) return '';
  
  let content = xml.substring(contentStart, endPos).trim();
  
  // Handle CDATA sections
  const cdataMatch = content.match(cdataPattern);
  if (cdataMatch) {
    content = cdataMatch[1];
  }
  
  return content;
}

// Helper function to extract attribute from self-closing tags
function extractAttribute(xml: string, tag: string, attribute: string, startIndex = 0): string {
  const tagPattern = new RegExp(`<${tag}[^>]*${attribute}=["']([^"']*)["'][^>]*/?>`);
  const match = xml.slice(startIndex).match(tagPattern);
  return match ? match[1] : '';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check cache first
    const now = Date.now();
    if (cache && (now - cache.timestamp) < CACHE_TTL) {
      console.log('Returning cached episodes (age:', Math.round((now - cache.timestamp) / 1000), 'seconds)');
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
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${Math.round(CACHE_TTL / 1000)}`,
          },
        }
      );
    }

    console.log('Cache miss or expired, fetching RSS feed...');
    
    const feedUrl = 'https://rss.libsyn.com/shows/87974/destinations/430545.xml';
    const response = await fetch(feedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('RSS feed fetched successfully, parsing...');

    // Split into individual items
    const itemMatches = xmlText.split('<item>').slice(1); // Skip first part before items
    console.log(`Found ${itemMatches.length} items to parse`);

    const episodes: Episode[] = [];

    for (let i = 0; i < Math.min(itemMatches.length, 20); i++) {
      const itemXml = itemMatches[i];
      
      const title = extractTagContent(itemXml, 'title');
      const description = extractTagContent(itemXml, 'description');
      const pubDate = extractTagContent(itemXml, 'pubDate');
      const audioUrl = extractAttribute(itemXml, 'enclosure', 'url');
      const duration = extractTagContent(itemXml, 'itunes:duration');
      
      // Try multiple image sources
      let thumbnail = extractAttribute(itemXml, 'itunes:image', 'href') ||
                     extractAttribute(itemXml, 'media:thumbnail', 'url') ||
                     extractAttribute(itemXml, 'media:content', 'url');
      
      // Generate unique AI image if no thumbnail found
      if (!thumbnail && title) {
        try {
          const imagePrompt = `A beautiful, spiritual, and uplifting image representing: ${title}. Warm colors, peaceful atmosphere, inspirational. 16:9 aspect ratio.`;
          
          const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-image-preview',
              messages: [{
                role: 'user',
                content: imagePrompt
              }],
              modalities: ['image', 'text']
            })
          });
          
          const aiData = await aiResponse.json();
          thumbnail = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url || 
                     'https://static.libsyn.com/p/assets/1/9/d/9/19d95b4001eb1d18/RickWarren-DH_1400x1400.jpg';
        } catch (err) {
          console.error('Error generating AI image:', err);
          thumbnail = 'https://static.libsyn.com/p/assets/1/9/d/9/19d95b4001eb1d18/RickWarren-DH_1400x1400.jpg';
        }
      }
      
      // Format date
      let formattedDate = 'Recent';
      try {
        const parsedDate = new Date(pubDate);
        formattedDate = parsedDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } catch (e) {
        console.log('Date parsing error:', e);
      }

      if (title && audioUrl) {
        episodes.push({
          id: `episode-${i + 1}`,
          title: title.trim(),
          description: description.trim().substring(0, 200),
          date: formattedDate,
          duration: duration || '0:00',
          thumbnail: thumbnail,
          audioUrl: audioUrl,
          pubDate: pubDate,
        });
      }
    }

    console.log(`Successfully parsed ${episodes.length} episodes`);

    // Update cache
    cache = {
      episodes,
      feedTitle: 'Pastor Rick\'s Daily Hope',
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
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${Math.round(CACHE_TTL / 1000)}`,
        },
      }
    );

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
