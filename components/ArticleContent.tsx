'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { removeDuplicateCaptionParagraphs } from '@/lib/sanitizeArticleHtml';
import Image from 'next/image';
import styles from './ArticleContent.module.css';

interface Article {
  titleRu: string;
  titleEn: string;
  excerptRu?: string | null;
  excerptEn?: string | null;
  contentRu: string;
  contentEn: string;
  imageUrl: string | null;
}

function normalizeArticleContent(html: string): string {
  if (typeof document === 'undefined') return html;
  let out = removeDuplicateCaptionParagraphs(html);
  const div = document.createElement('div');
  div.innerHTML = out;

  const toArray = (list: NodeListOf<Element>) => Array.from(list);

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
  const { locale } = useLanguage();
  const title = locale === 'ru' ? article.titleRu : article.titleEn;
  const excerpt = locale === 'ru' ? article.excerptRu : article.excerptEn;
  const rawContent = locale === 'ru' ? article.contentRu : article.contentEn;
  const [content, setContent] = useState(rawContent);

  useEffect(() => {
    setContent(normalizeArticleContent(rawContent));
  }, [rawContent]);

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
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
