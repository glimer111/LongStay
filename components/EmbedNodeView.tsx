'use client';

import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { isInstagramSrc, getInstagramEmbedUrl } from '@/lib/embed';
import styles from './EmbedNodeView.module.css';

const isAbsoluteUrl = (s: string) => /^https?:\/\//i.test(s);

type Align = 'left' | 'center' | 'right';

function AlignLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="17" x2="12" y2="17" />
    </svg>
  );
}
function AlignCenterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function EmbedNodeView({ node, updateAttributes }: ReactNodeViewProps) {
  const raw = (node.attrs.src != null && node.attrs.src !== '') ? String(node.attrs.src).trim() : '';
  const src = raw && isAbsoluteUrl(raw) ? raw : '';
  const isInstagram = !!src && isInstagramSrc(src);
  const align: Align = (node.attrs.align === 'left' || node.attrs.align === 'right') ? node.attrs.align : 'center';

  const setAlign = (value: Align) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateAttributes({ align: value });
  };

  return (
    <NodeViewWrapper as="div" className={`article-embed article-embed--${align}`} data-drag-handle>
      <div className={styles.alignBar}>
        <button type="button" className={align === 'left' ? styles.active : ''} onClick={setAlign('left')} title="По левому краю" aria-label="По левому краю">
          <AlignLeftIcon />
        </button>
        <button type="button" className={align === 'center' ? styles.active : ''} onClick={setAlign('center')} title="По центру" aria-label="По центру">
          <AlignCenterIcon />
        </button>
        <button type="button" className={align === 'right' ? styles.active : ''} onClick={setAlign('right')} title="По правому краю" aria-label="По правому краю">
          <AlignRightIcon />
        </button>
      </div>
      {src ? (
        isInstagram ? (
          <iframe
            src={getInstagramEmbedUrl(src)}
            className="article-embed-iframe article-embed-iframe-instagram"
            title="Instagram"
            frameBorder={0}
            allow="encrypted-media"
          />
        ) : (
          <iframe
            src={src}
            className="article-embed-iframe"
            title="Встроенное содержимое"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <div className="article-embed--empty">
          <span>Вставьте ссылку на embed</span>
        </div>
      )}
    </NodeViewWrapper>
  );
}
