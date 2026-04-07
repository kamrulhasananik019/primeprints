'use client';

import React, { useState } from 'react';
import { faqData } from '@/utils/faq';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
            <button
              className="w-full text-left py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className="text-xl text-gray-600 transition-transform duration-300 ease-in-out">{openIndex === index ? '−' : '+'}</span>
              </div>
            </button>
            <div className={`px-6 text-gray-700 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'pb-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
