import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import * as bcrypt from 'bcryptjs';

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return Response.json({ users });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, name, role } = body as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
  };

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (existing) {
    return Response.json({ error: 'User with this email already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const roleVal = role === 'admin' ? 'admin' : 'editor';

  const created = await prisma.user.create({
    data: {
      email: email.trim().toLowerCase(),
      password: hashed,
      name: typeof name === 'string' ? name.trim() || null : null,
      role: roleVal,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return Response.json(created);
}
