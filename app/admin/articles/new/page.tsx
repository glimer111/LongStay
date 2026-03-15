'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ArticleForm from '@/components/ArticleForm';
import styles from '../[id]/edit.module.css';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSuccess = (data?: { id: string }) => {
    if (data?.id) {
      router.push(`/admin/articles/${data.id}`);
    } else {
      router.push('/admin');
    }
    router.refresh();
  };

  return (
    <div>
      <div className={styles.top}>
        <h1>Новая статья</h1>
        <span className={`${styles.previewBtn} ${styles.previewBtnDisabled}`} aria-disabled="true">
          Предпросмотр на сайте
        </span>
      </div>
      <ArticleForm onSuccess={handleSuccess} />
    </div>
  );
}
