import type { RichDescription } from '@/data/categories';

export function richContentToPlainText(content?: RichDescription): string {
  if (!content) {
    return '';
  }

  if (typeof content === 'string') {
    return content;
  }

  return content
    .map((block) => {
      if (block.type === 'text') {
        return block.content;
      }

      return block.items.join(', ');
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isSameRichContent(a?: RichDescription, b?: RichDescription): boolean {
  return richContentToPlainText(a) === richContentToPlainText(b);
}
