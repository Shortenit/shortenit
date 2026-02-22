import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ valid: false, message: "URL is required" }, { status: 400 });
    }

    // Attempt to fetch the URL to validate it and get the title
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
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      
      if (titleMatch && titleMatch[1]) {
        const rawTitle = titleMatch[1].trim();
        // Filter out common "bot protection" or "loading" titles
        if (!/^(Just a moment|Access denied|Security Check|Attention Required|Loading|Please wait)/i.test(rawTitle)) {
             title = rawTitle;
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
