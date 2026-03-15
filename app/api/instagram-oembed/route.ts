import { NextRequest } from 'next/server';

export type InstagramOembed = {
  thumbnail_url?: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
};

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FETCH_HEADERS = {
  'User-Agent': BROWSER_UA,
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
} as const;

function extractOgImage(html: string): string | null {
  const match =
    html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
    html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i) ||
    html.match(/"og:image"\s*,\s*"content"\s*:\s*"([^"]+)"/);
  if (!match || !match[1]) return null;
  return match[1].trim().replace(/&amp;/g, '&');
}

const FETCH_TIMEOUT_MS = 5000;

/** Пытается получить URL превью из страницы поста или embed (og:image). */
async function fetchOgImage(postUrl: string, postId: string): Promise<string | null> {
  const urlsToTry = [
    postUrl,
    `https://www.instagram.com/p/${postId}/embed/`,
    `https://www.instagram.com/p/${postId}/embed/captioned/`,
  ];
  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        cache: 'no-store',
        headers: FETCH_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) continue;
      const html = await res.text();
      const img = extractOgImage(html);
      if (img && img.startsWith('http')) return img;
    } catch {
      /* try next URL */
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const id = searchParams.get('id');
  let postUrl = url || '';
  if (id) postUrl = `https://www.instagram.com/p/${encodeURIComponent(id)}/`;
  if (!postUrl || !/instagram\.com\/p\/[A-Za-z0-9_-]+/i.test(postUrl)) {
    return Response.json({ error: 'Invalid URL or id' }, { status: 400 });
  }
  if (!postUrl.startsWith('http')) postUrl = 'https://www.instagram.com/p/' + (id || postUrl.replace(/^\/+/, '')) + '/';

  const data: InstagramOembed = {};

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const oembedRes = await fetch(
      `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}`,
      { cache: 'no-store', signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (oembedRes.ok) {
      const oembed = (await oembedRes.json()) as InstagramOembed;
      if (oembed.thumbnail_url) data.thumbnail_url = oembed.thumbnail_url;
      if (oembed.title) data.title = oembed.title;
      if (oembed.author_name) data.author_name = oembed.author_name;
      if (oembed.author_url) data.author_url = oembed.author_url;
    }
  } catch {
    /* oEmbed не сработал — пробуем og:image */
  }

  if (!data.thumbnail_url) {
    const postId = postUrl.match(/\/p\/([A-Za-z0-9_-]+)/)?.[1];
    if (postId) {
      const ogImage = await fetchOgImage(postUrl, postId);
      if (ogImage) data.thumbnail_url = ogImage;
    }
  }

  return Response.json(data);
}
