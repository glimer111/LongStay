'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

interface Actor {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function AdminActorsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'editor' | 'admin'>('editor');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/actors')
      .then((r) => {
        if (r.status === 401) {
          router.replace('/admin/login');
          return null;
        }
        if (r.status === 403) {
          setForbidden(true);
          return { users: [] };
        }
        return r.json();
      })
      .then((data) => {
        if (data) setUsers(data.users || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/actors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Ошибка');
        return;
      }
      setUsers((prev) => [data, ...prev]);
      setEmail('');
      setPassword('');
      setName('');
      setRole('editor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот аккаунт?')) return;
    const res = await fetch(`/api/admin/actors/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || 'Ошибка удаления');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (forbidden) return <p className={styles.empty}>Доступ только у главного администратора.</p>;

  return (
    <div className={styles.container}>
      <h1>Аккаунты</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Добавить аккаунт</h2>
        {submitError && <p style={{ color: '#c00', marginBottom: '0.5rem' }}>{submitError}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
        />
        <input
          type="text"
          placeholder="Имя (необязательно)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'editor' | 'admin')}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', border: '1px solid #ddd', borderRadius: 4 }}
        >
          <option value="editor">Редактор</option>
          <option value="admin">Администратор</option>
        </select>
        <button type="submit" disabled={submitting} className={styles.newBtn} style={{ marginTop: '0.25rem' }}>
          {submitting ? 'Создание...' : 'Добавить аккаунт'}
        </button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Создан</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name || '—'}</td>
              <td>{u.role === 'admin' ? 'Администратор' : 'Редактор'}</td>
              <td>{new Date(u.createdAt).toLocaleDateString('ru')}</td>
              <td>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => handleDelete(u.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p className={styles.empty}>Нет аккаунтов</p>}
    </div>
  );
}
