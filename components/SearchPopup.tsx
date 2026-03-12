'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './SearchPopup.module.css';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = () => {
    const q = query.trim();
    if (q) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
            <div className={styles.pill}>
              <button
                type="button"
                className={styles.searchIcon}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }}
                aria-label="Search"
              >
                <Image src="/icons/search-input.png" alt="" width={38} height={38} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.search.placeholder}
                className={styles.input}
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearField}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  aria-label="Очистить"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M12 4L4 12M4 4l8 8" />
                  </svg>
                </button>
              )}
            </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <Image src="/icons/cross.png" alt="" width={38} height={38} />
          </button>
        </div>
      </div>
    </div>
  );
}
