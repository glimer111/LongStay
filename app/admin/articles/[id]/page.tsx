'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ArticleForm from '@/components/ArticleForm';
import styles from './edit.module.css';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`)
      .then((r) => {
        if (r.status === 401) router.replace('/admin/login');
        if (r.status === 404) return null;
        return r.json();
      })
      .then((data) => setArticle(data))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSuccess = () => {
    router.refresh();
  };

  if (loading) return <p>Загрузка...</p>;
  if (!article) return <p>Статья не найдена</p>;

  return (
    <div>
      <div className={styles.top}>
        <h1>Редактировать статью</h1>
        <Link href={`/admin/preview/${id}`} className={styles.previewBtn}>
          Предпросмотр на сайте
        </Link>
      </div>
      <ArticleForm article={article} onSuccess={handleSuccess} />
    </div>
  );
}
