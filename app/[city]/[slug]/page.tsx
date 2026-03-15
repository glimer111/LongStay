import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import { normalizeEmbedHtml } from '@/lib/embed';
import ArticleContent from '@/components/ArticleContent';
import ReadAlso from '@/components/ReadAlso';
import SocialLinks from '@/components/SocialLinks';
import { prisma } from '@/lib/prisma';

// Рендер по запросу, чтобы сборка не требовала БД (таблицы создаются после деплоя через prisma db push)
export const dynamic = 'force-dynamic';

const READ_ALSO_LIMIT = 3;

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

  // Категории текущей статьи для рекомендаций
  const currentCategories = new Set<string>([article.category]);
  if (article.categoryIds) {
    try {
      (JSON.parse(article.categoryIds) as string[]).forEach((c) => currentCategories.add(c));
    } catch {
      /* ignore */
    }
  }

  const candidates = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      city,
      published: true,
      deletedAt: null,
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
    },
    orderBy: { createdAt: 'desc' },
    take: 24,
    select: {
      id: true,
      slug: true,
      titleRu: true,
      titleEn: true,
      excerptRu: true,
      excerptEn: true,
      imageUrl: true,
      category: true,
      categoryIds: true,
      createdAt: true,
    },
  });

  const score = (a: { category: string; categoryIds: string | null }) => {
    let match = currentCategories.has(a.category) ? 2 : 0;
    if (a.categoryIds) {
      try {
        const ids = JSON.parse(a.categoryIds) as string[];
        match += ids.filter((c) => currentCategories.has(c)).length;
      } catch {
        /* ignore */
      }
    }
    return match;
  };

  const categories = await prisma.category.findMany({
    where: { city },
    select: { slug: true, nameRu: true, nameEn: true },
  });

  const relatedArticles = candidates
    .sort((a, b) => {
      const sa = score(a);
      const sb = score(b);
      if (sb !== sa) return sb - sa;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, READ_ALSO_LIMIT)
    .map(({ id, slug, titleRu, titleEn, excerptRu, excerptEn, imageUrl, category, categoryIds }) => ({
      id,
      slug,
      titleRu,
      titleEn,
      excerptRu,
      excerptEn,
      imageUrl,
      category,
      categoryIds,
    }));

  const articleWithCleanEmbed = {
    ...article,
    contentRu: normalizeEmbedHtml(article.contentRu ?? ''),
    contentEn: article.contentEn ? normalizeEmbedHtml(article.contentEn) : null,
  };

  return (
    <div className="article-page">
      <ArticleContent article={articleWithCleanEmbed} />
      <ReadAlso city={city as City} articles={relatedArticles} categories={categories} />
      <SocialLinks city={city as City} />
    </div>
  );
}
