'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import type { City } from '@/lib/constants';
import styles from './ReadAlso.module.css';

export interface ReadAlsoArticle {
  id: string;
  slug: string;
  titleRu: string;
  titleEn: string | null;
  excerptRu: string | null;
  excerptEn: string | null;
  imageUrl: string | null;
  category: string;
  categoryIds: string | null;
}

export interface ReadAlsoCategory {
  slug: string;
  nameRu: string;
  nameEn: string;
}

interface ReadAlsoProps {
  city: City;
  articles: ReadAlsoArticle[];
  categories: ReadAlsoCategory[];
}

function getArticleCategoryNames(
  a: ReadAlsoArticle,
  categories: ReadAlsoCategory[],
  locale: string
): string[] {
  const slugs: string[] = [a.category];
  if (a.categoryIds) {
    try {
      const ids = JSON.parse(a.categoryIds) as string[];
      slugs.push(...ids.filter((s) => s && s !== 'all'));
    } catch {
      /* ignore */
    }
  }
  const unique = Array.from(new Set(slugs));
  return unique.map((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat ? (locale === 'ru' ? cat.nameRu : cat.nameEn) : slug;
  });
}

export default function ReadAlso({ city, articles, categories }: ReadAlsoProps) {
  const { locale, t } = useLanguage();

  if (!articles.length) return null;

  return (
    <section className={styles.section} aria-labelledby="read-also-heading">
      <h2 id="read-also-heading" className={styles.heading}>
        {t.article.readAlso}
      </h2>
      <div className={styles.grid}>
        {articles.map((a) => {
          const title = locale === 'ru' ? a.titleRu : (a.titleEn || a.titleRu);
          const excerpt = locale === 'ru' ? (a.excerptRu || '') : (a.excerptEn || a.excerptRu || '');
          const categoryNames = getArticleCategoryNames(a, categories, locale);
          const useHashtags = categoryNames.length > 3;
          const href = `/${city}/${a.slug}`;
          return (
            <Link key={a.id} href={href} className={styles.card}>
              {a.imageUrl && (
                <div className={styles.image}>
                  <img src={a.imageUrl} alt="" />
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
                <h3 className={styles.title}>{title}</h3>
                {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
                <span className={styles.read}>{t.city.read}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
