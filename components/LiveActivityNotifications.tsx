'use client';

import { useState, useEffect, useRef } from 'react';

interface Activity {
  name: string;
  location: string;
  action: string;
  time: string;
}

const activities: Activity[] = [
  { name: 'Someone', location: 'Lagos', action: 'just enrolled', time: '2 minutes ago' },
  { name: 'Someone', location: 'Abuja', action: 'just enrolled', time: '5 minutes ago' },
  { name: 'Someone', location: 'Port Harcourt', action: 'just enrolled', time: '8 minutes ago' },
  { name: 'Someone', location: 'Ibadan', action: 'just enrolled', time: '12 minutes ago' },
  { name: 'Someone', location: 'Kano', action: 'just enrolled', time: '15 minutes ago' },
  { name: 'Someone', location: 'Lagos', action: 'just enrolled', time: '18 minutes ago' },
  { name: 'Someone', location: 'Enugu', action: 'just enrolled', time: '22 minutes ago' },
  { name: 'Someone', location: 'Lagos', action: 'just enrolled', time: '25 minutes ago' },
  { name: 'Someone', location: 'Kaduna', action: 'just enrolled', time: '30 minutes ago' },
  { name: 'Someone', location: 'Ibadan', action: 'just enrolled', time: '35 minutes ago' },
  { name: 'Someone', location: 'Abuja', action: 'just enrolled', time: '40 minutes ago' },
  { name: 'Someone', location: 'Lagos', action: 'just enrolled', time: '45 minutes ago' },
];

export default function LiveActivityNotifications() {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const showNextActivity = () => {
      if (!isMountedRef.current) return;
      
      // Clear any existing dismiss timeout
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
        dismissTimeoutRef.current = null;
      }
      
      // Fade out current notification
      setIsVisible(false);
      
      // After fade out, show new notification
      setTimeout(() => {
        if (!isMountedRef.current) return;
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setCurrentActivity(randomActivity);
        setIsVisible(true);
        
        // Auto-dismiss after 6 seconds
        dismissTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          setIsVisible(false);
        }, 6000);
      }, 300);
    };

    // Schedule next notification with random interval
    const scheduleNext = () => {
      if (!isMountedRef.current) return;
      
      // Random interval between 20-45 seconds for more natural spacing
      const randomDelay = Math.floor(Math.random() * 25000) + 20000; // 20-45 seconds
      timeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        showNextActivity();
        scheduleNext(); // Schedule the next one recursively
      }, randomDelay);
    };

    // Show first notification after 5 seconds
    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      showNextActivity();
      scheduleNext();
    }, 5000);

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, []);

  if (!currentActivity) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[60] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 hover:shadow-green-200/50 transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 relative">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 font-medium leading-tight">
              <span className="font-semibold text-green-600">{currentActivity.name}</span>
              {' '}from{' '}
              <span className="font-semibold text-gray-900">{currentActivity.location}</span>
              {' '}
              <span className="text-gray-700">{currentActivity.action}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{currentActivity.time}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium text-blue-600">Verified by FL</span>
        </div>
      </div>
    </div>
  );
}

