type FaqAccordionItem = {
  id?: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqAccordionItem[];
  title?: string;
  emptyMessage?: string;
};

export default function FaqAccordion({ items, title, emptyMessage = 'No FAQ entries are available yet.' }: FaqAccordionProps) {
  return (
    <div className="container mx-auto p-4 py-12">
      {title ? <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">{title}</h2> : null}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={item.id || `${item.question}-${index}`}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg bg-gray-50 px-6 py-4 font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="text-xl text-gray-500 transition-transform duration-300 group-open:rotate-180" aria-hidden>
                  ▼
                </span>
              </summary>
              <div className="border-t border-gray-100 px-6 pb-4 pt-3 text-gray-700">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center text-sm text-gray-500">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}