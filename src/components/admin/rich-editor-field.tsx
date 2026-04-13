'use client';

import ReactMarkdown from 'react-markdown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useMemo, useRef, useState } from 'react';

type Mode = 'markdown' | 'tiptap';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
};

const tiptapTemplate = `{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Write your rich text content here." }]
    }
  ]
}`;

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

export default function RichEditorField({ label, value, onChange, minRows = 8 }: Props) {
  const [mode, setMode] = useState<Mode>('markdown');
  const syncingRef = useRef(false);

  const parsedTiptapValid = useMemo(() => {
    if (mode !== 'tiptap') return true;
    try {
      const parsed = JSON.parse(value || '{}') as { type?: string };
      return parsed.type === 'doc';
    } catch {
      return false;
    }
  }, [mode, value]);

  const tiptapInitialContent = useMemo(() => {
    try {
      const parsed = JSON.parse(value || '{}') as { type?: string };
      if (parsed.type === 'doc') {
        return parsed;
      }
      return toDocFromText(value);
    } catch {
      return toDocFromText(value);
    }
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: tiptapInitialContent,
    immediatelyRender: false,
    onUpdate({ editor: current }) {
      if (syncingRef.current) return;
      onChange(JSON.stringify(current.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor || mode !== 'tiptap') return;
    try {
      const parsed = JSON.parse(value || '{}') as { type?: string };
      if (parsed.type === 'doc') {
        const current = JSON.stringify(editor.getJSON());
        const next = JSON.stringify(parsed);
        if (current === next) return;
        syncingRef.current = true;
        editor.commands.setContent(parsed);
        syncingRef.current = false;
      }
    } catch {
      // Ignore invalid JSON while user is typing.
    }
  }, [editor, mode, value]);

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{label}</p>
        <div className="flex rounded-lg border border-stone-300 bg-white p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('markdown')}
            className={`rounded-md px-2 py-1 ${mode === 'markdown' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setMode('tiptap')}
            className={`rounded-md px-2 py-1 ${mode === 'tiptap' ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
          >
            Tiptap JSON
          </button>
        </div>
      </div>

      {mode === 'tiptap' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 rounded-lg border border-stone-300 bg-white p-2">
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Bold</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Italic</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Underline</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Bullet</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Ordered</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H1</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H2</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H3</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H4</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H5</button>
            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">H6</button>
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Left</button>
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Center</button>
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Right</button>
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('justify').run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Justify</button>
            <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Paragraph</button>
            <button type="button" onClick={() => onChange(tiptapTemplate)} className="rounded-md border border-stone-300 px-2 py-1 text-xs">Reset Template</button>
          </div>
          <div className="rounded-lg border border-stone-300 bg-white p-3">
            <EditorContent editor={editor} className="admin-tiptap min-h-[180px] text-sm text-stone-800" />
          </div>
          <details className="rounded-lg border border-stone-200 bg-white p-2">
            <summary className="cursor-pointer text-xs text-stone-600">View JSON</summary>
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              rows={Math.max(4, Math.floor(minRows / 2))}
              className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-cyan-500"
              placeholder="Tiptap doc JSON"
            />
          </details>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={minRows}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
          placeholder="Write markdown..."
        />
      )}

      {mode === 'tiptap' && !parsedTiptapValid ? <p className="mt-2 text-xs text-red-600">Invalid Tiptap JSON (must be a doc object).</p> : null}

      {mode === 'markdown' ? (
        <div className="prose prose-sm mt-3 max-w-none rounded-lg border border-stone-200 bg-white p-3">
          <ReactMarkdown>{value || '_Preview appears here_'}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
