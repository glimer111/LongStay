'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { removeDuplicateCaptionParagraphs } from '@/lib/sanitizeArticleHtml';
import {
  normalizeEmbedHtml,
  parseEmbedSegments,
  isInstagramSrc,
  getSafeEmbedLinkHref,
  getInstagramEmbedUrl,
  isEmbedSrcInvalid,
  type EmbedSegment,
} from '@/lib/embed';
import styles from './ArticleContent.module.css';

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

export default function ArticleContent({ article }: { article: Article }) {
  const { locale, setLocale, t } = useLanguage();
  const hasEnglish =
    (article.titleEn != null && String(article.titleEn).trim() !== '') &&
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
  const [segments, setSegments] = useState<EmbedSegment[] | null>(() =>
    parseEmbedSegments(normalizeEmbedHtml(rawContent))
  );

  useEffect(() => {
    const normalized =
      typeof document !== 'undefined' ? normalizeArticleContent(rawContent) : rawContent;
    const withEmbed = normalizeEmbedHtml(normalized);
    setContent(withEmbed);
    setSegments(parseEmbedSegments(withEmbed));
  }, [rawContent]);

  const renderSegment = (seg: EmbedSegment, i: number) => {
    if (seg.type === 'embed') {
      const safeSrc = isEmbedSrcInvalid(seg.src) ? '' : seg.src;
      const embedUrl = isInstagramSrc(seg.src) ? getInstagramEmbedUrl(seg.src) : safeSrc;
      if (!embedUrl || embedUrl === 'about:blank') return null;
      const isInstagram = isInstagramSrc(seg.src);
      const align = (seg.type === 'embed' && (seg.align === 'left' || seg.align === 'right')) ? seg.align : 'center';
      return (
        <div key={i} className={`${styles.embedBlock} ${styles[`embedBlock${align === 'left' ? 'Left' : align === 'right' ? 'Right' : 'Center'}`]}`}>
          <div className={isInstagram ? `${styles.embedVideoWrap} ${styles.embedVideoWrapInstagram}` : styles.embedVideoWrap}>
            <iframe
              src={embedUrl}
              className={styles.embedIframe}
              title="Instagram"
              allow="encrypted-media"
            />
          </div>
        </div>
      );
    }
    return (
      <div key={i} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: seg.content }} />
    );
  };

  const renderContent = () => {
    if (segments != null && segments.length > 0) {
      return <div className={styles.content}>{segments.map(renderSegment)}</div>;
    }
    return (
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: normalizeEmbedHtml(content) }}
      />
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
