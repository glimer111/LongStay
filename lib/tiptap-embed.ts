import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { EmbedNodeView } from '@/components/EmbedNodeView';

/** Всегда возвращает абсолютный URL с протоколом (чтобы iframe не загружал свой же сайт и не давал 404). */
function ensureAbsoluteUrl(url: string): string {
  const t = url.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('//')) return 'https:' + t;
  if (t.startsWith('/')) return ''; // относительный путь — не подходит для embed
  return 'https://' + t;
}

/** Если вставлен код iframe/HTML — извлекает только значение src (один чистый URL). Экспортируется для обработки вставки из буфера. */
export function extractSrcFromPaste(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t) && !t.includes('<') && !t.includes('>')) return null;
  const match = t.match(/src\s*=\s*["']([^"']+)["']/i);
  if (match && match[1]) {
    const src = match[1].trim();
    if (/^https?:\/\//i.test(src)) return src;
  }
  return null;
}

/** Преобразует ссылку на видео/страницу в URL для iframe embed (если возможно). */
export function normalizeEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  const fromHtml = extractSrcFromPaste(trimmed);
  const toNormalize = fromHtml ?? trimmed;

  const absolute = ensureAbsoluteUrl(toNormalize);
  if (!absolute) return '';

  try {
    const u = new URL(absolute);

    // YouTube: watch и youtu.be -> embed
    if (u.hostname === 'www.youtube.com' && u.pathname === '/watch' && u.searchParams.has('v')) {
      const v = u.searchParams.get('v');
      const t = u.searchParams.get('t');
      let embed = `https://www.youtube.com/embed/${v}`;
      if (t) embed += `?start=${t}`;
      return embed;
    }
    if (u.hostname === 'youtube.com' && u.pathname === '/watch' && u.searchParams.has('v')) {
      const v = u.searchParams.get('v');
      return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === 'youtu.be') {
      const v = u.pathname.slice(1).split('/')[0] || u.pathname.slice(1);
      return v ? `https://www.youtube.com/embed/${v}` : absolute;
    }

    // Vimeo: vimeo.com/123 -> player.vimeo.com/video/123
    if (/^vimeo\.com$/i.test(u.hostname) && u.pathname && u.pathname !== '/') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://player.vimeo.com/video/${id}` : absolute;
    }

    // Уже embed-подобный или любой https — возвращаем абсолютный URL
    if (u.protocol === 'https:' || u.protocol === 'http:') return absolute;
  } catch {
    return absolute || trimmed;
  }
  return absolute;
}

export const Embed = Node.create({
  name: 'embed',

  group: 'block',
  atom: true,

  addNodeView() {
    return ReactNodeViewRenderer(EmbedNodeView);
  },

  addAttributes() {
    return {
      src: {
        default: null as string | null,
        parseHTML: (el) => {
          const wrap = (el as HTMLElement).closest?.('.article-embed');
          const iframe = wrap?.querySelector('iframe');
          return iframe?.getAttribute('src') ?? null;
        },
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.article-embed',
        getAttrs: (dom) => {
          const div = dom as HTMLElement;
          const iframe = div.querySelector('iframe');
          const src = iframe?.getAttribute('src')?.trim();
          return src ? { src } : false;
        },
      },
    ];
  },

  renderHTML({ node }) {
    const src = node.attrs.src != null ? String(node.attrs.src).trim() : '';
    if (!src) {
      return ['div', { class: 'article-embed article-embed--empty' }, ['span', {}, 'Вставьте ссылку на embed']];
    }
    return [
      'div',
      { class: 'article-embed' },
      ['iframe', { src, class: 'article-embed-iframe', title: 'Встроенное содержимое' }],
    ];
  },
});
