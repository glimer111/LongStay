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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Неверный формат данных (JSON)' }, { status: 400 });
  }
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

  if (!slug || !titleRu || !contentRu) {
    return Response.json(
      { error: 'Обязательны: slug, заголовок RU и контент RU' },
      { status: 400 }
    );
  }

  const slugStr = String(slug);
  const titleRuStr = String(titleRu);
  const contentRuStr = String(contentRu);

  const existing = await prisma.article.findUnique({ where: { slug: slugStr } });
  if (existing) {
    return Response.json({ error: 'Статья с таким slug уже существует' }, { status: 400 });
  }

  try {
    const created = await prisma.article.create({
      data: {
        slug: slugStr,
        city: cities[0],
        cityIds: JSON.stringify(cities),
        category: categories[0],
        categoryIds: JSON.stringify(categories),
        titleRu: titleRuStr,
        titleEn: titleEn && String(titleEn).trim() ? String(titleEn) : null,
        excerptRu: excerptRu != null ? String(excerptRu) : null,
        excerptEn: excerptEn != null ? String(excerptEn) : null,
        contentRu: contentRuStr,
        contentEn: contentEn && String(contentEn).trim() ? String(contentEn) : null,
        imageUrl: imageUrl || null,
        published: publishedFinal,
        scheduledAt,
        createdById: userId,
        updatedById: userId,
      },
    });
    return Response.json({ ...created, cities, categories });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка при сохранении';
    return Response.json({ error: message }, { status: 500 });
  }
}
