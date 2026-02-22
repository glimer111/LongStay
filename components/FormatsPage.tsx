'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { type City, TELEGRAM_CONTACT } from '@/lib/constants';
import { getFormatsForCity } from '@/lib/formats';
import styles from './FormatsPage.module.css';

function linkifyTelegram(text: string) {
  const parts = text.split('@AnyaKompanits');
  if (parts.length === 1) return text;
  return parts.flatMap((part, i) =>
    i < parts.length - 1
      ? [part, <a key={i} href={TELEGRAM_CONTACT} target="_blank" rel="noopener noreferrer" className={styles.telegramLink}>@AnyaKompanits</a>]
      : [part]
  );
}

const SECTION_HEADER_LABELS = [
  'План работы в этом формате:',
  'Уточнение:',
  'Дополнительные возможности:',
  'Дополнительно:',
  'Срок выполнения:',
  'Дополнительные уточнения:',
  'Условия:',
  'Важно:',
  'Work plan:',
  'Note:',
  'Additional options:',
  'Delivery:',
  'Terms:',
  'Clarification:',
  'Additional:',
];

function getSectionLabel(line: string): string | null {
  const t = line.trim();
  const found = SECTION_HEADER_LABELS.find((label) => t.startsWith(label));
  return found ?? null;
}

function renderContentLine(line: string, key: number) {
  const trimmed = line.trim();
  if (!trimmed) return <br key={key} />;
  const stepMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (stepMatch) {
    return (
      <p key={key} className={styles.formatContentStep}>
        <span className={styles.formatContentStepNum}>{stepMatch[1]}.</span> {linkifyTelegram(stepMatch[2])}
      </p>
    );
  }
  const sectionLabel = getSectionLabel(trimmed);
  if (sectionLabel) {
    const rest = trimmed.slice(sectionLabel.length).trim();
    return (
      <p key={key} className={styles.formatContentSection}>
        <span className={styles.formatContentSectionLabel}>{sectionLabel}</span>
        {rest ? <> {linkifyTelegram(rest)}</> : null}
      </p>
    );
  }
  return (
    <p key={key} className={styles.formatContentParagraph}>
      {linkifyTelegram(trimmed)}
    </p>
  );
}

function formatPriceWithBreaks(price: string) {
  const after = '100 GEL ';
  const i = price.indexOf(after);
  if (i === -1) return price;
  const before = price.slice(0, i + after.length);
  const rest = price.slice(i + after.length);
  return <>{before}<br />{rest}</>;
}

interface FormatsPageProps {
  city: City;
}

export default function FormatsPage({ city }: FormatsPageProps) {
  const { t, locale } = useLanguage();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const formats = getFormatsForCity(city);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.formats.title}</h1>
        <div className={styles.formats}>
          {formats.map((f, index) => {
          const isExpanded = expandedIds.has(f.id);
          const name = locale === 'ru' ? f.nameRu : f.nameEn;
          const content = locale === 'ru' ? f.contentRu : f.contentEn;

            return (
              <div
                key={f.id}
                className={`${styles.format} ${isExpanded ? styles.formatExpanded : ''}`}
                onClick={() => toggleExpanded(f.id)}
              >
                <div className={styles.formatHeader}>
                  <span className={styles.formatNumber}>{index + 1}.</span>
                  <span className={styles.formatName}>{name}</span>
                  <div className={styles.formatHeaderRight}>
                    {f.price && (
                      <span className={styles.formatPrice}>
                        <Image src="/icons/coins.png" alt="" width={20} height={20} className={styles.formatPriceIcon} />
                        {formatPriceWithBreaks(f.price)}
                      </span>
                    )}
                    <span className={`${styles.formatChevron} ${isExpanded ? styles.formatChevronOpen : ''}`} aria-hidden>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
                <div
                  className={styles.formatContentWrapper}
                  style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                >
                  <div className={styles.formatContentInner}>
                    <div className={styles.formatContent}>
                      {content.split('\n').map((line, i) => renderContentLine(line, i))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
