import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const q = searchParams.get('q');

  const now = new Date();
  const visibleWhere = {
    published: true,
    deletedAt: null,
    OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
  };

  if (q) {
    const articles = await prisma.article.findMany({
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
    });
    return Response.json({ articles });
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
