'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface ArticleUser {
  id: string;
  email: string;
  name: string | null;
}

interface Article {
  id: string;
  slug: string;
  city: string;
  category: string;
  cityIds?: string | null;
  categoryIds?: string | null;
  titleRu: string;
  titleEn: string;
  published: boolean;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  createdBy: ArticleUser | null;
  updatedBy: ArticleUser | null;
}

const CITY_LABELS: Record<string, string> = {
  tbilisi: 'Тбилиси',
  batumi: 'Батуми',
  dubai: 'Дубай',
};

const CATEGORY_LABELS: Record<string, string> = {
  interesting: 'Это интересно',
  useful: 'Полезное',
  places: 'Места',
  excursions: 'Экскурсии',
  food: 'Еда',
  shopping: 'Шопинг',
  events: 'Мероприятия',
  all: 'Все материалы',
};

function parseIds(ids: string | null | undefined, fallback: string): string[] {
  if (!ids) return [fallback];
  try {
    const arr = JSON.parse(ids) as unknown;
    return Array.isArray(arr) && arr.every((x) => typeof x === 'string') ? arr : [fallback];
  } catch {
    return [fallback];
  }
}

function formatCities(article: Article): string {
  const ids = parseIds(article.cityIds, article.city);
  return ids.map((id) => CITY_LABELS[id] || id).join(', ');
}

function formatCategories(article: Article): string {
  const ids = parseIds(article.categoryIds, article.category).filter((c) => c !== 'all');
  return ids.length ? ids.map((id) => CATEGORY_LABELS[id] || id).join(', ') : (CATEGORY_LABELS[article.category] || article.category);
}

function formatDateTime(s: string) {
  return new Date(s).toLocaleString('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function userLabel(u: ArticleUser | null): string {
  if (!u) return '—';
  return u.name?.trim() ? `${u.name} (${u.email})` : u.email;
}

type Tab = 'active' | 'deleted';

export default function AdminPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsArticle, setDetailsArticle] = useState<Article | null>(null);
  const [tab, setTab] = useState<Tab>('active');

  useEffect(() => {
    const url = tab === 'deleted' ? '/api/admin/articles?deleted=1' : '/api/admin/articles';
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (r.status === 401) {
          router.replace('/admin/login');
          return { articles: [] };
        }
        if (r.status === 403) return { articles: [] };
        return r.json();
      })
      .then((data) => setArticles(data.articles || []))
      .finally(() => setLoading(false));
  }, [router, tab]);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить статью? Она попадёт в раздел «Удалённые» и её сможет восстановить только главный администратор.')) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setArticles((a) => a.filter((x) => x.id !== id));
      if (detailsArticle?.id === id) setDetailsArticle(null);
    }
  };

  const handleRestore = async (id: string) => {
    const res = await fetch(`/api/admin/articles/${id}/restore`, { method: 'POST' });
    if (res.ok) {
      setArticles((a) => a.filter((x) => x.id !== id));
      if (detailsArticle?.id === id) setDetailsArticle(null);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Ошибка восстановления');
    }
  };

  if (loading && articles.length === 0) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.tabsRow}>
        <h1 className={styles.tabsTitle}>Статьи</h1>
        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === 'active' ? styles.tabActive : styles.tab}
            onClick={() => setTab('active')}
          >
            Активные
          </button>
          <button
            type="button"
            className={tab === 'deleted' ? styles.tabActive : styles.tab}
            onClick={() => setTab('deleted')}
          >
            Удалённые
          </button>
        </div>
      </div>
      {tab === 'active' && (
        <Link href="/admin/articles/new" className={styles.newBtn}>
          + Новая статья
        </Link>
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Город</th>
            <th>Рубрика</th>
            {tab === 'active' && <th>Статус</th>}
            <th>{tab === 'deleted' ? 'Удалено' : 'Дата'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.titleRu}</td>
              <td className={styles.cellMulti}>{formatCities(a)}</td>
              <td className={styles.cellMulti}>{formatCategories(a)}</td>
              {tab === 'active' && (
                <td>
                  {a.scheduledAt && new Date(a.scheduledAt) > new Date()
                    ? `Будет опубликовано ${new Date(a.scheduledAt).toLocaleString('ru', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                    : a.published
                      ? 'Опубликовано'
                      : 'Черновик'}
                </td>
              )}
              <td>
                {tab === 'deleted' && a.deletedAt
                  ? formatDateTime(a.deletedAt)
                  : new Date(a.createdAt).toLocaleDateString('ru')}
              </td>
              <td>
                <button
                  type="button"
                  className={styles.detailsBtn}
                  onClick={() => setDetailsArticle(a)}
                >
                  Детали
                </button>
                {tab === 'active' ? (
                  <>
                    <Link href={`/admin/articles/${a.id}`} className={styles.edit}>
                      Редактировать
                    </Link>
                    <button
                      className={styles.delete}
                      onClick={() => handleDelete(a.id)}
                    >
                      Удалить
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className={styles.restoreBtn}
                    onClick={() => handleRestore(a.id)}
                  >
                    Восстановить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {articles.length === 0 && (
        <p className={styles.empty}>
          {tab === 'deleted' ? 'Нет удалённых статей' : 'Нет статей'}
        </p>
      )}

      {detailsArticle && (
        <div className={styles.modalOverlay} onClick={() => setDetailsArticle(null)} aria-hidden="true">
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h2>Детали статьи</h2>
              <button type="button" className={styles.modalClose} onClick={() => setDetailsArticle(null)} aria-label="Закрыть">
                ×
              </button>
            </div>
            <p className={styles.modalTitle}>{detailsArticle.titleRu}</p>
            <dl className={styles.detailsList}>
              {detailsArticle.deletedAt && (
                <>
                  <dt>Удалено</dt>
                  <dd>{formatDateTime(detailsArticle.deletedAt)}</dd>
                </>
              )}
              <dt>Создано</dt>
              <dd>{formatDateTime(detailsArticle.createdAt)}</dd>
              <dt>Кем создано</dt>
              <dd>{userLabel(detailsArticle.createdBy)}</dd>
              <dt>Последнее изменение</dt>
              <dd>{formatDateTime(detailsArticle.updatedAt)}</dd>
              <dt>Кем изменено</dt>
              <dd>{userLabel(detailsArticle.updatedBy)}</dd>
            </dl>
            <div className={styles.modalActions}>
              {!detailsArticle.deletedAt && (
                <Link href={`/admin/articles/${detailsArticle.id}`} className={styles.newBtn}>
                  Редактировать статью
                </Link>
              )}
              {detailsArticle.deletedAt && (
                <button
                  type="button"
                  className={styles.newBtn}
                  onClick={() => {
                    handleRestore(detailsArticle.id);
                    setDetailsArticle(null);
                  }}
                >
                  Восстановить
                </button>
              )}
              <button type="button" className={styles.modalCancel} onClick={() => setDetailsArticle(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
