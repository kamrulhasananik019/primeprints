'use client';

import { useEditorState, type Editor } from '@tiptap/react';

import { menuBarStateSelector } from '@/components/editor/menu-bar-state';
import styles from '@/components/editor/tiptap-editor.module.css';

type Props = {
  editor: Editor | null;
};

type ButtonConfig = {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
};

function ToolbarButton({ label, onClick, isActive, disabled }: ButtonConfig) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={Boolean(isActive)}
      data-active={isActive ? 'true' : 'false'}
      className={`${styles.toolbarButton} ${isActive ? styles.active : styles.inactive}`}
    >
      {label}
    </button>
  );
}

export function MenuBar({ editor }: Props) {
  const state = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !state) return null;

  return (
    <div className={styles.controlGroup}>
      <div className={styles.buttonGroup}>
        <ToolbarButton label="Bold" onClick={() => (editor.chain() as any).focus().toggleBold().run()} isActive={state.isBold} disabled={!state.canBold} />
        <ToolbarButton label="Italic" onClick={() => (editor.chain() as any).focus().toggleItalic().run()} isActive={state.isItalic} disabled={!state.canItalic} />
        <ToolbarButton label="Strike" onClick={() => (editor.chain() as any).focus().toggleStrike().run()} isActive={state.isStrike} disabled={!state.canStrike} />
        <ToolbarButton label="Code" onClick={() => (editor.chain() as any).focus().toggleCode().run()} isActive={state.isCode} disabled={!state.canCode} />
        <ToolbarButton label="Underline" onClick={() => (editor.chain() as any).focus().toggleUnderline().run()} isActive={state.isUnderline} disabled={!state.canUnderline} />
        <ToolbarButton label="Clear marks" onClick={() => editor.chain().focus().unsetAllMarks().run()} />
        <ToolbarButton label="Clear nodes" onClick={() => editor.chain().focus().clearNodes().run()} />
        <ToolbarButton label="Paragraph" onClick={() => (editor.chain() as any).focus().setParagraph().run()} isActive={state.isParagraph} />
        <ToolbarButton label="H1" onClick={() => (editor.chain() as any).focus().toggleHeading({ level: 1 }).run()} isActive={state.isHeading1} />
        <ToolbarButton label="H2" onClick={() => (editor.chain() as any).focus().toggleHeading({ level: 2 }).run()} isActive={state.isHeading2} />
        <ToolbarButton label="H3" onClick={() => (editor.chain() as any).focus().toggleHeading({ level: 3 }).run()} isActive={state.isHeading3} />
        <ToolbarButton label="H4" onClick={() => (editor.chain() as any).focus().toggleHeading({ level: 4 }).run()} isActive={state.isHeading4} />
        <ToolbarButton label="Bullet list" onClick={() => (editor.chain() as any).focus().toggleBulletList().run()} isActive={state.isBulletList} />
        <ToolbarButton label="Ordered list" onClick={() => (editor.chain() as any).focus().toggleOrderedList().run()} isActive={state.isOrderedList} />
        <ToolbarButton label="Code block" onClick={() => (editor.chain() as any).focus().toggleCodeBlock().run()} isActive={state.isCodeBlock} />
        <ToolbarButton label="Blockquote" onClick={() => (editor.chain() as any).focus().toggleBlockquote().run()} isActive={state.isBlockquote} />
        <ToolbarButton label="Horizontal rule" onClick={() => (editor.chain() as any).focus().setHorizontalRule().run()} />
        <ToolbarButton label="Hard break" onClick={() => (editor.chain() as any).focus().setHardBreak().run()} />
        <ToolbarButton label="Insert table" onClick={() => (editor.chain() as any).focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} disabled={!state.canInsertTable} />
        <ToolbarButton label="Add row" onClick={() => (editor.chain() as any).focus().addRowAfter().run()} disabled={!state.canAddRow} />
        <ToolbarButton label="Delete row" onClick={() => (editor.chain() as any).focus().deleteRow().run()} disabled={!state.canDeleteRow} />
        <ToolbarButton label="Add column" onClick={() => (editor.chain() as any).focus().addColumnAfter().run()} disabled={!state.canAddColumn} />
        <ToolbarButton label="Delete column" onClick={() => (editor.chain() as any).focus().deleteColumn().run()} disabled={!state.canDeleteColumn} />
        <ToolbarButton label="Delete table" onClick={() => (editor.chain() as any).focus().deleteTable().run()} disabled={!state.isInTable} />
        <div style={{ width: 1, margin: '0 8px' }} />
        <ToolbarButton label="Align L" onClick={() => (editor.chain() as any).focus().setTextAlign('left').run()} isActive={state.isAlignLeft} disabled={!state.canSetAlign} />
        <ToolbarButton label="Align C" onClick={() => (editor.chain() as any).focus().setTextAlign('center').run()} isActive={state.isAlignCenter} disabled={!state.canSetAlign} />
        <ToolbarButton label="Align R" onClick={() => (editor.chain() as any).focus().setTextAlign('right').run()} isActive={state.isAlignRight} disabled={!state.canSetAlign} />
        <ToolbarButton label="Justify" onClick={() => (editor.chain() as any).focus().setTextAlign('justify').run()} isActive={state.isAlignJustify} disabled={!state.canSetAlign} />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} />
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} />
      </div>
    </div>
  );
}
