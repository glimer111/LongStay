import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function POST(
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
  if (!article.deletedAt) {
    return Response.json({ error: 'Article is not deleted' }, { status: 400 });
  }

  await prisma.article.update({
    where: { id },
    data: { deletedAt: null },
  });
  return Response.json({ ok: true });
}
