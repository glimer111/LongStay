/**
 * Удаляет абзацы после figure.article-figure, если их текст совпадает с подписью.
 * Используется при загрузке контента в админке и при отображении на сайте.
 */
export function removeDuplicateCaptionParagraphs(html: string): string {
  if (typeof document === 'undefined') return html;
  const div = document.createElement('div');
  div.innerHTML = html;

  const figures = div.querySelectorAll('figure.article-figure');
  figures.forEach((fig) => {
    const figcap = fig.querySelector('figcaption.article-figcaption');
    const captionText = (figcap?.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!captionText) return;
    let next = fig.nextElementSibling;
    while (next?.tagName === 'P') {
      const pText = (next.textContent ?? '').replace(/\s+/g, ' ').trim();
      if (pText && (pText === captionText || captionText.includes(pText) || pText.includes(captionText))) {
        const toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      } else {
        break;
      }
    }
  });

  return div.innerHTML;
}
