import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageFigureNodeView } from '@/components/ImageFigureNodeView';

export const ImageFigure = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageFigureNodeView);
  },

  addAttributes() {
    return {
      src: { default: null as string | null },
      alt: { default: null as string | null },
      title: { default: null as string | null },
      captionAttribution: {
        default: null as string | null,
        parseHTML: (el) => {
          const fig = (el as HTMLElement).closest?.('figure');
          const fc = fig?.querySelector('figcaption');
          if (!fc) return null;
          const attrEl = fc.querySelector('.caption-attribution');
          return attrEl ? attrEl.textContent?.trim() ?? null : null;
        },
        renderHTML: () => ({}),
      },
      captionDescription: {
        default: null as string | null,
        parseHTML: (el) => {
          const fig = (el as HTMLElement).closest?.('figure');
          const fc = fig?.querySelector('figcaption');
          if (!fc) return null;
          const descEl = fc.querySelector('.caption-description');
          return descEl ? descEl.textContent?.trim() ?? null : null;
        },
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    const getAttrsFromImg = (el: HTMLElement) => {
      const figure = el.closest?.('figure');
      let capA: string | null = null;
      let capD: string | null = null;
      if (figure) {
        const fc = figure.querySelector('figcaption');
        if (fc) {
          const attrEl = fc.querySelector('.caption-attribution');
          const descEl = fc.querySelector('.caption-description');
          capA = attrEl ? attrEl.textContent?.trim() ?? null : null;
          capD = descEl ? descEl.textContent?.trim() ?? null : null;
        }
      }
      return {
        src: el.getAttribute('src'),
        alt: el.getAttribute('alt'),
        title: el.getAttribute('title'),
        captionAttribution: capA,
        captionDescription: capD,
      };
    };
    return [
      {
        tag: 'figure.article-figure',
        getAttrs: (dom) => {
          const fig = dom as HTMLElement;
          const img = fig.querySelector('img');
          if (!img) return false;
          return getAttrsFromImg(img);
        },
      },
      {
        tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
        getAttrs: (dom) => getAttrsFromImg(dom as HTMLElement),
      },
    ];
  },

  renderHTML({ node }) {
    const capA = (node.attrs.captionAttribution ?? '').trim() || null;
    const capD = (node.attrs.captionDescription ?? '').trim() || null;
    const src = node.attrs.src != null ? String(node.attrs.src) : '';
    const imgAttrs: Record<string, string> = {
      ...this.options.HTMLAttributes,
      src: src || '',
    };
    if (node.attrs.alt != null && node.attrs.alt !== '') imgAttrs.alt = String(node.attrs.alt);
    if (node.attrs.title != null && node.attrs.title !== '') imgAttrs.title = String(node.attrs.title);
    const img = ['img', imgAttrs];
    const hasCaption = !!(capA || capD);
    if (!hasCaption) {
      return ['figure', { class: 'article-figure' }, img];
    }
    return [
      'figure',
      { class: 'article-figure' },
      img,
      [
        'figcaption',
        { class: 'article-figcaption' },
        ['div', { class: 'caption-attribution' }, capA ?? ''],
        ['div', { class: 'caption-description' }, capD ?? ''],
      ],
    ];
  },
});
