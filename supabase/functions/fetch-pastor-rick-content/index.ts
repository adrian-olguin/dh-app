// Deno global type declaration for Supabase Edge Functions
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CacheEntry {
  data: any[];
  timestamp: number;
}

const podcastCache: Map<string, CacheEntry> = new Map();
const devotionalCache: Map<string, CacheEntry> = new Map();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to extract content from XML tags
function extractTagContent(xml: string, tag: string, startIndex = 0): string {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  const cdataStart = '<![CDATA[';
  const cdataEnd = ']]>';
  
  const start = xml.indexOf(openTag, startIndex);
  if (start === -1) return '';
  
  const contentStart = start + openTag.length;
  const end = xml.indexOf(closeTag, contentStart);
  if (end === -1) return '';
  
  let content = xml.substring(contentStart, end).trim();
  
  // Handle CDATA
  if (content.startsWith(cdataStart)) {
    content = content.substring(cdataStart.length);
    const cdataEndIndex = content.indexOf(cdataEnd);
    if (cdataEndIndex !== -1) {
      content = content.substring(0, cdataEndIndex);
    }
  }
  
  return content.trim();
}

// Helper function to extract attributes from self-closing tags
function extractAttribute(xml: string, tag: string, attribute: string, startIndex = 0): string {
  const tagStart = xml.indexOf(`<${tag}`, startIndex);
  if (tagStart === -1) return '';
  
  const tagEnd = xml.indexOf('>', tagStart);
  if (tagEnd === -1) return '';
  
  const tagContent = xml.substring(tagStart, tagEnd);
  const attrPattern = new RegExp(`${attribute}="([^"]*)"`, 'i');
  const match = tagContent.match(attrPattern);
  
  return match ? match[1] : '';
}

async function fetchRSSFeed(url: string, type: 'podcast' | 'devotional') {
  console.log(`Fetching ${type} RSS feed from:`, url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} feed: ${response.status}`);
  }
  
  const xmlText = await response.text();
  console.log(`Received XML, length: ${xmlText.length}`);
  const items: any[] = [];
  
  let itemStart = 0;
  const maxItems = 60;
  
  while (items.length < maxItems) {
    itemStart = xmlText.indexOf('<item>', itemStart);
    if (itemStart === -1) break;
    
    const itemEnd = xmlText.indexOf('</item>', itemStart);
    if (itemEnd === -1) break;
    
    const itemXml = xmlText.substring(itemStart, itemEnd + 7);
    
    const title = extractTagContent(itemXml, 'title');
    const description = extractTagContent(itemXml, 'description');
    const pubDate = extractTagContent(itemXml, 'pubDate');
    
    // Try multiple ways to get the image
    let imageUrl = extractAttribute(itemXml, 'itunes:image', 'href');
    if (!imageUrl) {
      imageUrl = extractTagContent(itemXml, 'itunes:image');
    }
    if (!imageUrl) {
      imageUrl = extractAttribute(itemXml, 'media:content', 'url');
    }
    if (!imageUrl) {
      imageUrl = extractAttribute(itemXml, 'media:thumbnail', 'url');
    }
    if (!imageUrl) {
      // Try to extract from enclosure if it's an image
      const enclosureUrl = extractAttribute(itemXml, 'enclosure', 'url');
      const enclosureType = extractAttribute(itemXml, 'enclosure', 'type');
      if (enclosureUrl && enclosureType && enclosureType.startsWith('image/')) {
        imageUrl = enclosureUrl;
      }
    }
    if (!imageUrl && type === 'devotional') {
      // For devotionals, try to extract image from content:encoded
      const content = extractTagContent(itemXml, 'content:encoded');
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      }
    }
    
    console.log(`Item ${items.length}: title="${title}", hasImage=${!!imageUrl}`);
    
    if (type === 'podcast') {
      const audioUrl = extractAttribute(itemXml, 'enclosure', 'url');
      const duration = extractTagContent(itemXml, 'itunes:duration');
      
      console.log(`Podcast audio URL: ${audioUrl}, duration: ${duration}`);
      
      items.push({
        id: `podcast-${items.length}-${Date.now()}`,
        title: title || 'Untitled',
        description: description || '',
        audio_url: audioUrl || '',
        duration: duration || '0:00',
        image_url: imageUrl || '',
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        type: 'podcast'
      });
    } else {
      const content = extractTagContent(itemXml, 'content:encoded') || description;
      const verse = ''; // RSS doesn't have verse field, would need to parse from content
      
      items.push({
        id: `devotional-${items.length}-${Date.now()}`,
        title: title || 'Untitled',
        excerpt: description || '',
        content: content || '',
        verse: verse,
        image_url: imageUrl || '',
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        type: 'article'
      });
    }
    
    itemStart = itemEnd + 60;
  }
  
  console.log(`Parsed ${items.length} ${type} items from RSS feed`);
  return items;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, language } = await req.json();
    console.log(`Request for ${type} content in ${language}`);
    
    const lang = language || 'en';
    const contentType = type || 'podcast';
    
    // Determine cache and URL
    const cache = contentType === 'podcast' ? podcastCache : devotionalCache;
    const cacheKey = `${contentType}-${lang}`;
    
    // Check cache
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log('Returning cached content');
      return new Response(
        JSON.stringify({ 
          success: true, 
          [contentType === 'podcast' ? 'podcasts' : 'articles']: cached.data 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine RSS feed URL
    let rssUrl: string;
    if (contentType === 'podcast') {
      rssUrl = lang === 'es' 
        ? 'https://www.pastorrick.com/rss/es/broadcast/feed'
        : 'https://www.pastorrick.com/rss/en/broadcast/feed';
    } else {
      rssUrl = lang === 'es'
        ? 'https://www.pastorrick.com/rss/es/devotional/feed'
        : 'https://www.pastorrick.com/rss/en/devotional/feed';
    }
    
    // Fetch and parse RSS
    const items = await fetchRSSFeed(rssUrl, contentType);
    
    // Update cache
    cache.set(cacheKey, {
      data: items,
      timestamp: now
    });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        [contentType === 'podcast' ? 'podcasts' : 'articles']: items
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300'
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        podcasts: [],
        articles: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
