/**
 * Замена Instagram blockquote на разметку для карточки.
 * Работает на сервере и в браузере (без document).
 */

function extractInstagramPostId(permalinkRaw: string): string | null {
  const trimmed = (permalinkRaw || '')
    .trim()
    .replace(/&amp;/g, '&')
    .replace(/\?.*$/, '');
  const m = trimmed.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
}

/** Ищем permalink в строке (атрибут или href). */
function findInstagramPostIdInBlock(block: string): string | null {
  const attrMatch = block.match(/data-instgrm-permalink\s*=\s*["']([^"']+)["']/i);
  if (attrMatch) return extractInstagramPostId(attrMatch[1]);
  const hrefMatch = block.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  return hrefMatch ? hrefMatch[1] : null;
}

/**
 * Удаляет script embed.js и заменяет блоки <blockquote ...>...</blockquote> с Instagram
 * на <div class="article-embed"> с разметкой под карточку (iframe URL для парсинга).
 */
export function replaceInstagramBlockquotes(html: string): string {
  if (!html || typeof html !== 'string') return html;
  let out = html;

  // 1) Удаляем script embed.js (иначе он может пытаться обработать blockquote и дать запрос к "<blockquote>")
  out = out.replace(
    /<script[^>]*src=["']\/\/www\.instagram\.com\/embed\.js["'][^>]*><\/script>\s*/gi,
    ''
  );

  // 2) Замена по точному совпадению: blockquote с data-instgrm-permalink в теге
  const strictRegex =
    /<blockquote[\s\S]*?data-instgrm-permalink\s*=\s*["']([^"']+)["'][\s\S]*?<\/blockquote>/gi;
  out = out.replace(strictRegex, (_full, permalink: string) => {
    const postId = extractInstagramPostId(permalink);
    if (!postId) return '';
    const embedUrl = `https://www.instagram.com/p/${postId}/embed/`;
    return `<div class="article-embed"><iframe src="${embedUrl}" class="article-embed-iframe" title="Instagram"></iframe></div>`;
  });

  // 3) Более мягкий проход: любой <blockquote>...</blockquote>, внутри которого есть instagram.com/p/ (в т.ч. в href)
  const len = out.length;
  let start = 0;
  const result: string[] = [];
  const blockquoteStart = /<blockquote[\s>]/gi;
  let m: RegExpExecArray | null;
  while ((m = blockquoteStart.exec(out)) !== null) {
    const openEnd = out.indexOf('>', m.index);
    if (openEnd === -1) break;
    let depth = 1;
    let pos = openEnd + 1;
    let closeIndex = -1;
    while (pos < out.length && depth > 0) {
      const nextOpen = out.indexOf('<blockquote', pos);
      const nextClose = out.indexOf('</blockquote>', pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 1;
      } else {
        depth--;
        if (depth === 0) {
          closeIndex = nextClose;
          break;
        }
        pos = nextClose + 13;
      }
    }
    if (closeIndex === -1) break;
    const block = out.slice(m.index, closeIndex + 13);
    const postId = findInstagramPostIdInBlock(block);
    result.push(out.slice(start, m.index));
    if (postId) {
      const embedUrl = `https://www.instagram.com/p/${postId}/embed/`;
      result.push(
        `<div class="article-embed"><iframe src="${embedUrl}" class="article-embed-iframe" title="Instagram"></iframe></div>`
      );
    } else {
      result.push(block);
    }
    start = closeIndex + 13;
    blockquoteStart.lastIndex = start;
  }
  if (result.length > 0) {
    result.push(out.slice(start));
    out = result.join('');
  }

  // 4) Удаляем оставшиеся blockquote с instagram (чтобы не оставалось сырого blockquote)
  out = out.replace(/<blockquote[^>]*instagram[^>]*>[\s\S]*?<\/blockquote>/gi, '');
  out = out.replace(/<blockquote[\s\S]*?instagram-media[\s\S]*?<\/blockquote>/gi, '');

  return out;
}
