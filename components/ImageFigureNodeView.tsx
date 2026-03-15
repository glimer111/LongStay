'use client';

import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import styles from './ImageFigureNodeView.module.css';

type Align = 'left' | 'center' | 'right';

export function ImageFigureNodeView({ node, updateAttributes }: ReactNodeViewProps) {
  const attrs = node.attrs as Record<string, unknown>;
  const src = (attrs.src != null && attrs.src !== '') ? String(attrs.src) : '';
  const capA = (String(attrs.captionAttribution ?? '')).trim() || null;
  const capD = (String(attrs.captionDescription ?? '')).trim() || null;
  const align = (attrs.align === 'left' || attrs.align === 'right') ? attrs.align : 'center';

  const hasCaption = !!(capA || capD);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const attr = window.prompt('Атрибуция (например: Фото: Author/Shutterstock):', capA ?? '');
    const desc = window.prompt('Описание подписи:', capD ?? '');
    if (attr !== null && desc !== null) {
      updateAttributes({
        captionAttribution: attr.trim() || null,
        captionDescription: desc.trim() || null,
      });
    }
  };

  const setAlign = (value: Align) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateAttributes({ align: value });
  };

  return (
    <NodeViewWrapper
      as="figure"
      className={`article-figure article-figure--${align} ${styles.wrapper}`}
      data-drag-handle
      onContextMenu={handleContextMenu}
    >
      <div className={styles.alignBar}>
        <button
          type="button"
          className={align === 'left' ? styles.active : ''}
          onClick={setAlign('left')}
          title="По левому краю"
          aria-label="По левому краю"
        >
          <AlignLeftIcon />
        </button>
        <button
          type="button"
          className={align === 'center' ? styles.active : ''}
          onClick={setAlign('center')}
          title="По центру"
          aria-label="По центру"
        >
          <AlignCenterIcon />
        </button>
        <button
          type="button"
          className={align === 'right' ? styles.active : ''}
          onClick={setAlign('right')}
          title="По правому краю"
          aria-label="По правому краю"
        >
          <AlignRightIcon />
        </button>
      </div>
      <img
        src={src}
        alt={attrs.alt != null ? String(attrs.alt) : ''}
        title={attrs.title != null ? String(attrs.title) : undefined}
        loading="lazy"
        draggable={false}
      />
      {hasCaption && (
        <figcaption className="article-figcaption">
          <div className="caption-attribution">{capA ?? ''}</div>
          <div className="caption-description">{capD ?? ''}</div>
        </figcaption>
      )}
    </NodeViewWrapper>
  );
}

/* Иконки выравнивания как в Word: три линии разной длины */
function AlignLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <line x1="4" y1="17" x2="12" y2="17" />
    </svg>
  );
}
function AlignCenterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="12" y1="17" x2="20" y2="17" />
    </svg>
  );
}
