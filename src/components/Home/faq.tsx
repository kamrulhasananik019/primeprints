import { faqData } from '@/utils/faq';

export default function Faq() {
  return (
    <div className="container mx-auto p-4 py-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-gray-200 bg-white shadow-sm open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg bg-gray-50 px-6 py-4 font-semibold text-gray-800 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span
                className="text-xl text-gray-500 transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              >
                ▼
              </span>
            </summary>
            <div className="border-t border-gray-100 px-6 pb-4 pt-3 text-gray-700">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
