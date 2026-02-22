'use client';

import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/ArticleForm';

export default function NewArticlePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin');
    router.refresh();
  };

  return (
    <div>
      <h1>Новая статья</h1>
      <ArticleForm onSuccess={handleSuccess} />
    </div>
  );
}
