import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuth();
    if (!userId) {
      return Response.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof Blob)) {
      return Response.json({ error: 'Файл не выбран' }, { status: 400 });
    }

    const type = (file.type || '').toLowerCase();
    if (!type.startsWith('image/')) {
      return Response.json({ error: 'Разрешены только изображения (JPEG, PNG, GIF, WebP)' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'Размер файла не более 5 МБ' }, { status: 400 });
    }

    const name = typeof (file as Blob & { name?: string }).name === 'string' ? (file as Blob & { name: string }).name : '';
    const ext = name ? path.extname(name).toLowerCase() || '.jpg' : '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safeExt}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    return Response.json({ url: `/uploads/${safeName}` });
  } catch (err) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Ошибка загрузки';
    return Response.json({ error: message }, { status: 500 });
  }
}
