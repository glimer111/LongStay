'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

const NO_RESULT_IMAGES = ['/images/NF1.png', '/images/NF2.png', '/images/NF3.png'];

interface Article {
  id: string;
  slug: string;
  city: string;
  titleRu: string;
  titleEn: string | null;
  excerptRu: string | null;
  excerptEn: string | null;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(q);

  useEffect(() => {
    setInputValue(q);
    if (!q) {
      setArticles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/articles?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setArticles(data.articles || []))
      .finally(() => setLoading(false));
  }, [q]);

  const getTitle = (a: Article) => (locale === 'ru' ? a.titleRu : (a.titleEn || a.titleRu));
  const getExcerpt = (a: Article) => (locale === 'ru' ? a.excerptRu : (a.excerptEn || a.excerptRu)) || '';

  const pushQuery = (nextQ: string) => {
    const trimmed = nextQ.trim();
    if (!trimmed) {
      router.push('/search');
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const highlightText = (text: string) => {
    if (!q) return [text];
    try {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
      const parts = text.split(re);
      return parts.map((part, i) => {
        const isMatch = part.toLowerCase() === q.toLowerCase();
        return isMatch ? (
          <span key={i} className={styles.highlight}>{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      });
    } catch {
      return [text];
    }
  };

  const noResults = !loading && q && articles.length === 0;
  const noResultImage = useMemo(
    () => (noResults ? NO_RESULT_IMAGES[Math.floor(Math.random() * NO_RESULT_IMAGES.length)] : null),
    [noResults]
  );

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <div className={styles.searchPill}>
          <span className={styles.searchIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            className={styles.searchInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') pushQuery(inputValue);
              if (e.key === 'Escape') pushQuery('');
            }}
            placeholder={t.search.placeholder}
          />
          <button
            type="button"
            className={styles.closeIcon}
            aria-label="Clear"
            onClick={() => pushQuery('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {q && (
        <h1 className={styles.title}>
          {t.search.resultsFor} <strong>«{q}»</strong>
          {!loading && !noResults ? `, ${t.search.found} ${articles.length}` : ''}
        </h1>
      )}

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : !q ? (
        <p className={styles.loading}>Введите поисковый запрос в поле поиска</p>
      ) : noResults ? (
        <div className={styles.noResults}>
          <div className={styles.emptyBox}>
            {noResultImage && (
              <div className={styles.emptyCat} aria-hidden="true">
                <Image src={noResultImage} alt="" width={213} height={218} className={styles.emptyCatImg} unoptimized />
              </div>
            )}
            <p>{t.search.noResults}</p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${article.city}/${article.slug}`}
                className={styles.card}
              >
                <div className={styles.thumb} aria-hidden="true">
                  <img
                    alt=""
                    src={`data:image/svg+xml,${encodeURIComponent(
                      `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>
                        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                          <stop offset='0' stop-color='#e9e9e9'/>
                          <stop offset='1' stop-color='#d3d3d3'/>
                        </linearGradient></defs>
                        <rect width='100%' height='100%' fill='url(#g)'/>
                      </svg>`
                    )}`}
                  />
                </div>
                <div>
                  <h3>{highlightText(getTitle(article))}</h3>
                  {getExcerpt(article) && (
                    <p>{highlightText(getExcerpt(article))}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.moreBtn} disabled>
              {t.articles.loadMore}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
      <SearchContent />
    </Suspense>
  );
}
