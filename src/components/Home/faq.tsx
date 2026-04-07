'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: "What types of printing services do you offer?",
    answer: "We offer a wide range of printing services including digital printing, offset printing, screen printing, and custom printing for banners, brochures, business cards, posters, and more."
  },
  {
    question: "How long does it take to complete an order?",
    answer: "Order turnaround times vary depending on the complexity and quantity. Standard orders typically take 3-5 business days, while rush orders can be completed in 1-2 days for an additional fee."
  },
  {
    question: "What is your pricing structure?",
    answer: "Our pricing depends on the type of printing, quantity, size, and materials used. We offer competitive rates and volume discounts for bulk orders. Contact us for a custom quote."
  },
  {
    question: "Do you offer custom printing?",
    answer: "Yes, we specialize in custom printing solutions tailored to your specific needs, including unique designs, sizes, and materials."
  },
  {
    question: "What materials do you use?",
    answer: "We use high-quality materials such as premium paper stocks, cardstock, vinyl, canvas, and various inks to ensure durability and vibrant colors."
  },
  {
    question: "How can I place an order?",
    answer: "You can place an order by contacting us through our website, email, or phone. We'll discuss your requirements and provide a quote before proceeding."
  },
  {
    question: "What is your return policy?",
    answer: "We strive for customer satisfaction. If there's an issue with your order due to our error, we'll reprint or refund. Please review your proof before final printing."
  },
  {
    question: "Do you provide design services?",
    answer: "Yes, our team of designers can help create or refine your designs to ensure they meet your vision and print perfectly."
  }
];

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
