'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { CITIES } from '@/lib/constants';
import CityButton from '@/components/CityButton';
import styles from './page.module.css';

const BENEFIT_IMAGES = ['/images/article-1.png', '/images/article-2.png', '/images/article-3.png', '/images/article-4.png'];
const BENEFIT_KEYS = ['algorithms', 'audience', 'option', 'creators'] as const;

const STATS = [
  { target: 1000, prefix: '+', suffix: '' },
  { target: 85, prefix: '+', suffix: '%' },
  { target: 2, prefix: '+', suffix: '' },
];

const DURATION_MS = 1200;
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;

export default function CooperationPage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [statValues, setStatValues] = useState([0, 0, 0]);
  const [benefitsInView, setBenefitsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const statsStarted = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const heroHeight = hero.offsetHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrolled / heroHeight));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (statsStarted.current) return;
    statsStarted.current = true;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const eased = easeOutQuint(progress);
      setStatValues(STATS.map((s) => Math.round(s.target * eased)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = whyRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        setBenefitsInView(!!entries[0]?.isIntersecting);
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const benefits = BENEFIT_KEYS.map((key) => ({
    key,
    title: t.cooperation.benefits[key].title,
    text: t.cooperation.benefits[key].text,
  }));

  const scale = isMobile ? 1 : 1 - scrollProgress * 0.25;
  const opacity = isMobile ? 1 : 1 - scrollProgress * 0.3;

  return (
    <div className={styles.pageWrapper}>
      <section ref={heroRef} className={styles.hero}>
        <div
          className={styles.heroInner}
          style={{
            transform: `scale(${scale})`,
            opacity,
          }}
        >
        <div className={styles.heroLeft}>
          <Image src="/images/hero-right.png" alt="" fill className={styles.heroImg} sizes="50vw" />
        </div>
        <div className={styles.heroCenter}>
          <h1 className={styles.mainTitle}>{t.nav.advertising}</h1>
          <p className={styles.headline}>{t.cooperation.headline}</p>
          <p className={styles.subheadline}>{t.cooperation.subheadlineLine1}<br />{t.cooperation.subheadlineLine2}</p>
          <h2 className={styles.statsTitle}>{t.cooperation.ourPromo}</h2>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {STATS[0].prefix}{statValues[0]}{STATS[0].suffix}
              </span>
              <span className={styles.statLabel}>{t.cooperation.stats.integrationsLine1}<br />{t.cooperation.stats.integrationsLine2}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {STATS[1].prefix}{statValues[1]}{STATS[1].suffix}
              </span>
              <span className={styles.statLabel}>{t.cooperation.stats.advertisersLine1}<br />{t.cooperation.stats.advertisersLine2}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {STATS[2].prefix}{statValues[2]}{STATS[2].suffix}
              </span>
              <span className={styles.statLabel}>{t.cooperation.stats.reachLine1}<br />{t.cooperation.stats.reachLine2}</span>
            </div>
          </div>
          <p className={styles.ctaText}>{t.cooperation.wantOrder}</p>
          <div className={styles.buttons}>
            {CITIES.map((city) => (
              <CityButton
                key={city}
                city={city}
                href={`/cooperation/${city}`}
                label={city === 'dubai' ? t.cooperation.dubaiButton : undefined}
              />
            ))}
          </div>
        </div>
        <div className={styles.heroRight}>
          <Image src="/images/hero-left.png" alt="" fill className={styles.heroImg} sizes="50vw" />
        </div>
        </div>
      </section>

      <div className={styles.contentWrapper}>
      <section id="why-works" ref={whyRef} className={`${styles.whySection} ${benefitsInView ? styles.benefitsInView : ''}`}>
        <h2 className={styles.whyTitle}>{t.cooperation.whyWorks}</h2>
        <div className={styles.benefitsRowOuter}>
        <div className={styles.benefitsRow}>
          {benefits.map((b, i) => (
            <div key={b.key} className={styles.benefitCard}>
              <div className={styles.benefitImage}>
                <Image src={BENEFIT_IMAGES[i]} alt="" fill sizes="(max-width: 1200px) 50vw, 320px" className={styles.benefitImageImg} />
              </div>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitText}>{b.text}</p>
            </div>
          ))}
        </div>
        </div>
        <p className={styles.ctaText}>{t.cooperation.wantPrices}</p>
        <div className={styles.buttons}>
          {CITIES.map((city) => (
            <CityButton
              key={city}
              city={city}
              href={`/cooperation/${city}`}
              label={city === 'dubai' ? t.cooperation.dubaiButton : undefined}
            />
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
