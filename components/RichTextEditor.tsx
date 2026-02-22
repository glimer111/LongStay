'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { ImageFigure } from '@/lib/tiptap-image-figure';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
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
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
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

  const setLink = () => {
    const url = window.prompt('URL ссылки:');
    if (url) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) return <div className={styles.loading}>Загрузка редактора...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.active : ''}
          title="Жирный"
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.active : ''}
          title="Курсив"
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
        <button type="button" onClick={setLink} className={editor.isActive('link') ? styles.active : ''} title="Вставить ссылку">
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
      </div>
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
}
