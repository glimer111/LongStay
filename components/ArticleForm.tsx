'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CITIES } from '@/lib/constants';
import { removeDuplicateCaptionParagraphs } from '@/lib/sanitizeArticleHtml';
import RichTextEditor from './RichTextEditor';
import styles from './ArticleForm.module.css';

const CATEGORY_OPTIONS = [
  { value: 'interesting', labelRu: 'Это интересно' },
  { value: 'useful', labelRu: 'Полезное' },
  { value: 'places', labelRu: 'Места' },
  { value: 'excursions', labelRu: 'Экскурсии' },
  { value: 'food', labelRu: 'Еда' },
  { value: 'shopping', labelRu: 'Шопинг' },
  { value: 'events', labelRu: 'Мероприятия' },
];

interface ArticleFormProps {
  article?: Record<string, unknown>;
  onSuccess: () => void;
}

export default function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const isEdit = !!article;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const parseArray = (v: unknown): string[] => {
    if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return v;
    if (typeof v === 'string') try { return JSON.parse(v); } catch { return v ? [v] : []; }
    return [];
  };

  const toDatetimeLocal = (val: string | Date | null | undefined): string => {
    if (val == null) return '';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}`;
  };

  const [form, setForm] = useState({
    slug: (article?.slug as string) || '',
    cities: parseArray(article?.cities ?? article?.cityIds ?? article?.city).length ? parseArray(article?.cities ?? article?.cityIds ?? article?.city) : ['tbilisi'],
    categories: (() => {
      const arr = parseArray(article?.categories ?? article?.categoryIds ?? article?.category).filter((c) => c !== 'all');
      return arr.length ? arr : ['interesting'];
    })(),
    titleRu: (article?.titleRu as string) || '',
    titleEn: (article?.titleEn as string) || '',
    excerptRu: (article?.excerptRu as string) || '',
    excerptEn: (article?.excerptEn as string) || '',
    contentRu: (article?.contentRu as string) || '',
    contentEn: (article?.contentEn as string) || '',
    imageUrl: (article?.imageUrl as string) || '',
    published: (article?.published as boolean) ?? true,
    scheduledAt: toDatetimeLocal(article?.scheduledAt as string | Date | null | undefined),
  });

  useEffect(() => {
    if (!article?.contentRu) return;
    const cleanRu = removeDuplicateCaptionParagraphs(article.contentRu as string);
    const cleanEn = removeDuplicateCaptionParagraphs((article.contentEn as string) || '');
    setForm((f) => ({ ...f, contentRu: cleanRu, contentEn: cleanEn }));
  }, [article?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleCity = (city: string) => {
    setForm((f) => ({
      ...f,
      cities: f.cities.includes(city) ? f.cities.filter((c) => c !== city) : [...f.cities, city],
    }));
  };

  const toggleCategory = (category: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(category) ? f.categories.filter((c) => c !== category) : [...f.categories, category],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    e.target.value = '';
    setImageUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        if (!res.ok) throw new Error(text.slice(0, 200) || `Ошибка ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error || text || `Ошибка ${res.status}`);
      setForm((f) => ({ ...f, imageUrl: data.url ?? f.imageUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображения');
    } finally {
      setImageUploading(false);
    }
  };

  const handleContentChange = (name: 'contentRu' | 'contentEn') => (html: string) => {
    setForm((f) => ({ ...f, [name]: html }));
  };

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!stripHtml(form.contentRu)) {
      setError('Контент RU обязателен');
      return;
    }
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/articles/${article.id}` : '/api/admin/articles';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cities: form.cities.length ? form.cities : ['tbilisi'],
          categories: form.categories.filter((c) => c !== 'all').length
            ? form.categories.filter((c) => c !== 'all')
            : ['interesting'],
          published: form.published,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка');
        return;
      }
      onSuccess();
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.row}>
        <label>Slug (URL)</label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          required
          placeholder="my-article"
        />
      </div>
      <div className={styles.row}>
        <label>Города</label>
        <div className={styles.checkboxGroup}>
          {CITIES.map((c) => (
            <label key={c} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.cities.includes(c)}
                onChange={() => toggleCity(c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <label>Рубрики</label>
        <div className={styles.checkboxGroup}>
          {CATEGORY_OPTIONS.map((opt) => (
            <label key={opt.value} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.categories.includes(opt.value)}
                onChange={() => toggleCategory(opt.value)}
              />
              {opt.labelRu}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <label>Заголовок RU</label>
        <input
          name="titleRu"
          value={form.titleRu}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.row}>
        <label>Заголовок EN (необязательно)</label>
        <input
          name="titleEn"
          value={form.titleEn}
          onChange={handleChange}
          placeholder="Оставьте пустым, если статья только на русском"
        />
      </div>
      <div className={styles.row}>
        <label>Краткое описание RU</label>
        <textarea
          name="excerptRu"
          value={form.excerptRu}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div className={styles.row}>
        <label>Краткое описание EN</label>
        <textarea
          name="excerptEn"
          value={form.excerptEn}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div className={styles.row}>
        <label>Контент RU</label>
        <RichTextEditor
          value={form.contentRu}
          onChange={handleContentChange('contentRu')}
        />
      </div>
      <div className={styles.row}>
        <label>Контент EN (необязательно)</label>
        <RichTextEditor
          value={form.contentEn}
          onChange={handleContentChange('contentEn')}
        />
      </div>
      <div className={styles.row}>
        <label>Изображение статьи</label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          type="url"
          placeholder="URL или загрузите файл"
          className={styles.imageUrlInput}
        />
        <div className={styles.uploadRow}>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageUpload}
            className={styles.hiddenInput}
            aria-hidden
          />
          <button
            type="button"
            className={styles.uploadBtn}
            disabled={imageUploading}
            onClick={() => imageInputRef.current?.click()}
          >
            {imageUploading ? 'Загрузка...' : 'Загрузить с компьютера'}
          </button>
        </div>
      </div>
      <div className={styles.row}>
        <label>
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />
          {' '}Опубликовано
        </label>
      </div>
      <div className={styles.row}>
        <label>Опубликовать в дату и время (оставьте пустым для немедленной публикации)</label>
        <input
          type="datetime-local"
          name="scheduledAt"
          value={form.scheduledAt}
          onChange={handleChange}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать статью'}
      </button>
    </form>
  );
}
