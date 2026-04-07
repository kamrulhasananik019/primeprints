'use client';

import React from 'react';

export default function LocationMap() {
  return (
    <div className=" mx-auto p-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Location</h2>
          <div className="text-center mb-6">
        <p className="text-gray-600">Visit us in the heart of London for all your printing needs.</p>
        <p className="text-gray-600 mt-2">Address: 123 Printing Street, London, UK</p>
      </div>
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.839887706!2d-0.266403!3d51.528308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="London Location Map"
        ></iframe>
      </div>
  
    </div>
  );
}
