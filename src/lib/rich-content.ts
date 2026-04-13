import type { RichDescription, TipTapNode } from '@/types/rich-content';

export type FAQItem = {
  question: string;
  answer: string;
};

function tiptapToPlainText(nodes: TipTapNode[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') {
        return node.text ?? '';
      }

      if (!node.content?.length) {
        return '';
      }

      return tiptapToPlainText(node.content);
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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

      if (block.type === 'header') {
        return block.content;
      }

      if (block.type === 'faq') {
        return `${block.question} ${block.answer}`;
      }

      if (block.type === 'markdown') {
        return block.content;
      }

      if (block.type === 'tiptap') {
        return tiptapToPlainText(block.content.content);
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

export function extractFAQsFromRichContent(content?: RichDescription): FAQItem[] {
  if (!content || typeof content === 'string') {
    return [];
  }

  const faqItems: FAQItem[] = [];

  for (const block of content) {
    if (block.type === 'faq') {
      const question = block.question.replace(/\s+/g, ' ').trim();
      const answer = block.answer.replace(/\s+/g, ' ').trim();
      if (question && answer) {
        faqItems.push({ question, answer });
      }
      continue;
    }

    if (block.type !== 'list') {
      continue;
    }

    for (const item of block.items) {
      const normalized = item.replace(/\s+/g, ' ').trim();
      const qIndex = normalized.indexOf('?');

      if (qIndex < 0) {
        continue;
      }

      const question = normalized.slice(0, qIndex + 1).trim();
      const answer = normalized.slice(qIndex + 1).trim();

      if (!question || !answer) {
        continue;
      }

      faqItems.push({ question, answer });
    }
  }

  return faqItems;
}
