import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const userId = await getAuth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deleted = searchParams.get('deleted') === '1';

  if (deleted) {
    const articles = await prisma.article.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      include: {
        createdBy: { select: { id: true, email: true, name: true } },
        updatedBy: { select: { id: true, email: true, name: true } },
      },
    });
    return Response.json({ articles });
  }

  const articles = await prisma.article.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { id: true, email: true, name: true } },
      updatedBy: { select: { id: true, email: true, name: true } },
    },
  });

  return Response.json({ articles });
}

export async function POST(request: NextRequest) {
  const userId = await getAuth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    slug,
    cities: citiesArr,
    categories: categoriesArr,
    titleRu,
    titleEn,
    excerptRu,
    excerptEn,
    contentRu,
    contentEn,
    imageUrl,
    published,
    scheduledAt: scheduledAtRaw,
  } = body;
  const scheduledAt =
    scheduledAtRaw != null && scheduledAtRaw !== ''
      ? new Date(scheduledAtRaw as string)
      : null;
  const isScheduled = scheduledAt != null && scheduledAt > new Date();
  const publishedFinal = isScheduled ? true : (published ?? true);

  const cities: string[] = Array.isArray(citiesArr) && citiesArr.length > 0 ? citiesArr : ['tbilisi'];
  const categories: string[] = Array.isArray(categoriesArr) && categoriesArr.length > 0 ? categoriesArr : ['interesting'];

  if (!slug || !titleRu || !titleEn || !contentRu || !contentEn) {
    return Response.json(
      { error: 'slug, titleRu, titleEn, contentRu, contentEn обязательны' },
      { status: 400 }
    );
  }

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: 'Статья с таким slug уже существует' }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      slug,
      city: cities[0],
      category: categories[0],
      titleRu,
      titleEn,
      excerptRu: excerptRu || null,
      excerptEn: excerptEn || null,
      contentRu,
      contentEn,
      imageUrl: imageUrl || null,
      published: publishedFinal,
      scheduledAt,
      createdById: userId,
      updatedById: userId,
    },
  });

  try {
    await prisma.$executeRawUnsafe(
      'UPDATE Article SET cityIds = ?, categoryIds = ? WHERE id = ?',
      JSON.stringify(cities),
      JSON.stringify(categories),
      article.id
    );
  } catch {
    // cityIds/categoryIds columns may not exist until after prisma db push
  }

  return Response.json({ ...article, cities, categories });
}
