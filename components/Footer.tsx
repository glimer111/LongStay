'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { CITIES, TELEGRAM_CONTACT } from '@/lib/constants';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();
  const { openSearch } = useSearch();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.logoBlock}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/icons/logo.png"
                alt=""
                width={48}
                height={48}
                className={styles.logoImg}
              />
              <div className={styles.logoText}>
                <span className={styles.logoName}>Long Stay</span>
                <span className={styles.tagline}>{t.footer.tagline}</span>
              </div>
            </Link>
            <div className={styles.separator} />
          </div>

          <nav className={styles.nav}>
            {CITIES.map((city) => (
              <Link key={city} href={`/${city}`} className={styles.navLink}>
                {t.nav[city]}
              </Link>
            ))}
            <Link href="/cooperation" className={styles.navLink}>
              {t.nav.advertising}
            </Link>
            <Link href="/about" className={styles.navLink}>
              {t.nav.about}
            </Link>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={openSearch}
              aria-label="Search"
            >
              <Image src="/icons/search.png" alt="" width={24} height={24} />
            </button>
          </nav>
        </div>

        <div className={styles.contact}>
          <p className={styles.contactTitle}>{t.footer.contactTitle}</p>
          <p className={styles.contactLine}>
            {t.footer.contactAction}{' '}
            <a href={TELEGRAM_CONTACT} target="_blank" rel="noopener noreferrer" className={styles.telegram}>
              @AnyaKompaniets
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
