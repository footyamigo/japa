'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface GamifiedOnboardingProps {
  onClose: () => void;
}

export default function GamifiedOnboarding({ onClose }: GamifiedOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ageGroup: '',
    education: '',
    country: '',
  });
  const [slotsAvailable, setSlotsAvailable] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ageGroups = [
    '18-30',
    '31-40',
    '41-50',
    '51+',
  ];

  const educationLevels = [
    'Secondary School',
    'Bachelors (BSc)',
    'Masters (MSc)',
  ];

  const countries = [
    'UK',
    'Canada',
    "I don't mind any",
  ];

  const handleNext = (delay: number = 1500) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (step === 3) {
        // Start checking for slots
        setIsChecking(true);
        setStep(4);
        
        // Simulate checking slots
        setTimeout(() => {
          const randomSlots = Math.floor(Math.random() * 6) + 2; // 2-7 slots
          setSlotsAvailable(randomSlots);
          setIsChecking(false);
          setStep(5);
        }, 2000); // 2 second delay
      } else {
        setStep(step + 1);
      }
    }, delay);
  };

  const handleEnroll = () => {
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <div className="p-8 md:p-12">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {step} of 5</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {/* Step 1: Age Group */}
          {step === 1 && !isLoading && (
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Let's Find Your Perfect Visa Path</h2>
              <p className="text-gray-600 mb-8">First, tell us your age group</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {ageGroups.map((age) => (
                  <button
                    key={age}
                    onClick={() => {
                      setFormData({ ...formData, ageGroup: age });
                      handleNext();
                    }}
                    className={`py-6 px-6 rounded-xl border-2 transition-all ${
                      formData.ageGroup === age
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {age} years
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Education Level */}
          {step === 2 && !isLoading && (
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What's Your Education Level?</h2>
              <p className="text-gray-600 mb-8">This helps us recommend the best visa routes for you</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {educationLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setFormData({ ...formData, education: level });
                      handleNext();
                    }}
                    className={`py-6 px-6 rounded-xl border-2 transition-all ${
                      formData.education === level
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Preferred Country */}
          {step === 3 && !isLoading && (
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Which Country Interests You?</h2>
              <p className="text-gray-600 mb-8">Choose your preferred destination</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setFormData({ ...formData, country });
                      handleNext();
                    }}
                    className={`py-4 md:py-8 px-4 md:px-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 md:gap-3 ${
                      formData.country === country
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-200 hover:border-green-300 text-gray-700'
                    }`}
                  >
                    {country === 'UK' && (
                      <Image
                        src="/uk.webp"
                        alt="UK Flag"
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    )}
                    {country === 'Canada' && (
                      <Image
                        src="/canada.webp"
                        alt="Canada Flag"
                        width={48}
                        height={48}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    )}
                    {country === "I don't mind any" && (
                      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl md:text-2xl">🌍</div>
                    )}
                    <span className="text-sm md:text-base">{country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Checking Slots */}
          {step === 4 && isChecking && !isLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Checking Availability...</h2>
              <p className="text-gray-600">We're checking to see if there are slots available for your profile</p>
            </div>
          )}

          {/* Step 5: Slots Available */}
          {step === 5 && slotsAvailable !== null && !isLoading && (
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Great News!</h2>
              
              {/* Limited Slots Message */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                <p className="text-base md:text-lg font-semibold text-red-700">
                  Only <span className="text-2xl md:text-3xl font-bold">{slotsAvailable}</span> slots left today
                </p>
              </div>

              {/* Social Proof - Smaller */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 inline-block">
                <p className="text-sm md:text-base text-blue-700">
                  Join <span className="font-semibold">1,320+</span> successful students
                </p>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">
                Based on your age group, education level, and country preference, we have the perfect visa routes ready for you.
              </p>
              
              <button
                onClick={handleEnroll}
                className="w-full max-w-md mx-auto bg-yellow-400 text-gray-900 px-8 py-5 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-colors shadow-2xl transform hover:scale-105"
              >
                Enrol Now - ₦67,000
              </button>
              <p className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Payment powered by Flutterwave, All local payments accepted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

