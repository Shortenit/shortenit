import { NextResponse } from 'next/server';

// Check if a URL is a YouTube video URL
function getYouTubeVideoUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (
      (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') &&
      urlObj.pathname === '/watch' &&
      urlObj.searchParams.has('v')
    ) {
      return url;
    }
    if (urlObj.hostname === 'youtu.be' && urlObj.pathname.length > 1) {
      return `https://www.youtube.com/watch?v=${urlObj.pathname.slice(1)}`;
    }
    if (
      (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') &&
      urlObj.pathname.startsWith('/shorts/')
    ) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

// Try YouTube oEmbed API for reliable title extraction
async function fetchYouTubeTitle(videoUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
    const response = await fetch(oembedUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return data.title || "";
    }
    return "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ valid: false, message: "URL is required" }, { status: 400 });
    }

    // For YouTube URLs, use the oEmbed API for reliable title extraction
    const youtubeUrl = getYouTubeVideoUrl(url);
    if (youtubeUrl) {
      const ytTitle = await fetchYouTubeTitle(youtubeUrl);
      return NextResponse.json({ valid: true, title: ytTitle });
    }

    // For all other URLs, fetch the page and extract the title
    let controller: AbortController;
    let timeoutId: NodeJS.Timeout | undefined;

    try {
       controller = new AbortController();
       timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
            // Emulate a real browser to avoid "Just a moment" Cloudflare checks
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5"
        }
      });
      clearTimeout(timeoutId);

      if (response.status !== 403 && !response.ok) {
        return NextResponse.json({ valid: false, message: `URL returned status ${response.status}` }, { status: 400 });
      }

      const html = await response.text();
      let title = "";

      // 1. Try <title> tag
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        const rawTitle = titleMatch[1].trim();
        // Filter out common "bot protection" or "loading" titles
        if (!/^(Just a moment|Access denied|Security Check|Attention Required|Loading|Please wait)/i.test(rawTitle)) {
             title = rawTitle;
        }
      }

      // 2. If title is empty or too generic (single word like just the site name), try og:title
      if (!title || title.split(/\s+/).length <= 1) {
        const ogMatch = html.match(/<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i)
                      || html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i);
        if (ogMatch && ogMatch[1]) {
          title = ogMatch[1].trim();
        }
      }

      // 3. Still empty? Try twitter:title
      if (!title) {
        const twitterMatch = html.match(/<meta\s+(?:property|name)=["']twitter:title["']\s+content=["']([^"']+)["']/i)
                           || html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']twitter:title["']/i);
        if (twitterMatch && twitterMatch[1]) {
          title = twitterMatch[1].trim();
        }
      }

      return NextResponse.json({ valid: true, title });
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      return NextResponse.json({ valid: false, message: "Could not reach the URL. Please check if it works." }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
  }
}

