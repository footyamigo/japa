'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'User';
  const age = searchParams.get('age');
  const education = searchParams.get('education');
  const country = searchParams.get('country');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Recommendations</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700 mb-4">
            Welcome, {name}! Your recommendations are being prepared.
          </p>
          {age && <p className="text-gray-600">Age: {age}</p>}
          {education && <p className="text-gray-600">Education: {education}</p>}
          {country && <p className="text-gray-600">Country: {country}</p>}
          <p className="text-gray-500 mt-4 text-sm">
            Recommendations page coming soon - this will show visa recommendations based on your profile.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RecommendationsContent />
    </Suspense>
  );
}

