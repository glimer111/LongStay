'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { USEFUL_CARDS, type City } from '@/lib/constants';
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
  /** Выбранные рубрики (пустой Set = «Все материалы»). */
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
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

  const articlesForLocale =
    locale === 'en'
      ? articles.filter((a) => a.titleEn != null && String(a.titleEn).trim() !== '')
      : articles;

  const filterSlugs = categories
    .filter((c) => c.slug !== 'excursions' && c.slug !== 'all')
    .map((c) => c.slug);
  const allSelected = filterSlugs.length > 0 && filterSlugs.every((s) => selectedCategories.has(s));
  const showAllMaterials = selectedCategories.size === 0 || allSelected;

  const filteredArticles = showAllMaterials
    ? articlesForLocale
    : articlesForLocale.filter((a) =>
        [...selectedCategories].some((slug) => articleHasCategory(a, slug))
      );

  const displayedArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayedArticles.length < filteredArticles.length;

  const getTitle = (a: Article) => (locale === 'ru' ? a.titleRu : (a.titleEn || a.titleRu));
  const getExcerpt = (a: Article) => (locale === 'ru' ? a.excerptRu : (a.excerptEn || a.excerptRu)) || '';

  const getArticleCategorySlugs = (a: Article): string[] => {
    const primary = a.category;
    const ids = (a as Article & { categoryIds?: string | null }).categoryIds;
    let slugs: string[] = [primary];
    if (ids) {
      try {
        const arr = JSON.parse(ids) as string[];
        slugs = [...new Set([primary, ...arr].filter((s) => s && s !== 'all'))];
      } catch {
        /* keep primary only */
      }
    }
    return slugs;
  };

  const getArticleCategoryNames = (a: Article): string[] => {
    const slugs = getArticleCategorySlugs(a);
    return slugs.map((slug) => {
      const cat = categories.find((c) => c.slug === slug);
      return cat ? (locale === 'ru' ? cat.nameRu : cat.nameEn) : slug;
    });
  };

  const handleAllMaterialsClick = () => {
    setSelectedCategories(showAllMaterials ? new Set() : new Set(filterSlugs));
    setDisplayCount(INITIAL_COUNT);
  };

  const handleCategoryClick = (slug: string, externalUrl: string | null) => {
    if (externalUrl && slug !== 'useful') {
      window.open(externalUrl, '_blank');
      return;
    }
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setDisplayCount(INITIAL_COUNT);
  };

  const cityName = locale === 'ru' ? CITY_NAMES[city] : city.toUpperCase();

  const categoriesWithoutAllAndExcursions = categories.filter(
    (c) => c.slug !== 'excursions' && c.slug !== 'all'
  );
  const onlyUseful = selectedCategories.size === 1 && selectedCategories.has('useful');

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
        <button
          type="button"
          className={`${styles.category} ${showAllMaterials ? styles.categoryActive : ''}`}
          onClick={handleAllMaterialsClick}
        >
          {locale === 'ru' ? 'Все материалы' : 'All materials'}
        </button>
        {categoriesWithoutAllAndExcursions.map((cat) => {
          const isActive = selectedCategories.has(cat.slug);
          return (
            <button
              key={cat.slug}
              type="button"
              className={`${styles.category} ${isActive ? styles.categoryActive : ''}`}
              onClick={() => handleCategoryClick(cat.slug, cat.slug === 'useful' ? null : (cat.externalUrl || null))}
            >
              {locale === 'ru' ? cat.nameRu : cat.nameEn}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : onlyUseful ? (
        <div className={styles.grid}>
          {USEFUL_CARDS[city].map((card, index) => (
            <a
              key={index}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              {card.imageUrl && (
                <div className={styles.image}>
                  <img src={card.imageUrl} alt="" />
                </div>
              )}
              <div className={styles.cardContent}>
                <div className={styles.cardCategoryWrap}>
                  <span className={styles.cardCategoryTag}>
                    {locale === 'ru' ? 'Полезное' : 'Useful'}
                  </span>
                </div>
                <h3 className={styles.title}>
                  {locale === 'ru' ? card.titleRu : card.titleEn}
                </h3>
                <p className={styles.excerpt}>
                  {locale === 'ru' ? card.excerptRu : card.excerptEn}
                </p>
                <span className={styles.read}>{t.city.read}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {displayedArticles.map((article) => {
              const categoryNames = getArticleCategoryNames(article);
              const useHashtags = categoryNames.length > 3;
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
                    <div className={styles.cardCategoryWrap}>
                      {categoryNames.map((name) => (
                        <span key={name} className={styles.cardCategoryTag}>
                          {useHashtags ? `#${name.replace(/\s+/g, '_')}` : name}
                        </span>
                      ))}
                    </div>
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
