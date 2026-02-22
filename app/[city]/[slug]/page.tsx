import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import ArticleContent from '@/components/ArticleContent';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';

export async function generateStaticParams() {
  const now = new Date();
  const articles = await prisma.article.findMany({
    where: {
      published: true,
      deletedAt: null,
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
    },
    select: { slug: true, city: true, cityIds: true },
  });
  const pairs: { city: string; slug: string }[] = [];
  for (const a of articles) {
    const cities = a.cityIds ? (JSON.parse(a.cityIds) as string[]) : [a.city];
    for (const c of cities) {
      pairs.push({ city: c, slug: a.slug });
    }
  }
  return pairs;
}

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
