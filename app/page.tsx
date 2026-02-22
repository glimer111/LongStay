'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES } from '@/lib/constants';
import CityButton from '@/components/CityButton';
import styles from './page.module.css';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <h1 className={styles.logo}>LONG STAY</h1>
        <div className={styles.mediaTaglineWrap}>
          <p className={styles.mediaTaglineDesktop}>{t.main.mediaTagline}</p>
          <p className={styles.mediaTaglineMobile}>
            {t.main.mediaTaglinePart1}<em>{t.main.mediaTaglineItalic}</em>{t.main.mediaTaglineBreak}
            <br />
            {t.main.mediaTaglineLine2}
          </p>
        </div>
        <h2 className={styles.titleDesktop}>{t.main.chooseCity}</h2>
        <h2 className={styles.titleMobile}>{t.main.chooseCityLine1}<br />{t.main.chooseCityLine2}</h2>
        <div className={styles.buttons}>
          {CITIES.map((city) => (
            <CityButton key={city} city={city} />
          ))}
          <Link href="/cooperation" className={styles.cooperationButton}>
            {t.nav.cooperation}
          </Link>
        </div>
      </div>
    </div>
  );
}
