'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';
import SocialLinks from '@/components/SocialLinks';
import type { City } from '@/lib/constants';
import styles from './preview.module.css';

interface Article {
  city: string;
  titleRu: string;
  titleEn: string;
  excerptRu?: string | null;
  excerptEn?: string | null;
  contentRu: string;
  contentEn: string;
  imageUrl: string | null;
}

export default function AdminPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => {
        if (r.status === 401) {
          router.replace('/admin/login');
          return null;
        }
        if (!r.ok) return r.json().then((d) => { throw new Error(d.error || 'Ошибка'); });
        return r.json();
      })
      .then((data) => data && setArticle(data))
      .catch((e) => setError(e.message || 'Не удалось загрузить статью'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.message}>Загрузка...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>{error || 'Статья не найдена'}</p>
        <Link href={`/admin/articles/${id}`} className={styles.back}>
          ← Вернуться к редактированию
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.previewFrame}>
      <div className={styles.bar}>
        <span className={styles.barLabel}>Предпросмотр на сайте</span>
        <Link href={`/admin/articles/${id}`} className={styles.back}>
          ← К редактированию
        </Link>
      </div>
      <div className={styles.siteWrap}>
        <Header preview />
        <main className={styles.main}>
          <ArticleContent article={article} />
          <SocialLinks city={(article.city || 'tbilisi') as City} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
