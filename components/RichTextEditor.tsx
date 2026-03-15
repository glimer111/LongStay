'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { ImageFigure } from '@/lib/tiptap-image-figure';
import { Embed, normalizeEmbedUrl, extractSrcFromPaste } from '@/lib/tiptap-embed';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<ReturnType<typeof useEditor>>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: '_blank', rel: 'noopener' },
      }),
      ImageFigure.configure({
        inline: false,
        allowBase64: false,
      }),
      Embed,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
      handlePaste: (view, event) => {
        const pastedHtml = event.clipboardData?.getData('text/html') || '';
        const pastedText = event.clipboardData?.getData('text/plain') || '';
        const raw = pastedHtml || pastedText;
        const srcRaw = extractSrcFromPaste(raw);
        if (srcRaw) {
          const src = normalizeEmbedUrl(raw) || (srcRaw.startsWith('http') ? srcRaw : '');
          if (src && editorRef.current) {
            event.preventDefault();
            editorRef.current.chain().focus().insertContent({ type: 'embed', attrs: { src } }).run();
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    (editorRef as React.MutableRefObject<ReturnType<typeof useEditor> | null>).current = editor;
  }, [editor]);

  const prevValueRef = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      if (value !== editor.getHTML()) {
        editor.commands.setContent(value || '', false);
      }
    }
  }, [value, editor]);

  const handleUpdate = useCallback(() => {
    if (editor) {
      onChange(editor.getHTML());
    }
  }, [editor, onChange]);

  useEffect(() => {
    if (editor) {
      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, handleUpdate]);

  const addImageByUrl = () => {
    setImageMenuOpen(false);
    const url = (window.prompt('URL изображения:') ?? '').trim();
    if (!url) return;
    const attr = (window.prompt('Атрибуция (например: Фото: Author/Shutterstock):', '') ?? '').trim();
    const desc = (window.prompt('Описание подписи:', '') ?? '').trim();
    editor?.chain().focus().setImage({
      src: url,
      ...(attr && { captionAttribution: attr }),
      ...(desc && { captionDescription: desc }),
    }).run();
  };

  const openUploadDialog = () => {
    setImageMenuOpen(false);
    uploadInputRef.current?.click();
  };

  const addEmbed = () => {
    setImageMenuOpen(false);
    const url = (window.prompt('Ссылка на embed (YouTube, Vimeo или полный iframe URL):', '') ?? '').trim();
    if (!url) return;
    const src = normalizeEmbedUrl(url) || (url.startsWith('http://') || url.startsWith('https://') ? url : '');
    if (!src) {
      alert('Укажите полную ссылку, например:\nhttps://www.youtube.com/watch?v=...\nили https://www.youtube.com/embed/...');
      return;
    }
    editor?.chain().focus().insertContent({ type: 'embed', attrs: { src } }).run();
  };

  const [instagramModalOpen, setInstagramModalOpen] = useState(false);
  const [instagramModalCode, setInstagramModalCode] = useState('');

  const addInstagramEmbed = () => {
    setImageMenuOpen(false);
    setInstagramModalCode('');
    setInstagramModalOpen(true);
  };

  const applyInstagramEmbed = () => {
    const raw = instagramModalCode.trim();
    const srcRaw = extractSrcFromPaste(raw);
    const src = srcRaw ? (normalizeEmbedUrl(raw) || (srcRaw.startsWith('http') ? srcRaw : '')) : '';
    if (!src || !/instagram\.com\/p\//i.test(src)) {
      alert('Вставьте код из Instagram: нажмите «Копировать код вставки» в диалоге поста и вставьте сюда.');
      return;
    }
    editor?.chain().focus().insertContent({ type: 'embed', attrs: { src } }).run();
    setInstagramModalOpen(false);
    setInstagramModalCode('');
  };

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const imageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
        setImageMenuOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [imageMenuOpen]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    e.target.value = '';
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        if (!res.ok) throw new Error(text.slice(0, 200) || `Ошибка ${res.status}`);
      }
      if (!res.ok) throw new Error(data.error || text || `Ошибка ${res.status}`);
      const url = data.url ?? '';
      if (!url) return;
      const attr = (window.prompt('Атрибуция (например: Фото: Author/Shutterstock):', '') ?? '').trim();
      const desc = (window.prompt('Описание подписи:', '') ?? '').trim();
      editor?.chain().focus().setImage({
        src: url,
        ...(attr && { captionAttribution: attr }),
        ...(desc && { captionDescription: desc }),
      }).run();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось загрузить изображение';
      window.alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkModalText, setLinkModalText] = useState('');
  const [linkModalHref, setLinkModalHref] = useState('');
  const linkModalIsEdit = useRef(false);

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').run();
    const isLink = editor.isActive('link');
    linkModalIsEdit.current = isLink;
    const href = isLink ? (editor.getAttributes('link').href ?? '') : '';
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, ' ');
    setLinkModalText(text);
    setLinkModalHref(href);
    setLinkModalOpen(true);
  }, [editor]);

  const clearStoredMarksAfterLink = useCallback((ed: ReturnType<typeof useEditor>) => {
    if (!ed) return;
    setTimeout(() => {
      if (!ed.view) return;
      const { from, to } = ed.state.selection;
      if (from !== to) return;
      const tr = ed.state.tr.setStoredMarks([]);
      ed.view.dispatch(tr);
    }, 10);
  }, []);

  const applyLinkModal = useCallback(() => {
    if (!editor) return;
    const url = linkModalHref.trim();
    const linkText = linkModalText.trim();
    setLinkModalOpen(false);
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    const ZERO_WIDTH_SPACE = '\u200B';

    if (linkModalIsEdit.current) {
      editor.chain().focus().extendMarkRange('link').run();
      const from = editor.state.selection.from;
      const insertText = linkText || url;
      const len = insertText.length;
      editor.chain().focus().insertContent(insertText).run();
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to: from + len })
        .setLink({ href: url })
        .run();
      const after = from + len;
      editor.chain().focus().setTextSelection(after).insertContent(ZERO_WIDTH_SPACE).run();
      clearStoredMarksAfterLink(editor);
    } else {
      const { from } = editor.state.selection;
      const insertText = linkText || url;
      const len = insertText.length;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: insertText,
          marks: [{ type: 'link', attrs: { href: url } }],
        })
        .run();
      const after = from + len;
      editor.chain().focus().setTextSelection(after).insertContent(ZERO_WIDTH_SPACE).run();
      clearStoredMarksAfterLink(editor);
    }
  }, [editor, linkModalHref, linkModalText, clearStoredMarksAfterLink]);

  useEffect(() => {
    if (!linkModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLinkModalOpen(false);
      if (e.key === 'Enter' && (e.target as HTMLElement)?.closest(`.${styles.linkModal}`)) {
        e.preventDefault();
        applyLinkModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [linkModalOpen, applyLinkModal]);

  const setLink = useCallback(() => {
    openLinkModal();
  }, [openLinkModal]);

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  useEffect(() => {
    if (!editor) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!editor.isFocused) return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        editor.chain().focus().toggleBold().run();
        return;
      }
      if (key === 'i') {
        e.preventDefault();
        editor.chain().focus().toggleItalic().run();
        return;
      }
      if (key === 'u') {
        e.preventDefault();
        setLink();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [editor, setLink]);

  if (!editor) return <div className={styles.loading}>Загрузка редактора...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.active : ''}
          title="Жирный (Ctrl+B / ⌘B)"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.active : ''}
          title="Курсив (Ctrl+I / ⌘I)"
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? styles.active : ''}
          title="Зачёркнутый"
        >
          <s>S</s>
        </button>
        <span className={styles.separator} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? styles.active : ''}
          title="Маркированный список"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? styles.active : ''}
          title="Нумерованный список"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? styles.active : ''}
          title="Цитата"
        >
          „
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? styles.active : ''}
          title="Блок кода"
        >
          {'</>'}
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Горизонтальная линия"
        >
          —
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Очистить форматирование"
        >
          ✕
        </button>
        <span className={styles.separator} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
          title="Заголовок 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? styles.active : ''}
          title="Заголовок 3"
        >
          H3
        </button>
        <span className={styles.separator} />
        <button type="button" onClick={setLink} className={editor.isActive('link') ? styles.active : ''} title="Вставить или изменить ссылку (Ctrl+U / ⌘U)">
          🔗
        </button>
        <button type="button" onClick={removeLink} disabled={!editor.isActive('link')} title="Убрать ссылку">
          🔗✕
        </button>
        <div ref={imageMenuRef} className={styles.imageMenuWrap}>
          <button
            type="button"
            onClick={() => setImageMenuOpen((v) => !v)}
            disabled={uploading}
            className={imageMenuOpen ? styles.active : ''}
            title="Вставить изображение"
          >
            🖼
          </button>
          {imageMenuOpen && (
            <div className={styles.imageMenu}>
              <button type="button" onClick={addImageByUrl}>
                По URL
              </button>
              <button type="button" onClick={openUploadDialog}>
                Загрузить с компьютера
              </button>
            </div>
          )}
        </div>
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleUploadImage}
          className={styles.hiddenFileInput}
          aria-hidden
        />
        <button type="button" onClick={addEmbed} title="Вставить embed (YouTube, Vimeo и др.)">
          📺
        </button>
        <button type="button" onClick={addInstagramEmbed} title="Вставить пост Instagram">
          Instagram
        </button>
      </div>
      <EditorContent editor={editor} className={styles.editor} />

      {linkModalOpen && (
        <div className={styles.linkModalOverlay} onClick={() => setLinkModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="link-modal-title">
          <div className={styles.linkModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.linkModalHeader}>
              <h2 id="link-modal-title" className={styles.linkModalTitle}>Ссылка</h2>
              <button type="button" className={styles.linkModalClose} onClick={() => setLinkModalOpen(false)} aria-label="Закрыть">×</button>
            </div>
            <div className={styles.linkModalBody}>
              <label className={styles.linkModalLabel}>Текст</label>
              <input
                type="text"
                className={styles.linkModalInput}
                value={linkModalText}
                onChange={(e) => setLinkModalText(e.target.value)}
                placeholder="текст ссылки"
                autoFocus
              />
              <label className={styles.linkModalLabel}>Ссылка (URL)</label>
              <input
                type="url"
                className={styles.linkModalInput}
                value={linkModalHref}
                onChange={(e) => setLinkModalHref(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className={styles.linkModalFooter}>
              <button type="button" className={styles.linkModalOk} onClick={applyLinkModal}>OK</button>
            </div>
          </div>
        </div>
      )}

      {instagramModalOpen && (
        <div className={styles.linkModalOverlay} onClick={() => setInstagramModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="instagram-modal-title">
          <div className={styles.linkModal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className={styles.linkModalHeader}>
              <h2 id="instagram-modal-title" className={styles.linkModalTitle}>Вставить пост Instagram</h2>
              <button type="button" className={styles.linkModalClose} onClick={() => setInstagramModalOpen(false)} aria-label="Закрыть">×</button>
            </div>
            <div className={styles.linkModalBody} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <label className={styles.linkModalLabel}>
                Вставьте сюда код из Instagram (кнопка «Копировать код вставки» в диалоге поста)
              </label>
              <textarea
                className={styles.instagramCodeInput}
                value={instagramModalCode}
                onChange={(e) => setInstagramModalCode(e.target.value)}
                placeholder='<blockquote class="instagram-media" data-instgrm-permalink="...">...</blockquote>'
                rows={6}
                autoFocus
              />
            </div>
            <div className={styles.linkModalFooter}>
              <button type="button" className={styles.linkModalOk} onClick={applyInstagramEmbed}>
                Вставить пост
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
