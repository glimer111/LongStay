'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { removeDuplicateCaptionParagraphs } from '@/lib/sanitizeArticleHtml';
import Image from 'next/image';
import styles from './ArticleContent.module.css';

type ContentSegment =
  | { type: 'html'; content: string }
  | { type: 'embed'; src: string };

interface Article {
  titleRu: string;
  titleEn: string | null;
  excerptRu?: string | null;
  excerptEn?: string | null;
  contentRu: string;
  contentEn: string | null;
  imageUrl: string | null;
}

function normalizeArticleContent(html: string): string {
  if (typeof document === 'undefined') return html;
  let out = removeDuplicateCaptionParagraphs(html);
  const div = document.createElement('div');
  div.innerHTML = out;

  const toArray = (list: NodeListOf<Element> | HTMLCollectionOf<Element>) => Array.from(list);

  toArray(div.children).forEach((child) => {
    if (child.tagName !== 'P') return;
    const img = child.querySelector('img');
    if (!img || child.querySelectorAll('img').length > 1) return;
    const onlyImg = child.textContent?.trim() === '' && child.children.length === 1;
    if (!onlyImg) return;
    const next1 = child.nextElementSibling;
    const next2 = next1?.nextElementSibling;
    const p1Text = next1?.tagName === 'P' ? (next1.textContent ?? '').trim() : '';
    const p2Text = next2?.tagName === 'P' ? (next2.textContent ?? '').trim() : '';
    if (!p1Text) return;
    const figure = document.createElement('figure');
    figure.className = 'article-figure';
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'article-figcaption';
    const divA = document.createElement('div');
    divA.className = 'caption-attribution';
    divA.textContent = p1Text;
    const divD = document.createElement('div');
    divD.className = 'caption-description';
    divD.textContent = p2Text;
    figcaption.append(divA, divD);
    figure.append(img.cloneNode(true), figcaption);
    child.replaceWith(figure);
    next1?.remove();
    if (p2Text) next2?.remove();
  });

  return div.innerHTML;
}

/** Если в src попал HTML/атрибуты — оставляет только первый валидный https-URL. */
function cleanEmbedSrc(raw: string): string {
  const t = raw.trim();
  if (!t.includes('<') && !t.includes('width=') && /^https?:\/\/[^\s"']+$/i.test(t)) return t;
  const m = t.match(/https?:\/\/[^\s"'<>]+/i);
  return m ? m[0] : t;
}

/** Извлекает блоки embed и src из HTML по строке (без innerHTML, чтобы браузер не трогал iframe). */
function parseSegmentsFromHtml(html: string): ContentSegment[] {
  const segs: ContentSegment[] = [];
  const regex = /<div[^>]*class="[^"]*article-embed[^"]*"[^>]*>[\s\S]*?<iframe[\s\S]*?src=["']([^"']+)["'][\s\S]*?<\/iframe>[\s\S]*?<\/div>/gi;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segs.push({ type: 'html', content: html.slice(lastIndex, match.index) });
    }
    const src = cleanEmbedSrc(match[1] || '');
    if (src && /^https?:\/\//i.test(src)) {
      segs.push({ type: 'embed', src });
    } else {
      segs.push({ type: 'html', content: match[0] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    segs.push({ type: 'html', content: html.slice(lastIndex) });
  }
  return segs.length > 0 ? segs : [{ type: 'html', content: html }];
}

export default function ArticleContent({ article }: { article: Article }) {
  const { locale, setLocale, t } = useLanguage();
  const hasEnglish = (article.titleEn != null && String(article.titleEn).trim() !== '') &&
    (article.contentEn != null && String(article.contentEn).trim() !== '');

  if (locale === 'en' && !hasEnglish) {
    return (
      <article className={styles.article}>
        <div className={styles.container}>
          <div className={styles.onlyRussian}>
            <p>{t.article.onlyInRussian}</p>
            <button type="button" onClick={() => setLocale('ru')} className={styles.showRussianBtn}>
              {t.article.showInRussian}
            </button>
          </div>
        </div>
      </article>
    );
  }

  const title = locale === 'ru' ? article.titleRu : (article.titleEn || article.titleRu);
  const excerpt = locale === 'ru' ? article.excerptRu : (article.excerptEn || article.excerptRu);
  const rawContent = locale === 'ru' ? article.contentRu : (article.contentEn || article.contentRu);
  const [content, setContent] = useState(rawContent);
  const [segments, setSegments] = useState<ContentSegment[] | null>(null);

  useEffect(() => {
    const normalized = typeof document !== 'undefined' ? normalizeArticleContent(rawContent) : rawContent;
    setContent(normalized);
    setSegments(parseSegmentsFromHtml(normalized));
  }, [rawContent]);

  const renderContent = () => {
    if (segments !== null && segments.length > 0) {
      return (
        <div className={styles.content}>
          {segments.map((seg, i) =>
            seg.type === 'embed' ? (
              <div key={i} className={styles.embedBlock}>
                <div className={styles.embedVideoWrap}>
                  <iframe
                    src={seg.src}
                    className={styles.embedIframe}
                    title="Встроенное содержимое"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <a
                  href={seg.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.embedFallbackLink}
                >
                  Открыть в новой вкладке
                </a>
              </div>
            ) : (
              <div key={i} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: seg.content }} />
            )
          )}
        </div>
      );
    }
    return (
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
    );
  };

  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        {article.imageUrl && (
          <div className={styles.image}>
            <img src={article.imageUrl} alt="" />
          </div>
        )}
        {renderContent()}
      </div>
    </article>
  );
}
