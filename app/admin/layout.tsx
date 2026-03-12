'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuth(false);
      setRole(null);
      return;
    }
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setAuth(true);
          setRole(data.role ?? 'editor');
        } else {
          setAuth(false);
          setRole(null);
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        setAuth(false);
        setRole(null);
        router.replace('/admin/login');
      });
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (auth === null) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.admin}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.logo}>
          Long Stay Admin
        </Link>
        <nav>
          <Link
            href="/admin"
            className={pathname === '/admin' ? styles.active : ''}
          >
            Статьи
          </Link>
          <Link
            href="/admin/articles/new"
            className={pathname === '/admin/articles/new' ? styles.active : ''}
          >
            Новая статья
          </Link>
          {role === 'admin' && (
            <Link
              href="/admin/actors"
              className={pathname === '/admin/actors' ? styles.active : ''}
            >
              Аккаунты
            </Link>
          )}
        </nav>
        <div className={styles.bottom}>
          <Link href="/" className={styles.back} target="_blank">
            На сайт
          </Link>
          <button
            type="button"
            className={styles.logout}
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              router.replace('/admin/login');
            }}
          >
            Выйти
          </button>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
