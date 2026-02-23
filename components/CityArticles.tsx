'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { EXCURSIONS_LINKS, type City } from '@/lib/constants';
import styles from './CityArticles.module.css';

interface Article {
  id: string;
  slug: string;
  city: string;
  category: string;
  titleRu: string;
  titleEn: string | null;
  excerptRu: string | null;
  excerptEn: string | null;
  imageUrl: string | null;
}

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 6;

const CITY_NAMES: Record<City, string> = {
  tbilisi: 'ТБИЛИСИ',
  batumi: 'БАТУМИ',
  dubai: 'ДУБАЕ',
};

export default function CityArticles({ city }: { city: City }) {
  const { locale, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ slug: string; nameRu: string; nameEn: string; externalUrl: string | null }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/articles?city=${city}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
      })
      .finally(() => setLoading(false));
  }, [city]);

  useEffect(() => {
    fetch(`/api/categories?city=${city}`)
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
      });
  }, [city]);

  const articleHasCategory = (a: Article, slug: string) => {
    if (a.category === slug) return true;
    const ids = (a as Article & { categoryIds?: string | null }).categoryIds;
    if (!ids) return false;
    try {
      return (JSON.parse(ids) as string[]).includes(slug);
    } catch {
      return false;
    }
  };

  const filteredArticles = activeCategory && activeCategory !== 'all'
    ? articles.filter((a) => articleHasCategory(a, activeCategory))
    : articles;

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayedArticles.length < filteredArticles.length;

  const getTitle = (a: Article) => (locale === 'ru' ? a.titleRu : (a.titleEn || a.titleRu));
  const getExcerpt = (a: Article) => (locale === 'ru' ? a.excerptRu : (a.excerptEn || a.excerptRu)) || '';

  const handleCategoryClick = (slug: string, externalUrl: string | null) => {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    } else {
      setActiveCategory(activeCategory === slug ? null : slug);
      setDisplayCount(INITIAL_COUNT);
    }
  };

  const cityName = locale === 'ru' ? CITY_NAMES[city] : city.toUpperCase();

  return (
    <div className={styles.container}>
      <div className={styles.titleBlockWrap}>
        <div className={styles.titleBlock}>
          <span className={styles.youIn}>{t.city.youIn}{'\u00A0'}</span>
          <span className={styles.cityName}>{cityName}</span>
          <h2 className={styles.subheading}>{t.city.materials}</h2>
        </div>
      </div>

      <div className={styles.categories}>
        {categories.map((cat) => {
          const url = cat.slug === 'excursions' ? EXCURSIONS_LINKS[city] : cat.externalUrl;
          const isActive = !url && activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              className={`${styles.category} ${isActive ? styles.categoryActive : ''}`}
              onClick={() => handleCategoryClick(cat.slug, url || null)}
            >
              {locale === 'ru' ? cat.nameRu : cat.nameEn}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <>
          <div className={styles.grid}>
            {displayedArticles.map((article, index) => {
              const primaryCategory = article.category;
              const cat = categories.find((c) => c.slug === primaryCategory);
              const catName = cat ? (locale === 'ru' ? cat.nameRu : cat.nameEn) : primaryCategory;
              return (
                <Link
                  key={article.id}
                  href={`/${city}/${article.slug}`}
                  className={styles.card}
                >
                  {article.imageUrl && (
                    <div className={styles.image}>
                      <img src={article.imageUrl} alt="" />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <span className={styles.cardCategory}>{catName}</span>
                    <h3 className={styles.title}>{getTitle(article)}</h3>
                    {getExcerpt(article) && (
                      <p className={styles.excerpt}>{getExcerpt(article)}</p>
                    )}
                    <span className={styles.read}>{t.city.read}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <div className={styles.loadMore}>
              <button
                className={styles.loadMoreBtn}
                onClick={() => setDisplayCount((c) => c + LOAD_MORE_COUNT)}
              >
                {t.articles.loadMore}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
