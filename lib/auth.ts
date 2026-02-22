import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('JWT_SECRET must be set in production');
  }
  return secret || 'long-stay-secret-change-in-production';
}

export async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

/** Returns current user (id, email, role) or null. Use for role checks (e.g. admin-only). */
export async function getAuthUser() {
  const userId = await getAuth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true },
  });
  return user;
}
