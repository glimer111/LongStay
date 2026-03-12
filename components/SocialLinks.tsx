'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { SOCIAL_LINKS, type City } from '@/lib/constants';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  city: City;
}

const ICON_SRC: Record<string, string> = {
  instagram: '/icons/instagram.png',
  telegram: '/icons/telegram.png',
  tiktok: '/icons/tiktok.png',
};

export default function SocialLinks({ city }: SocialLinksProps) {
  const { t } = useLanguage();
  const links = SOCIAL_LINKS[city];
  if (!links) return null;

  const entries = Object.entries(links).filter(([, url]) => url) as [keyof typeof links, string][];

  return (
    <section className={styles.wrapper}>
      <div className={styles.contentBlock}>
        <div className={styles.headingWrapper}>
          <h3 className={styles.subscribe}>
            <span className={styles.subscribeLine1}>{t.social.subscribeLine1}</span>
            <span className={styles.subscribeLine2}>{t.social.subscribeLine2}</span>
          </h3>
          <p className={styles.dontLose}>{t.social.dontLose}</p>
        </div>
        <div className={`${styles.links} ${entries.length === 1 ? styles.linksSingle : ''}`}>
      {entries.map(([name, url]) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={name}
        >
          <span className={styles.iconWrap}>
            <Image src={ICON_SRC[name] || ''} alt="" width={129} height={129} className={styles.socialIcon} />
          </span>
          <span className={styles.label}>{name}</span>
        </a>
      ))}
        </div>
      </div>
    </section>
  );
}
