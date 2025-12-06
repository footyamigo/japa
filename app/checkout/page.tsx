'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import { trackCheckoutPageView } from '@/lib/gtm';

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    trackCheckoutPageView();
  }, []);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    
    setFormData(updatedFormData);

    // Validate email match in real-time
    if (name === 'email' || name === 'confirmEmail') {
      const email = name === 'email' ? value : updatedFormData.email;
      const confirmEmail = name === 'confirmEmail' ? value : updatedFormData.confirmEmail;

      if (email && confirmEmail) {
        if (email !== confirmEmail) {
          setEmailError('Emails do not match');
        } else if (!validateEmail(email)) {
          setEmailError('Please enter a valid email address');
        } else {
          setEmailError('');
        }
      } else if (name === 'email' && value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else if (name === 'confirmEmail' && updatedFormData.email && value && updatedFormData.email !== value) {
        setEmailError('Emails do not match');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePayment = async () => {
    if (!formData.email || !formData.confirmEmail || !formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate emails match
    if (formData.email !== formData.confirmEmail) {
      setEmailError('Emails do not match');
      return;
    }

    setLoading(true);

    try {
      // Initialize Flutterwave payment
      const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
      
      if (!publicKey) {
        console.error('Flutterwave public key not found in environment variables');
        console.error('Make sure NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY is set in .env.local');
        alert('Payment gateway not configured. Please contact support.');
        setLoading(false);
        return;
      }

      // Validate public key format (accepts both test and live keys)
      if (!publicKey.startsWith('FLWPUBK-') && !publicKey.startsWith('FLWPUBK_TEST-')) {
        console.error('Invalid Flutterwave public key format. Key should start with FLWPUBK- or FLWPUBK_TEST-');
        console.error('Current key:', publicKey.substring(0, 20) + '...');
        alert('Invalid payment gateway configuration. Please contact support.');
        setLoading(false);
        return;
      }

      // Log key info for debugging (first 20 chars only for security)
      console.log('Using Flutterwave public key:', publicKey.substring(0, 20) + '...');

      const paymentData = {
        public_key: publicKey,
        tx_ref: `japa-course-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        amount: 67000,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd, account',
        customer: {
          email: formData.email,
          phone_number: formData.phone,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        customizations: {
          title: 'Japa Course - UK & Canada Visa Guides',
          description: 'UK and Canada Visa Guides + 24/7 Support Group',
          logo: '',
        },
        callback: async (response: any) => {
          if (response.status === 'successful') {
            // Verify payment and grant access
            try {
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  transactionId: response.transaction_id,
                  txRef: response.tx_ref,
                  email: formData.email,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  phone: formData.phone,
                }),
              });

              const verifyData = await verifyResponse.json();
              
              if (verifyData.success) {
                // Store payment confirmation and credentials
                localStorage.setItem('payment_email', formData.email);
                if (verifyData.password) {
                  localStorage.setItem('payment_password', verifyData.password);
                }
                localStorage.setItem('payment_tx_ref', response.tx_ref);
                localStorage.setItem('payment_transaction_id', response.transaction_id);
                
                // Redirect to success page
                router.push('/payment-success');
              } else {
                alert('Payment verification failed. Please contact support with your transaction ID: ' + response.transaction_id);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment successful but verification failed. Please contact support with your transaction ID: ' + response.transaction_id);
            }
          } else {
            alert('Payment was not successful. Please try again.');
          }
          setLoading(false);
        },
        onclose: () => {
          setLoading(false);
        },
      };

      // Load Flutterwave script and initialize payment
      if (typeof window !== 'undefined') {
        if ((window as any).FlutterwaveCheckout) {
          try {
            (window as any).FlutterwaveCheckout(paymentData);
          } catch (error: any) {
            console.error('Flutterwave checkout error:', error);
            alert('Payment initialization failed. Please check your public key configuration or contact support.');
            setLoading(false);
          }
        } else {
          // If script not loaded, wait for it or load it
          const checkFlutterwave = setInterval(() => {
            if ((window as any).FlutterwaveCheckout) {
              clearInterval(checkFlutterwave);
              try {
                (window as any).FlutterwaveCheckout(paymentData);
              } catch (error: any) {
                console.error('Flutterwave checkout error:', error);
                alert('Payment initialization failed. Please check your public key configuration or contact support.');
                setLoading(false);
              }
            }
          }, 100);

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkFlutterwave);
            if (!(window as any).FlutterwaveCheckout) {
              alert('Payment gateway failed to load. Please refresh the page and try again.');
              setLoading(false);
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.flutterwave.com/v3.js" strategy="lazyOnload" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Secure payment powered by Flutterwave</p>
          </div>

          {/* Video Section */}
          <div className="mb-8">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
              <iframe
                src="https://player.vimeo.com/video/1143076414?autoplay=0&title=0&byline=0&portrait=0&responsive=1"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Japa Course Video"
              />
            </div>
          </div>

          {/* Testimonial */}
          <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">A</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-2">
                  "I got my UK visa in 4 months following this course. The step-by-step guides were exactly what I needed!"
                </p>
                <p className="text-sm text-gray-600 font-semibold">- Aisha from Lagos</p>
              </div>
            </div>
          </div>

          {/* Partnership Section */}
          <div className="mb-8 flex flex-col items-center gap-3 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-500">In Partnership with</p>
            <div className="flex items-center gap-3">
              <Image 
                src="/first-path.png" 
                alt="FirstPath Immigration" 
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <div className="text-lg sm:text-xl font-semibold text-gray-900">FirstPath Immigration</div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
            
            {/* Success Rate Stat */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-700">98%</p>
                  <p className="text-xs text-gray-500">of students successfully complete their visa application</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">UK & Canada Visa Guides</p>
                  <p className="text-sm text-gray-600">+ 24/7 Support Group</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-400 line-through">₦250,000</span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">₦67,000</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
              <span className="text-gray-900">Total</span>
              <div className="flex items-center gap-3">
                <span className="text-lg text-gray-400 line-through">₦250,000</span>
                <span className="text-indigo-600">₦67,000</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Email Address *
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="your@email.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay ₦67,000 - Secure Checkout'
            )}
          </button>

          {/* Trust Badges Section */}
          <div className="mt-6 space-y-4">
            {/* Payment Security */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Payment powered by Flutterwave, All local payments accepted</span>
              </div>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <svg className="w-6 h-6 text-blue-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Lifetime Access</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                <svg className="w-6 h-6 text-purple-600 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-xs font-semibold text-gray-700">Expert Created</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

