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
}

interface ReadAlsoProps {
  city: City;
  articles: ReadAlsoArticle[];
}

const PLACEHOLDER_IMAGE = '/images/placeholder-article.jpg';

export default function ReadAlso({ city, articles }: ReadAlsoProps) {
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
          const href = `/${city}/${a.slug}`;
          return (
            <Link key={a.id} href={href} className={styles.card}>
              <div className={styles.imageWrap}>
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt="" className={styles.image} />
                ) : (
                  <div className={styles.imagePlaceholder} />
                )}
              </div>
              <div className={styles.cardContent}>
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
