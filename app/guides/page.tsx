'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/services/firebase';
import { getVisasByCountry, Visa } from '@/lib/services/visas';
import Chat from '@/components/Chat';

export default function GuidesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<'UK' | 'CA' | null>(null);
  const [ukVisas, setUkVisas] = useState<Visa[]>([]);
  const [caVisas, setCaVisas] = useState<Visa[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      // Redirect to login page
      router.push('/guides/login');
      return;
    }

    // User is authenticated, grant access
    setLoading(false);
    
    // Always load fresh data from Firestore for both countries
    // Clear any existing data first
    setUkVisas([]);
    setCaVisas([]);
    
    // Load all visas for both countries when user is authenticated
    loadVisas('UK');
    loadVisas('CA');
  }, [user, authLoading, router]);

  const loadVisas = async (country: 'UK' | 'CA') => {
    setLoadingVisas(true);
    try {
      // Fetch visas from Firestore
      // Try both 'UK' and 'GB' for UK (in case data uses different code)
      let countryCode = country === 'UK' ? 'UK' : 'CA';
      let visas = await getVisasByCountry(countryCode);
      
      // If UK returns empty, try 'GB' as alternative
      if (country === 'UK' && visas.length === 0) {
        console.log('No visas found with UK code, trying GB...');
        visas = await getVisasByCountry('GB');
      }
      
      // Filter out Youth Mobility Scheme Visa from UK routes
      if (country === 'UK') {
        visas = visas.filter(visa => 
          !visa.visaName.toLowerCase().includes('youth mobility') &&
          !visa.visaName.toLowerCase().includes('yms')
        );
      }
      
      console.log(`Loaded ${visas.length} visas for ${country} (code: ${countryCode})`);
      if (visas.length > 0) {
        console.log('Sample visa data:', {
          id: visas[0].id,
          visaName: visas[0].visaName,
          countryCode: visas[0].countryCode,
          totalEstimatedCost: visas[0].totalEstimatedCost,
          applicationFee: visas[0].applicationFee,
          currency: visas[0].currency,
          processingTime: visas[0].processingTime,
          visaType: visas[0].visaType,
        });
        console.log('All visa names:', visas.map(v => v.visaName));
      } else {
        console.warn(`No visas found for ${country} with code ${countryCode}`);
      }
      
      if (country === 'UK') {
        setUkVisas(visas);
      } else {
        setCaVisas(visas);
      }
    } catch (error) {
      console.error('Error loading visas:', error);
      // Set empty array on error
      if (country === 'UK') {
        setUkVisas([]);
      } else {
        setCaVisas([]);
      }
    } finally {
      setLoadingVisas(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    router.push('/guides/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // User is authenticated, show guides

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile: Logout at top right */}
          <div className="flex sm:hidden items-center justify-between mb-3">
            <div className="flex-1"></div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {/* Main header content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Visa Guides</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">UK & Canada Visa Guides + 24/7 Support</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold whitespace-nowrap">Access Granted</span>
              </div>
              {/* Desktop: Logout button */}
              <button
                onClick={handleLogout}
                className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCountry ? (
          // Country Selection
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Country</h2>
              <p className="text-gray-600">Choose which visa guides you'd like to explore</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* UK Card */}
              <button
                onClick={() => setSelectedCountry('UK')}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-indigo-200 hover:border-indigo-400 transition-all text-left group"
              >
                <div className="mb-4">
                  <img src="/uk.webp" alt="UK Flag" className="w-16 h-16 object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">United Kingdom</h3>
                <p className="text-gray-600 mb-4">
                  Access comprehensive guides for all UK visa routes
                </p>
                <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                  <span>View Guides</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Canada Card */}
              <button
                onClick={() => setSelectedCountry('CA')}
                className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border-2 border-red-200 hover:border-red-400 transition-all text-left group"
              >
                <div className="mb-4">
                  <img src="/canada.webp" alt="Canada Flag" className="w-16 h-16 object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Canada</h3>
                <p className="text-gray-600 mb-4">
                  Access comprehensive guides for all Canada visa routes
                </p>
                <div className="flex items-center text-red-600 font-semibold group-hover:gap-2 transition-all">
                  <span>View Guides</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Support Group Info */}
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-300 flex-shrink-0">
                      <img 
                        src="/japa-girl.png" 
                        alt="Maya - Your Visa Expert" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Chat with Your Visa Expert 24/7</h3>
                      <p className="text-gray-700 mb-2">
                        Have questions? Chat with Maya, your personal visa expert, anytime. Get instant answers about requirements, documents, application processes, and any concerns you have.
                      </p>
                      <p className="text-sm text-indigo-600 font-medium">
                        Click the chat icon in the bottom right corner to start a conversation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
          // Visa Guides List
          <div>
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Countries</span>
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src={selectedCountry === 'UK' ? '/uk.webp' : '/canada.webp'} 
                  alt={selectedCountry === 'UK' ? 'UK Flag' : 'Canada Flag'} 
                  className="w-8 h-8 object-contain" 
                />
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedCountry === 'UK' ? 'United Kingdom' : 'Canada'} Visa Guides
                </h2>
              </div>
              <p className="text-gray-600">
                {selectedCountry === 'UK' ? ukVisas.length : caVisas.length} comprehensive guides available
              </p>
            </div>

            {loadingVisas ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedCountry === 'UK' ? ukVisas : caVisas).map((visa) => (
                  <div
                    key={visa.id}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{visa.visaName}</h3>
                    {visa.description && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{visa.description}</p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{visa.processingTime || 'N/A'}</span>
                      </div>
                      {visa.visaType && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            visa.isStudyRoute ? 'bg-blue-100 text-blue-700' :
                            visa.isWorkRoute ? 'bg-green-100 text-green-700' :
                            visa.isFamilyRoute ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {visa.visaType}
                          </span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        router.push(`/guides/${visa.id}`);
                      }}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      View Guide
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Chat Bubble */}
      <Chat />
    </div>
  );
}

