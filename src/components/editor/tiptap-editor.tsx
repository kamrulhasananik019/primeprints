'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useMemo, useRef } from 'react';

import { MenuBar } from '@/components/editor/menu-bar';
import styles from '@/components/editor/tiptap-editor.module.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
};

function toDocFromText(value: string) {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: value ? [{ type: 'text', text: value }] : [],
      },
    ],
  };
}

function parseToEditorContent(value: string) {
  try {
    const parsed = JSON.parse(value || '{}') as { type?: string };
    if (parsed.type === 'doc') return parsed;
  } catch {
    // Fallback below.
  }
  return toDocFromText(value);
}

export function TipTapEditor({ value, onChange, minHeight = 180 }: Props) {
  const syncingRef = useRef(false);
  const initialContent = useMemo(() => parseToEditorContent(value), [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        underline: false,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate({ editor: current }) {
      if (syncingRef.current) return;
      onChange(JSON.stringify(current.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = parseToEditorContent(value);
    const currentJson = JSON.stringify(editor.getJSON());
    const nextJson = JSON.stringify(next);
    if (currentJson === nextJson) return;
    syncingRef.current = true;
    editor.commands.setContent(next);
    syncingRef.current = false;
  }, [editor, value]);

  return (
    <div className={styles.wrapper}>
      <MenuBar editor={editor} />
      <div className={styles.editorContainer}>
        <div className={styles.textareaLike} style={{ minHeight }}>
          <EditorContent
            editor={editor}
            className={`${styles.tiptap} ${styles.proseMirror}`}
          />
        </div>
      </div>
    </div>
  );
}
