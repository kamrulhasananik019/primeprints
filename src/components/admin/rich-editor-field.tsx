'use client';

import { useMemo, useState } from 'react';
import { TipTapEditor } from '@/components/editor/tiptap-editor';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
};

const tiptapTemplate = `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Write your rich text content here."}]}]}`;

export default function RichEditorField({ label, value, onChange, minRows = 8 }: Props) {
  const [showJson, setShowJson] = useState(false);

  const parsedTiptapValid = useMemo(() => {
    const raw = (value || '').trim();
    if (!raw) return true;

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (parsed && typeof parsed === 'object') {
        return (parsed as { type?: string }).type === 'doc';
      }

      if (typeof parsed === 'string') {
        const nested = parsed.trim();
        if (!nested) return true;
        try {
          const nestedParsed = JSON.parse(nested) as { type?: string };
          return nestedParsed?.type === 'doc';
        } catch {
          // A JSON string value is still safely convertible to TipTap text content.
          return true;
        }
      }

      return true;
    } catch {
      // Non-JSON plain text is safely convertible to TipTap text content.
      return true;
    }
  }, [value]);
  const editorMinHeight = Math.max(160, minRows * 24);

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{label}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJson((current) => !current)}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-700"
          >
            {showJson ? 'Hide JSON' : 'View JSON'}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <TipTapEditor value={value} onChange={onChange} minHeight={editorMinHeight} />
        <div className="flex justify-end">
          <button type="button" onClick={() => onChange(tiptapTemplate)} className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs">
            Reset Template
          </button>
        </div>
        {showJson ? (
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={Math.max(4, Math.floor(minRows / 2))}
            className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs outline-none focus:border-cyan-500"
            placeholder="Tiptap doc JSON"
          />
        ) : null}
      </div>

      {showJson && !parsedTiptapValid ? <p className="mt-2 text-xs text-red-600">Invalid Tiptap JSON (must be a doc object).</p> : null}
    </div>
  );
}
