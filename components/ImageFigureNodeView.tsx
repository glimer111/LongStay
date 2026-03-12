'use client';

import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';

export function ImageFigureNodeView({ node, updateAttributes }: ReactNodeViewProps) {
  const attrs = node.attrs as Record<string, unknown>;
  const src = (attrs.src != null && attrs.src !== '') ? String(attrs.src) : '';
  const capA = (String(attrs.captionAttribution ?? '')).trim() || null;
  const capD = (String(attrs.captionDescription ?? '')).trim() || null;

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

  return (
    <NodeViewWrapper
      as="figure"
      className="article-figure"
      data-drag-handle
      onContextMenu={handleContextMenu}
    >
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
