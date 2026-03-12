import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const q = searchParams.get('q');

  const now = new Date();
  const visibleWhere: Prisma.ArticleWhereInput = {
    published: true,
    deletedAt: null,
    OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
  };

  if (q) {
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50);
    const offset = Math.max(0, Number(searchParams.get('offset')) || 0);
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          AND: [
            visibleWhere,
            {
              OR: [
                { titleRu: { contains: q } },
                { titleEn: { contains: q } },
                { contentRu: { contains: q } },
                { contentEn: { contains: q } },
              ],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.article.count({
        where: {
          AND: [
            visibleWhere,
            {
              OR: [
                { titleRu: { contains: q } },
                { titleEn: { contains: q } },
                { contentRu: { contains: q } },
                { contentEn: { contains: q } },
              ],
            },
          ],
        },
      }),
    ]);
    return Response.json({ articles, total, hasMore: offset + articles.length < total });
  }

  if (!city) {
    return Response.json({ articles: [] });
  }

  const all = await prisma.article.findMany({
    where: visibleWhere,
    orderBy: { createdAt: 'desc' },
  });

  const articles = all.filter((a) => {
    if (a.city === city) return true;
    if (!a.cityIds) return false;
    try {
      const ids = JSON.parse(a.cityIds) as string[];
      return ids.includes(city);
    } catch {
      return false;
    }
  });

  return Response.json({ articles });
}
