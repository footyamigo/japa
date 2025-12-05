'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { storage } from '@/lib/storage';
import { COLORS, SIZES, SPACING } from '@/lib/constants/theme';

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Japa to 🇬🇧 🇺🇸 🇨🇦\nin 3-6 months',
    subtitle: 'Explore visa opportunities for the UK, US, and Canada tailored just for you.',
    image: '/assets/onboarding-1.png', // You'll need to add these images
    color: COLORS.primary,
  },
  {
    id: '2',
    title: 'Step-by-Step Guides',
    subtitle: 'No more confusion. Get clear, actionable steps for your visa application process. Each guide has videos by experts.',
    image: '/assets/onboarding-2.png',
    color: COLORS.secondary,
  },
  {
    id: '3',
    title: 'Japa with Confidence',
    subtitle: 'Join thousands of Nigerians making their dream move with the right information.',
    image: '/assets/onboarding-3.png',
    color: '#F59E0B',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleNext = async () => {
    if (currentSlideIndex < ONBOARDING_DATA.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      try {
        await storage.setItem('hasOnboarded', 'true');
        router.replace('/auth/signup');
      } catch (error) {
        console.error('[Onboarding] Error saving onboarding status:', error);
        router.replace('/auth/signup');
      }
    }
  };

  const currentSlide = ONBOARDING_DATA[currentSlideIndex];
  const isLastSlide = currentSlideIndex === ONBOARDING_DATA.length - 1;

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Image Section - Top */}
      <div className="relative flex-[0.65] w-full bg-black">
        {/* Placeholder for image - replace with actual image */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
        
        {/* App Icon - Centered */}
        <div className="absolute inset-0 flex items-center justify-center pt-10 z-[5]">
          <div className="w-30 h-30 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-6xl">🚀</span>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-white/70 via-white/30 to-transparent z-[1]" />
      </div>

      {/* White Card Section - Bottom */}
      <div className="flex-[0.35] bg-white rounded-t-[30px] -mt-10 px-8 pt-8 pb-12 flex flex-col justify-between">
        {/* Title and Subtitle */}
        <div className="flex-1 flex flex-col justify-center items-center pt-2">
          <h1 className="text-4xl font-bold text-black mb-2 text-center whitespace-pre-line">
            {currentSlide.title}
          </h1>
          <p className="text-base text-gray-600 text-center leading-5 px-4">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex flex-row justify-center items-center gap-2 my-6">
          {ONBOARDING_DATA.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'w-6 bg-black'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-gray-800 transition-colors"
        >
          {isLastSlide ? 'Get Started' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

