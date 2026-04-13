'use client';

import ReactMarkdown from 'react-markdown';
import { useMemo, useState } from 'react';

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

export default function RichEditorField({ label, value, onChange, minRows = 8 }: Props) {
  const [mode, setMode] = useState<Mode>('markdown');

  const parsedTiptapValid = useMemo(() => {
    if (mode !== 'tiptap') return true;
    try {
      const parsed = JSON.parse(value || '{}') as { type?: string };
      return parsed.type === 'doc';
    } catch {
      return false;
    }
  }, [mode, value]);

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

      {mode === 'tiptap' && (
        <button
          type="button"
          className="mb-2 rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700"
          onClick={() => onChange(tiptapTemplate)}
        >
          Insert Tiptap template
        </button>
      )}

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={minRows}
        className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500"
        placeholder={mode === 'markdown' ? 'Write markdown...' : 'Paste Tiptap doc JSON...'}
      />

      {mode === 'tiptap' && !parsedTiptapValid ? <p className="mt-2 text-xs text-red-600">Invalid Tiptap JSON (must be a doc object).</p> : null}

      {mode === 'markdown' ? (
        <div className="prose prose-sm mt-3 max-w-none rounded-lg border border-stone-200 bg-white p-3">
          <ReactMarkdown>{value || '_Preview appears here_'}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
