import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import ArticleContent from '@/components/ArticleContent';
import ReadAlso from '@/components/ReadAlso';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';

// Рендер по запросу, чтобы сборка не требовала БД (таблицы создаются после деплоя через prisma db push)
export const dynamic = 'force-dynamic';

const READ_ALSO_LIMIT = 4;

export default async function ArticlePage({
  params,
}: {
  params: { city: string; slug: string };
}) {
  const { city, slug } = params;
  if (!CITIES.includes(city as City)) notFound();

  const now = new Date();
  const article = await prisma.article.findFirst({
    where: {
      slug,
      published: true,
      deletedAt: null,
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
    },
  });

  if (!article) notFound();

  const articleCities = article.cityIds ? (JSON.parse(article.cityIds) as string[]) : [article.city];
  if (!articleCities.includes(city)) notFound();

  const relatedArticles = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      city,
      published: true,
      deletedAt: null,
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
    },
    orderBy: { createdAt: 'desc' },
    take: READ_ALSO_LIMIT,
    select: {
      id: true,
      slug: true,
      titleRu: true,
      titleEn: true,
      excerptRu: true,
      excerptEn: true,
      imageUrl: true,
    },
  });

  return (
    <div className="article-page">
      <ArticleContent article={article} />
      <ReadAlso city={city as City} articles={relatedArticles} />
      <SocialLinks city={city as City} />
    </div>
  );
}
