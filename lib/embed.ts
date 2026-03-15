/**
 * Единая логика embed на сайте: нормализация HTML, парсинг сегментов, безопасные URL.
 * Используется в ArticleContent и при подготовке контента статьи.
 */

import { replaceInstagramBlockquotes } from '@/lib/instagram-embed';

export type EmbedAlign = 'left' | 'center' | 'right';

export type EmbedSegment = { type: 'html'; content: string } | { type: 'embed'; src: string; align?: EmbedAlign };

/** Нормализует HTML контента: убирает script Instagram, заменяет blockquote на div.article-embed с iframe. */
export function normalizeEmbedHtml(html: string): string {
  if (!html || typeof html !== 'string') return html;
  return replaceInstagramBlockquotes(html);
}

/** Извлекает из src только валидный URL (без HTML/тегов). */
function cleanEmbedSrc(raw: string): string {
  const t = String(raw || '').trim();
  if (!t || t.startsWith('<') || t.includes('>')) return '';
  if (/^https?:\/\//i.test(t) && !t.includes('<')) return t;
  if (/^\/\/[^\s"'<>]+/i.test(t)) return 'https:' + t.replace(/^\/\/+/, '//');
  const m = t.match(/(?:https?:)?\/\/[^\s"'<>]+/i);
  if (m && m[0].length > 10) return m[0].startsWith('http') ? m[0] : 'https:' + m[0];
  return '';
}

/** Парсит нормализованный HTML в сегменты: html и embed (с src и align). */
export function parseEmbedSegments(html: string): EmbedSegment[] {
  const normalized = normalizeEmbedHtml(html);
  const segments: EmbedSegment[] = [];
  const embedRegex =
    /<div[^>]*class="[^"]*article-embed[^"]*"[^>]*>[\s\S]*?<iframe[\s\S]*?src=["']([^"']+)["'][\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi;
  let lastIndex = 0;
  let match;
  while ((match = embedRegex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'html', content: normalized.slice(lastIndex, match.index) });
    }
    const src = cleanEmbedSrc(match[1] || '');
    const fullMatch = match[0];
    let align: EmbedAlign = 'center';
    if (fullMatch.includes('article-embed--left')) align = 'left';
    else if (fullMatch.includes('article-embed--right')) align = 'right';
    if (src && /^https?:\/\//i.test(src)) {
      segments.push({ type: 'embed', src, align });
    } else {
      segments.push({ type: 'html', content: fullMatch });
    }
    lastIndex = embedRegex.lastIndex;
  }
  if (lastIndex < normalized.length) {
    segments.push({ type: 'html', content: normalized.slice(lastIndex) });
  }
  return segments.length > 0 ? segments : [{ type: 'html', content: normalized }];
}

export function isInstagramSrc(src: string): boolean {
  const s = String(src || '');
  return /instagram/i.test(s) || /\/p\/[A-Za-z0-9_-]+\/embed/i.test(s);
}

/** Всегда возвращает абсолютный URL поста в Instagram (не embed URL). */
export function getInstagramPostUrl(src: string): string {
  const m = String(src || '').match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  if (m && m[1]) return `https://www.instagram.com/p/${m[1]}/`;
  const u = src.replace(/\/embed\/?(\?.*)?$/i, '').split('?')[0].trim();
  if (u.startsWith('//')) return 'https:' + u;
  if (/^https?:\/\//i.test(u)) return u;
  return 'https://www.instagram.com/';
}

/** URL для iframe: https://www.instagram.com/p/ID/embed/ */
export function getInstagramEmbedUrl(src: string): string {
  const m = String(src || '').match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  if (m && m[1]) return `https://www.instagram.com/p/${m[1]}/embed/`;
  return 'https://www.instagram.com/';
}

export function isEmbedSrcInvalid(src: string): boolean {
  const s = String(src || '');
  return !s || s.includes('<') || s.includes('>') || /^&lt;/.test(s);
}

/** Безопасный href для ссылки «Открыть в новой вкладке»: никогда не подставлять теги/HTML. */
export function getSafeEmbedLinkHref(src: string): string {
  const s = String(src || '').trim();
  if (!s || s.includes('<') || s.includes('>') || /^&lt;/.test(s)) return '#';
  if (isInstagramSrc(s)) return getInstagramPostUrl(s);
  if (/^https?:\/\//i.test(s)) return s;
  return '#';
}
