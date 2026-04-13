export type TipTapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
};

export type TipTapDoc = {
  type: 'doc';
  content: TipTapNode[];
};

export type RichDescriptionBlock =
  | {
      type: 'text';
      content: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'header';
      content: string;
      level?: 2 | 3 | 4;
    }
  | {
      type: 'faq';
      question: string;
      answer: string;
    }
  | {
      type: 'markdown';
      content: string;
    }
  | {
      type: 'tiptap';
      content: TipTapDoc;
    };

export type RichDescription = string | RichDescriptionBlock[] | TipTapDoc;
