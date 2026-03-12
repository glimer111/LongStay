import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Порядок рубрик: «Все материалы» первыми, «Полезное» — последним
const CATEGORY_ORDER = ['all', 'interesting', 'places', 'food', 'shopping', 'events', 'useful'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return Response.json({ categories: [] });
  }

  const rows = await prisma.category.findMany({
    where: { city },
  });

  const orderMap = new Map(CATEGORY_ORDER.map((slug, i) => [slug, i]));
  const categories = rows
    .sort((a, b) => (orderMap.get(a.slug) ?? 99) - (orderMap.get(b.slug) ?? 99))
    .map((c) => ({
      slug: c.slug,
      nameRu: c.nameRu,
      nameEn: c.nameEn,
      externalUrl: c.externalUrl,
    }));

  return Response.json({ categories });
}
