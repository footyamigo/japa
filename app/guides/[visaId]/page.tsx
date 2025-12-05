'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getVisaById, Visa, VisaStep } from '@/lib/services/visas';
import Chat from '@/components/Chat';

/**
 * Extract Vimeo video ID from URL
 */
function getVimeoVideoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Format step description with proper line breaks
 */
function formatStepDescription(description: string): string[] {
  if (!description) return [];
  
  let formatted = description;
  
  // Split by numbered steps (1), 2), 3), etc.)
  const stepPattern = /(\d+)\)\s*/g;
  formatted = formatted.replace(stepPattern, '\n\n$1) ');
  
  // Split by sentences followed by capital letters
  formatted = formatted.replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2');
  
  // Split after colons
  formatted = formatted.replace(/:\s+([A-Z])/g, ':\n\n$1');
  
  // Split by introductory phrases
  formatted = formatted.replace(/(Here's how:|For example:|This is important because:|To do this,|Next,|First,|Then,|After that,|Finally,)\s+/gi, '\n\n$1 ');
  
  // Clean up multiple consecutive line breaks
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Split into paragraphs
  const paragraphs = formatted
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  return paragraphs;
}

/**
 * Format currency based on country code
 */
function formatCurrency(amount: number | null | undefined, countryCode: string): string {
  if (!amount) return 'N/A';
  
  const formattedAmount = amount.toLocaleString();
  
  // UK uses £ symbol
  if (countryCode === 'UK' || countryCode === 'GB') {
    return `£${formattedAmount}`;
  }
  
  // Canada uses CAD
  if (countryCode === 'CA') {
    return `CAD ${formattedAmount}`;
  }
  
  // Fallback to original currency if available, otherwise use country code
  return `${formattedAmount}`;
}

export default function VisaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [visa, setVisa] = useState<Visa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    eligibility: true,
    documents: true,
    process: true,
    benefits: true,
    restrictions: true,
  });

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      router.push('/guides/login');
      return;
    }

    // Load visa data
    const loadVisa = async () => {
      try {
        const visaId = params.visaId as string;
        if (!visaId) {
          setError('Invalid visa ID');
          setLoading(false);
          return;
        }

        const visaData = await getVisaById(visaId);
        if (!visaData) {
          setError('Visa guide not found');
          setLoading(false);
          return;
        }

        setVisa(visaData);
      } catch (err: any) {
        console.error('Error loading visa:', err);
        setError('Failed to load visa guide');
      } finally {
        setLoading(false);
      }
    };

    loadVisa();
  }, [user, authLoading, router, params.visaId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !visa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Visa Guide Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The visa guide you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/guides')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Guides
          </button>
        </div>
      </div>
    );
  }

  const videoId = visa.videoUrl ? getVimeoVideoId(visa.videoUrl) : null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Guides</span>
            </button>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Access Granted</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              visa.isStudyRoute ? 'bg-blue-100 text-blue-700' :
              visa.isWorkRoute ? 'bg-green-100 text-green-700' :
              visa.isFamilyRoute ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {visa.visaType}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 font-medium">{visa.countryName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">{visa.visaName}</h1>
        </div>

        {/* Video Guide - Prominent */}
        {visa.videoUrl && videoId && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Video Guide</h2>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden shadow-xl bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`https://player.vimeo.com/video/${videoId}?autoplay=0&title=0&byline=0&portrait=0&responsive=1`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`${visa.visaName} Video Guide`}
              />
            </div>
          </div>
        )}

        {/* Overview - Collapsible */}
        {visa.description && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('overview')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Overview</h2>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.overview ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.overview && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{visa.description}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Application Fee</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(visa.applicationFee, visa.countryCode)}
            </p>
          </div>
          {visa.healthSurcharge && (
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Health Surcharge</p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(visa.healthSurcharge, visa.countryCode)}
              </p>
            </div>
          )}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Cost</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(visa.totalEstimatedCost, visa.countryCode)}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Processing Time</p>
            </div>
            <p className="text-xl font-bold text-gray-900">{visa.processingTime || 'N/A'}</p>
          </div>
        </div>

        {/* Eligibility - Collapsible */}
        {visa.eligibilityCriteria && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('eligibility')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Eligibility Requirements</h2>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.eligibility ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.eligibility && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100">
                  {Array.isArray(visa.eligibilityCriteria) ? (
                    <ul className="space-y-3">
                      {visa.eligibilityCriteria.map((criteria, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-green-600 mt-1 font-bold">✓</span>
                          <span className="text-gray-700 flex-1">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{visa.eligibilityCriteria}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Required Documents - Collapsible */}
        {visa.requiredDocuments && visa.requiredDocuments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('documents')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Required Documents</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {visa.requiredDocuments.length} items
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.documents ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.documents && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-3">
                    {visa.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700 flex-1 text-sm leading-relaxed">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Application Process Steps */}
        {visa.steps && visa.steps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Step-by-Step Application Process</h2>
                  <p className="text-sm text-gray-500 mt-1">{visa.steps.length} steps to complete</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-8">
                {visa.steps.map((step: VisaStep, index: number) => (
                  <div key={step.stepNumber} className="relative">
                    {/* Progress Line */}
                    {index < visa.steps.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-200" />
                    )}
                    
                    <div className="flex gap-6">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg relative z-10">
                          {step.stepNumber}
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 pb-8 last:pb-0">
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 pr-4">{step.title}</h3>
                            {step.estimatedTime && (
                              <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 whitespace-nowrap">
                                ⏱ {step.estimatedTime}
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            {formatStepDescription(step.description).map((paragraph, pIndex) => (
                              <p key={pIndex} className="text-gray-700 leading-relaxed text-sm">{paragraph}</p>
                            ))}
                          </div>

                          {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                            <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                              <p className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Documents needed for this step:</p>
                              <ul className="space-y-1.5">
                                {step.requiredDocuments.map((doc, docIndex) => (
                                  <li key={docIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-indigo-600 mt-1">•</span>
                                    <span>{doc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="space-y-2">
                            {step.whereToDoIt && (
                              <div className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span><strong className="text-gray-900">Where:</strong> {step.whereToDoIt}</span>
                              </div>
                            )}

                            {step.fees && (
                              <div className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                                <svg className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span><strong className="text-gray-900">Fees:</strong> {step.fees}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benefits - Collapsible */}
        {visa.benefits && visa.benefits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('benefits')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.benefits ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.benefits && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-3">
                    {visa.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 flex-1 text-sm leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Restrictions - Collapsible */}
        {visa.restrictions && visa.restrictions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => toggleSection('restrictions')}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Important Restrictions</h2>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.restrictions ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.restrictions && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    {visa.restrictions.map((restriction, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 flex-1 text-sm leading-relaxed">{restriction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Rate */}
        {visa.successRate && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-md border border-indigo-200 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Success Rate</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{visa.successRate}</p>
          </div>
        )}
      </div>

      {/* Floating Chat Bubble */}
      <Chat 
        visaId={visa.id}
        countryCode={visa.countryCode}
        visaName={visa.visaName}
        visaDescription={visa.description}
      />
    </div>
  );
}

