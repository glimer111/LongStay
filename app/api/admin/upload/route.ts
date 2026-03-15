import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_SIZE_VERCEL = 4.5 * 1024 * 1024; // 4.5 MB — лимит body у serverless-функций Vercel
const MAX_SIZE_LOCAL = 15 * 1024 * 1024; // 15 MB — более щедрый лимит для собственного сервера

function getLocalUploadConfig() {
  // Путь на диске, куда можно писать (по умолчанию public/uploads внутри проекта)
  const dir =
    process.env.UPLOAD_DIR && process.env.UPLOAD_DIR.trim()
      ? process.env.UPLOAD_DIR.trim()
      : path.join(process.cwd(), 'public', 'uploads');

  // Базовый URL, по которому эти файлы отдаются nginx/Node (по умолчанию /uploads)
  const publicBase =
    process.env.UPLOAD_PUBLIC_BASE && process.env.UPLOAD_PUBLIC_BASE.trim()
      ? process.env.UPLOAD_PUBLIC_BASE.trim().replace(/\/$/, '')
      : '/uploads';

  return { dir, publicBase };
}

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

    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const sizeLimit = useBlob ? MAX_SIZE_VERCEL : MAX_SIZE_LOCAL;
    if (file.size > sizeLimit) {
      return Response.json(
        {
          error: `Размер файла не более ${Math.round(sizeLimit / (1024 * 1024))} МБ`,
        },
        { status: 400 },
      );
    }

    const name = typeof (file as Blob & { name?: string }).name === 'string' ? (file as Blob & { name: string }).name : '';
    const ext = name ? path.extname(name).toLowerCase() || '.jpg' : '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext) ? ext : '.jpg';
    const safeName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safeExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // На Vercel (и при наличии BLOB_READ_WRITE_TOKEN) — сохраняем в Vercel Blob
    if (useBlob) {
      const blob = await put(safeName, buffer, {
        access: 'public',
        contentType: type || undefined,
        addRandomSuffix: false,
      });
      return Response.json({ url: blob.url });
    }

    // Собственный сервер / локальная разработка — сохраняем на диск
    const { dir, publicBase } = getLocalUploadConfig();
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, path.basename(safeName));
    await writeFile(filePath, buffer);

    const publicUrl = `${publicBase}/${path.basename(safeName)}`;
    return Response.json({ url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Ошибка загрузки';
    return Response.json({ error: message }, { status: 500 });
  }
}
