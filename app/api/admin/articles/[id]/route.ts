import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, email: true, name: true } },
      updatedBy: { select: { id: true, email: true, name: true } },
    },
  });
  if (!article) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const cities = article.cityIds ? (JSON.parse(article.cityIds) as string[]) : [article.city];
  const categories = article.categoryIds ? (JSON.parse(article.categoryIds) as string[]) : [article.category];
  return Response.json({ ...article, cities, categories });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return Response.json({ error: 'Not found' }, { status: 404 });
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

  const cities: string[] = Array.isArray(citiesArr) && citiesArr.length > 0 ? citiesArr : [article.city];
  const categories: string[] = Array.isArray(categoriesArr) && categoriesArr.length > 0 ? categoriesArr : [article.category];
  const city = cities[0];
  const category = categories[0];

  if (!slug || !titleRu || !titleEn || !contentRu || !contentEn) {
    return Response.json(
      { error: 'slug, titleRu, titleEn, contentRu, contentEn обязательны' },
      { status: 400 }
    );
  }

  const existing = await prisma.article.findFirst({
    where: { slug, id: { not: id }, deletedAt: null },
  });
  if (existing) {
    return Response.json({ error: 'Статья с таким slug уже существует' }, { status: 400 });
  }

  const updateData = {
    slug,
    city,
    cityIds: JSON.stringify(cities),
    category,
    categoryIds: JSON.stringify(categories),
    titleRu,
    titleEn,
    excerptRu: excerptRu ?? article.excerptRu,
    excerptEn: excerptEn ?? article.excerptEn,
    contentRu,
    contentEn,
    imageUrl: imageUrl ?? article.imageUrl,
    published: published ?? article.published,
    scheduledAt: scheduledAtRaw !== undefined ? scheduledAt : article.scheduledAt,
    updatedById: userId,
  };

  const updated = await prisma.article.update({
    where: { id },
    data: updateData,
  });

  return Response.json({
    ...updated,
    cities,
    categories,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  await prisma.article.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return Response.json({ ok: true });
}
