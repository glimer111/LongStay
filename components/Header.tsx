'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearch } from '@/contexts/SearchContext';
import { CITIES, type City } from '@/lib/constants';
import SearchPopup from './SearchPopup';
import styles from './Header.module.css';

const UNDERLINE_WIDTH = 22;

interface HeaderProps {
  preview?: boolean;
}

export default function Header({ preview = false }: HeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const { isOpen: searchOpen, openSearch, closeSearch } = useSearch();
  const [langOpen, setLangOpen] = React.useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null);
  const [exitingUnderline, setExitingUnderline] = useState<{ left: number; width: number } | null>(null);
  const [expandVisible, setExpandVisible] = useState(false);
  const [exitingVisible, setExitingVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isCityActive = (city: City) => {
    return pathname === `/${city}` || pathname.startsWith(`/${city}/`);
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeLink = nav.querySelector(`.${styles.navLinkActive}`) as HTMLElement | null;
    if (!activeLink) {
      setUnderline((prev) => {
        if (prev) setExitingUnderline(prev);
        return null;
      });
      setExpandVisible(false);
      return;
    }
    const left = activeLink.offsetLeft + activeLink.offsetWidth / 2 - UNDERLINE_WIDTH / 2;
    const next = { left, width: UNDERLINE_WIDTH };
    setUnderline((prev) => {
      if (prev === null) setExpandVisible(false);
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    if (exitingUnderline) {
      const t = requestAnimationFrame(() => setExitingVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setExitingVisible(false);
  }, [exitingUnderline]);

  useEffect(() => {
    if (!underline) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setExpandVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [underline]);

  useEffect(() => {
    const updateUnderline = () => {
      const nav = navRef.current;
      if (!nav) return;
      const activeLink = nav.querySelector(`.${styles.navLinkActive}`) as HTMLElement | null;
      if (!activeLink) return;
      const left = activeLink.offsetLeft + activeLink.offsetWidth / 2 - UNDERLINE_WIDTH / 2;
      setUnderline((prev) => (prev ? { ...prev, left, width: UNDERLINE_WIDTH } : null));
    };
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [pathname]);

  const clearExiting = () => setExitingUnderline(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (pathname === '/') {
      const el = document.activeElement as HTMLElement;
      if (el?.blur) {
        requestAnimationFrame(() => {
          el.blur();
          requestAnimationFrame(() => (document.activeElement as HTMLElement)?.blur?.());
        });
      }
    }
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <header className={`${styles.header} ${preview ? styles.headerPreview : ''} ${isHome ? styles.headerHome : ''}`}>
        <div className={styles.container}>
          {preview ? (
            <div className={styles.logoBlock}>
              <Image
                src="/icons/logo.png"
                alt="Long Stay"
                width={72}
                height={72}
                className={styles.logoImg}
              />
              <span className={styles.logo}>LONG STAY</span>
            </div>
          ) : (
            <Link href="/" className={styles.logoBlock}>
              <Image
                src="/icons/logo.png"
                alt="Long Stay"
                width={72}
                height={72}
                className={styles.logoImg}
              />
              <span className={styles.logo}>LONG STAY</span>
            </Link>
          )}

          <nav className={styles.nav} ref={navRef}>
            <div className={styles.navInner}>
              {CITIES.map((city) =>
                preview ? (
                  <span
                    key={city}
                    className={`${styles.navLink} ${isCityActive(city) ? styles.navLinkActive : ''}`}
                  >
                    {t.nav[city]}
                  </span>
                ) : (
                  <Link
                    key={city}
                    href={`/${city}`}
                    className={`${styles.navLink} ${isCityActive(city) ? styles.navLinkActive : ''}`}
                  >
                    {t.nav[city]}
                  </Link>
                )
              )}
              {exitingUnderline && (
                <span
                  className={`${styles.navUnderline} ${styles.navUnderlineVisible} ${exitingVisible ? styles.navUnderlineExiting : ''}`}
                  style={{ left: exitingUnderline.left, width: exitingUnderline.width }}
                  onTransitionEnd={clearExiting}
                  aria-hidden="true"
                />
              )}
              {underline && (
                <span
                  className={`${styles.navUnderline} ${expandVisible ? styles.navUnderlineVisible : ''}`}
                  style={{ left: underline.left, width: underline.width }}
                  aria-hidden="true"
                />
              )}
            </div>
          </nav>

          <div className={styles.actions}>
            <div className={styles.langWrapper}>
              <button
                type="button"
                className={styles.langBtn}
                onClick={() => !preview && setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                disabled={preview}
              >
                {locale.toUpperCase()}
              </button>
              {!preview && langOpen && (
                <div className={styles.langDropdown}>
                  <button onClick={() => { setLocale('ru'); setLangOpen(false); }}>RU</button>
                  <button onClick={() => { setLocale('en'); setLangOpen(false); }}>EN</button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.searchBtn}
              onClick={openSearch}
              aria-label="Search"
              disabled={preview}
            >
              <Image src="/icons/search.png" alt="" width={38} height={38} />
            </button>

            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={() => !preview && setMenuOpen(true)}
              aria-label="Меню"
              aria-expanded={menuOpen}
              disabled={preview}
            >
              <span /><span /><span />
            </button>

            {preview ? (
              <span className={styles.cooperationBtn}>{t.nav.cooperation}</span>
            ) : (
              <Link href="/cooperation" className={styles.cooperationBtn}>
                {t.nav.cooperation}
              </Link>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMenu} aria-hidden="true">
          <div className={styles.mobileMenuPanel} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.mobileMenuClose} onClick={closeMenu} aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <nav className={styles.mobileMenuNav}>
              {CITIES.map((city) => (
                <Link key={city} href={`/${city}`} className={styles.mobileMenuLink} onClick={closeMenu}>
                  {t.nav[city]}
                </Link>
              ))}
              <Link href="/cooperation" className={styles.mobileMenuLink} onClick={closeMenu}>
                {t.nav.cooperation}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {langOpen && (
        <div
          className={styles.langOverlay}
          onClick={() => setLangOpen(false)}
          aria-hidden="true"
        />
      )}

      <SearchPopup isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
