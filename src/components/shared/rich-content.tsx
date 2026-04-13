import ReactMarkdown from 'react-markdown';

import type { RichDescription, TipTapNode } from '@/types/rich-content';

type RichContentProps = {
  content: RichDescription;
  textClassName: string;
  listClassName?: string;
  listItemClassName?: string;
  wrapperClassName?: string;
};

export default function RichContent({
  content,
  textClassName,
  listClassName,
  listItemClassName,
  wrapperClassName,
}: RichContentProps) {
  const renderTipTapNodes = (nodes: TipTapNode[], keyPrefix: string): React.ReactNode => {
    return nodes.map((node, index) => {
      const key = `${keyPrefix}-${node.type}-${index}`;

      if (node.type === 'heading') {
        const level = Number((node.attrs as { level?: number } | undefined)?.level ?? 2);
        const content = renderTipTapNodes(node.content ?? [], `${key}-content`);

        if (level === 3) {
          return (
            <h3 key={key} className="sans text-xl font-700 text-stone-900">
              {content}
            </h3>
          );
        }

        if (level >= 4) {
          return (
            <h4 key={key} className="sans text-lg font-700 text-stone-900">
              {content}
            </h4>
          );
        }

        return (
          <h2 key={key} className="sans text-2xl font-700 text-stone-900">
            {content}
          </h2>
        );
      }

      if (node.type === 'paragraph') {
        return (
          <p key={key} className={textClassName}>
            {renderTipTapNodes(node.content ?? [], `${key}-content`)}
          </p>
        );
      }

      if (node.type === 'bulletList') {
        return (
          <ul key={key} className={listClassName || 'list-disc pl-5'}>
            {renderTipTapNodes(node.content ?? [], `${key}-content`)}
          </ul>
        );
      }

      if (node.type === 'listItem') {
        return (
          <li key={key} className={listItemClassName || textClassName}>
            {renderTipTapNodes(node.content ?? [], `${key}-content`)}
          </li>
        );
      }

      if (node.type === 'text') {
        return <span key={key}>{node.text ?? ''}</span>;
      }

      if (node.content?.length) {
        return <span key={key}>{renderTipTapNodes(node.content, `${key}-content`)}</span>;
      }

      return null;
    });
  };

  if (typeof content === 'string') {
    return (
      <div className={wrapperClassName}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className={textClassName}>{children}</p>,
            ul: ({ children }) => <ul className={listClassName || 'list-disc pl-5'}>{children}</ul>,
            li: ({ children }) => <li className={listItemClassName || textClassName}>{children}</li>,
            h2: ({ children }) => <h2 className="sans text-2xl font-700 text-stone-900">{children}</h2>,
            h3: ({ children }) => <h3 className="sans text-xl font-700 text-stone-900">{children}</h3>,
            h4: ({ children }) => <h4 className="sans text-lg font-700 text-stone-900">{children}</h4>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      {content.map((block, index) => {
        if (block.type === 'text') {
          return (
            <p key={`text-${index}`} className={textClassName}>
              {block.content}
            </p>
          );
        }

        if (block.type === 'header') {
          const HeaderTag = block.level === 3 ? 'h3' : block.level === 4 ? 'h4' : 'h2';
          return (
            <HeaderTag key={`header-${index}`} className="sans text-xl font-700 text-stone-900">
              {block.content}
            </HeaderTag>
          );
        }

        if (block.type === 'faq') {
          return (
            <details key={`faq-${index}`} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <summary className="sans cursor-pointer list-none pr-6 text-sm font-700 text-stone-900">
                {block.question}
              </summary>
              <p className="sans mt-3 text-sm leading-relaxed text-stone-600">{block.answer}</p>
            </details>
          );
        }

        if (block.type === 'markdown') {
          return (
            <ReactMarkdown
              key={`markdown-${index}`}
              components={{
                p: ({ children }) => <p className={textClassName}>{children}</p>,
                ul: ({ children }) => <ul className={listClassName || 'list-disc pl-5'}>{children}</ul>,
                li: ({ children }) => <li className={listItemClassName || textClassName}>{children}</li>,
                h2: ({ children }) => <h2 className="sans text-2xl font-700 text-stone-900">{children}</h2>,
                h3: ({ children }) => <h3 className="sans text-xl font-700 text-stone-900">{children}</h3>,
                h4: ({ children }) => <h4 className="sans text-lg font-700 text-stone-900">{children}</h4>,
              }}
            >
              {block.content}
            </ReactMarkdown>
          );
        }

        if (block.type === 'tiptap') {
          return <div key={`tiptap-${index}`}>{renderTipTapNodes(block.content.content, `tiptap-${index}`)}</div>;
        }

        return (
          <ul key={`list-${index}`} className={listClassName || 'list-disc pl-5'}>
            {block.items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`} className={listItemClassName || textClassName}>
                {item}
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
