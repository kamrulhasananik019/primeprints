import type { RichDescription } from '@/data/categories';

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
  if (typeof content === 'string') {
    return <p className={textClassName}>{content}</p>;
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
