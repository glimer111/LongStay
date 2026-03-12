import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import ArticleContent from '@/components/ArticleContent';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';

// Рендер по запросу, чтобы сборка не требовала БД (таблицы создаются после деплоя через prisma db push)
export const dynamic = 'force-dynamic';

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

  return (
    <div className="article-page">
      <ArticleContent article={article} />
      <SocialLinks city={city as City} />
    </div>
  );
}
