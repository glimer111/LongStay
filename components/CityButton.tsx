'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES, type City } from '@/lib/constants';
import styles from './CityButton.module.css';

interface CityButtonProps {
  city: City;
  href?: string;
  label?: string;
}

export default function CityButton({ city, href, label }: CityButtonProps) {
  const { t } = useLanguage();
  const link = href || `/${city}`;
  const text = label ?? t.nav[city];

  return (
    <Link href={link} className={styles.button}>
      {text}
    </Link>
  );
}
