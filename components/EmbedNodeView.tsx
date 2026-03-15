'use client';

import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';

const isAbsoluteUrl = (s: string) => /^https?:\/\//i.test(s);

export function EmbedNodeView({ node }: ReactNodeViewProps) {
  const raw = (node.attrs.src != null && node.attrs.src !== '') ? String(node.attrs.src).trim() : '';
  const src = raw && isAbsoluteUrl(raw) ? raw : '';

  return (
    <NodeViewWrapper as="div" className="article-embed" data-drag-handle>
      {src ? (
        <iframe
          src={src}
          className="article-embed-iframe"
          title="Встроенное содержимое"
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="article-embed--empty">
          <span>Вставьте ссылку на embed</span>
        </div>
      )}
    </NodeViewWrapper>
  );
}
