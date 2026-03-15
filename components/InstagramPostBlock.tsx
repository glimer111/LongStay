'use client';

import { useState, useEffect } from 'react';
import type { InstagramOembed } from '@/app/api/instagram-oembed/route';
import styles from './ArticleContent.module.css';

function getPostIdFromSrc(src: string): string | null {
  const m = String(src || '').match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
}

/** Всегда возвращает абсолютный URL поста — иначе на основном сайте ссылка может не срабатывать. */
function getPostUrl(embedSrc: string): string {
  const postId = getPostIdFromSrc(embedSrc);
  if (postId) return `https://www.instagram.com/p/${postId}/`;
  const u = String(embedSrc || '').replace(/\/embed\/?(\?.*)?$/i, '').split('?')[0].trim();
  if (u.startsWith('//')) return 'https:' + u;
  if (/^https?:\/\//i.test(u)) return u;
  return 'https://www.instagram.com/';
}

export default function InstagramPostBlock({ embedSrc }: { embedSrc: string }) {
  const postUrl = getPostUrl(embedSrc);
  const postId = getPostIdFromSrc(embedSrc);
  const [data, setData] = useState<InstagramOembed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`/api/instagram-oembed?id=${encodeURIComponent(postId)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [postId]);

  const hasPreview = !loading && data?.thumbnail_url;
  const showPlaceholder = !loading && !data?.thumbnail_url;

  const cardContent = (
    <>
      <span className={styles.instagramCardLabel}>Instagram</span>
      {loading ? (
        <div className={styles.instagramCardPlaceholder}>
          <span className={styles.instagramCardPlaceholderText}>Загрузка…</span>
        </div>
      ) : hasPreview ? (
        <span className={styles.instagramCardImageWrap}>
          <img
            src={data!.thumbnail_url!}
            alt={data!.title || 'Пост в Instagram'}
            className={styles.instagramCardImage}
          />
        </span>
      ) : showPlaceholder ? (
        <div className={styles.instagramCardPlaceholder} aria-hidden>
          <svg className={styles.instagramCardPlaceholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" r="1.5" fill="currentColor" />
          </svg>
          <span className={styles.instagramCardPlaceholderText}>Просмотреть пост</span>
        </div>
      ) : null}
      {!loading && data?.title && <p className={styles.instagramCardTitle}>{data.title}</p>}
      {!loading && data?.author_name && <p className={styles.instagramCardAuthor}>@{data.author_name}</p>}
      <span className={styles.instagramCardLink}>Открыть в Instagram</span>
    </>
  );

  return (
    <a
      href={postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.instagramCard}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      {cardContent}
    </a>
  );
}
