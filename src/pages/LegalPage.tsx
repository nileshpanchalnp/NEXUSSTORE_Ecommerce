import React from 'react';

export const LegalPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="prose prose-blue text-gray-600 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. General Overview</h2>
          <p>Welcome to NexusStore. These guidelines govern your use of our platform. By accessing our site, you agree to comply with our standards of service and data protection policies.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Data Collection</h2>
          <p>We collect information only necessary to provide you with the best shopping experience. This includes your contact details for shipping and payment information for secure transactions.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Responsibilities</h2>
          <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
        </section>
      </div>
    </div>
  );
};