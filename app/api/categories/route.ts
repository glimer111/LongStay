import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return Response.json({ categories: [] });
  }

  const categories = await prisma.category.findMany({
    where: { city },
    orderBy: { nameRu: 'asc' },
  });

  return Response.json({
    categories: categories.map((c) => ({
      slug: c.slug,
      nameRu: c.nameRu,
      nameEn: c.nameEn,
      externalUrl: c.externalUrl,
    })),
  });
}
