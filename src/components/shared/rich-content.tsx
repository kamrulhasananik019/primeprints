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
