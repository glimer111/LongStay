'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES, TELEGRAM_CONTACT } from '@/lib/constants';
import styles from './page.module.css';

const ABOUT_PHOTO_OPTIONS = [
  '/images/AboutImage.png',
  '/images/pexels-leeloothfirst-78182341.png',
  '/images/pexels-leeloothefirst-78182341.png',
  '/images/about-photo.jpg',
  '/images/about.jpg',
];

const CLIENT_LOGOS = [
  '/images/AfricanQueen.png',
  '/images/Badagoni.png',
  '/images/CoffeShop.png',
  '/images/Erborian.png',
  "/images/L'Occitane.png",
  '/images/migrun.png',
  '/images/MoMA.png',
  '/images/Novotel.png',
  '/images/PharmHouse.png',
  '/images/PrimeFit.png',
  '/images/Relaxline.png',
  '/images/SilkMedical.png',
  '/images/YandexEats.png',
  '/images/Krasota.png',
  '/images/Flowwow.png',
];

const LARGE_LOGO_INDICES = new Set([6, 8, 12]); // MoMA, PharmHouse, YandexEats — крупнее

const mid = Math.ceil(CLIENT_LOGOS.length / 2);
const CLIENT_LOGOS_TOP = CLIENT_LOGOS.slice(0, mid);
const CLIENT_LOGOS_BOTTOM = CLIENT_LOGOS.slice(mid);

export default function AboutPage() {
  const { t, locale } = useLanguage();
  const [aboutPhotoIndex, setAboutPhotoIndex] = useState(0);
  const aboutPhotoSrc = ABOUT_PHOTO_OPTIONS[aboutPhotoIndex];

  return (
    <div className={styles.container}>
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h1 className={styles.title}>{t.about.title}</h1>
          <p className={styles.intro}>
            <strong>
              <span className={styles.brand}>Long Stay</span>
              {t.about.introBefore}
              {t.about.introBold}
            </strong>
            {t.about.places}
          </p>
          <p className={styles.paragraph}>{t.about.audience}</p>
          <p className={styles.paragraph}>
            <strong>{t.about.advertisingLead}</strong>
            {t.about.advertisingRest}
          </p>
          <p className={styles.contact}>
            {t.about.contact}
            <br />
            <a href={TELEGRAM_CONTACT} target="_blank" rel="noopener noreferrer" className={styles.telegram}>
              @AnyaKompanits
            </a>
          </p>
        </div>
        <div className={styles.aboutImageWrap}>
          <Image
            src={aboutPhotoSrc}
            alt=""
            width={700}
            height={525}
            className={styles.aboutImage}
            unoptimized
            onError={() => {
              if (aboutPhotoIndex < ABOUT_PHOTO_OPTIONS.length - 1) {
                setAboutPhotoIndex((i) => i + 1);
              }
            }}
          />
        </div>
      </section>

      <section className={styles.clientsSection}>
        <h2 className={styles.clientsTitle}>{t.about.clientsTitle}</h2>
        <div className={styles.clientsGrid}>
          {CLIENT_LOGOS.map((src, i) => (
            <div key={i} className={`${styles.clientLogoWrap} ${LARGE_LOGO_INDICES.has(i) ? styles.clientLogoWrapLarge : ''}`}>
              <Image
                src={src}
                alt=""
                width={320}
                height={160}
                className={styles.clientLogo}
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        <div className={styles.clientsMarquee} aria-hidden>
          <div className={styles.clientsMarqueeRowTop}>
            <div className={styles.clientsMarqueeTrack}>
              {[...CLIENT_LOGOS_TOP, ...CLIENT_LOGOS_TOP].map((src, i) => (
                <div key={i} className={styles.clientsMarqueeSlot}>
                  <Image src={src} alt="" width={320} height={160} className={styles.clientsMarqueeLogo} unoptimized />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.clientsMarqueeRowBottom}>
            <div className={styles.clientsMarqueeTrackBottom}>
              {[...CLIENT_LOGOS_BOTTOM, ...CLIENT_LOGOS_BOTTOM].map((src, i) => (
                <div key={i} className={styles.clientsMarqueeSlot}>
                  <Image src={src} alt="" width={320} height={160} className={styles.clientsMarqueeLogo} unoptimized />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <p className={styles.ctaText}>{t.about.ctaLine1}<br />{t.about.ctaLine2}</p>
        <div className={styles.ctaButtons}>
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/cooperation/${city}`}
              className={styles.ctaButton}
            >
              {locale === 'ru' && city === 'dubai' ? 'Дубае' : t.nav[city]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
