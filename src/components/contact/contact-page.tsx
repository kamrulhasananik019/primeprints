"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Printer,
  Send,
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    label: "Call the studio",
    value: "+44 (20) 555-0147",
    href: "tel:+44205550147",
    helper: "Monday to Friday, 8:00 AM to 6:00 PM",
  },
  {
    icon: Mail,
    label: "Send your brief",
    value: "hello@primeprints.co.uk",
    href: "mailto:hello@primeprints.co.uk",
    helper: "Share artwork, quantities, and deadlines",
  },
  {
    icon: MapPin,
    label: "Visit the shop",
    value: "123 Printing Street, London, UK",
    href: "https://maps.google.com/?q=London%2C%20UK",
    helper: "Samples, pickups, and paper consultations",
  },
];

const officeHours = [
  { day: "Monday to Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactPageContent() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition mb-8"
          >
            <ArrowRight className="size-4 rotate-180" />
            Back to home
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Contact Prime Prints
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Speak to a print team that understands deadlines, details, and delivery. 
              Whether you need a custom quote, file checks, or production planning, 
              we're here to help.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a request</h2>
              
              {isSubmitted && (
                <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Send className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Thank you! Your request has been sent successfully. We'll be in touch soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={handleSubmit} onChange={() => setIsSubmitted(false)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="Alex Morgan"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="North Studio"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="alex@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone number</label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="+44 20 5550 0147"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service needed</label>
                  <div className="mt-1">
                    <select
                      id="service"
                      name="service"
                      required
                      defaultValue=""
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border bg-white"
                    >
                      <option value="" disabled>Select a service</option>
                      <option value="business-cards">Business cards</option>
                      <option value="brochures">Brochures</option>
                      <option value="banners">Banners and signage</option>
                      <option value="booklets">Booklets</option>
                      <option value="custom-quote">Custom quote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Needed by</label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700">Project details</label>
                  <div className="mt-1">
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 border"
                      placeholder="Tell us quantities, sizes, finishes, delivery preferences, and any artwork support needed."
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Info & Map */}
          <div className="mt-12 lg:mt-0 lg:col-span-1 space-y-8">
            
            {/* Contact Methods Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
              <dl className="space-y-6">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.label} className="flex gap-x-4">
                      <dt className="flex-none">
                        <span className="sr-only">{method.label}</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                          <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </div>
                      </dt>
                      <dd className="flex-auto">
                        <p className="text-sm font-semibold text-gray-900">
                          <a href={method.href} className="hover:text-blue-600 transition">{method.value}</a>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">{method.helper}</p>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock3 className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Studio Hours</h3>
              </div>
              <ul className="space-y-3">
                {officeHours.map((entry) => (
                  <li key={entry.day} className="flex justify-between text-sm">
                    <span className="text-gray-500">{entry.day}</span>
                    <span className="font-medium text-gray-900">{entry.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 w-full bg-gray-200 relative">
                 <iframe
                  title="Prime Prints location map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.839887706!2d-0.266403!3d51.528308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Drop in for samples, pickups, and paper advice.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}