'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { trackLandingPageView } from '@/lib/gtm';
import LiveActivityNotifications from '@/components/LiveActivityNotifications';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    trackLandingPageView();
  }, []);

  const handleGetStarted = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <LiveActivityNotifications />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
              🎯 Used by 1,320+ People to Japa in the Last 3 Months
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Japa to UK or Canada within 6months with Our Complete Expert Guide
            </h1>
            <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
              Taught by Licensed Immigration Experts • Step-by-Step Video Lessons • Complete Document Checklists • Join 1,320+ Successful Students
            </p>
            
            {/* Video Section */}
            <div className="mb-12 max-w-4xl mx-auto px-4">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://player.vimeo.com/video/1143076368?autoplay=0&title=0&byline=0&portrait=0&responsive=1"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Japa Course Introduction Video"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-200 mb-8">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Both UK & Canada Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Video Guides Included</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>24/7 Support Group</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>All Documents Listed</span>
              </div>
            </div>

            {/* Partnership Section */}
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-700/30">
              <p className="text-sm text-gray-400">In Partnership with</p>
              <div className="flex items-center gap-3">
                <Image 
                  src="/first-path.png" 
                  alt="FirstPath Immigration LLC" 
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <div className="text-xl font-semibold text-white">FirstPath Immigration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image on Left */}
            <div className="relative">
              <Image
                src="/japa woman.jpg"
                alt="Immigration Expert"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
            
            {/* Content on Right */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                About Our Immigration Expert
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  With over 10 years of hands-on experience in immigration consulting, we have dedicated our career to helping Nigerians successfully migrate to the UK and Canada for both study and work opportunities.
                </p>
                <p>
                  Having processed thousands of visa applications and guided countless individuals through the complex immigration process, we understand exactly what it takes to get approved. We've seen what works, what doesn't, and most importantly - we know how to help you avoid the common mistakes that lead to rejections.
                </p>
                <p>
                  What sets us apart is our commitment to making the process accessible. We've taken all our years of experience, all the insider knowledge from working directly with immigration authorities, and created these comprehensive guides so you can follow the same proven strategies that have helped over 1,320+ people successfully Japa in just the last 3 months.
                </p>
                <p className="font-semibold text-gray-900">
                  Currently working as licensed immigration advisors on the ground in the UK and Canada, we're not just sharing theory - we're sharing real, current, actionable strategies that work in today's immigration landscape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Works - New Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
            Why 1,320+ Students<br className="sm:hidden" /> Enrolled in This Course
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Learn the most straightforward visa routes from licensed immigration experts
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Structured Learning',
                description: 'Step-by-step guides that anyone can follow. No confusion, no guesswork - just clear, actionable steps.',
              },
              {
                icon: '📹',
                title: 'Video Lessons',
                description: 'Watch expert-led video tutorials showing exactly what to do at each step of the process.',
              },
              {
                icon: '📄',
                title: 'Complete Resources',
                description: 'Every guide includes a complete checklist of all documents you need. Nothing is left out.',
              },
              {
                icon: '👨‍💼',
                title: 'Expert Instructors',
                description: 'Taught by licensed immigration experts currently working on the ground in UK & Canada.',
              },
              {
                icon: '🚀',
                title: '20 Complete Visa Guides',
                description: '10 UK visa guides + 10 Canada visa guides. Each includes step-by-step lessons, document checklists, and video tutorials.',
              },
              {
                icon: '💰',
                title: 'Best Value Course',
                description: 'Get both UK & Canada visa courses for the price of 1. Best value you\'ll find anywhere.',
              },
              {
                icon: '✅',
                title: 'Proven Success Rate',
                description: '1,320+ students successfully completed their visa applications in the last 3 months alone.',
              },
              {
                icon: '💬',
                title: 'Student Community',
                description: 'Join our exclusive student community and get help whenever you need it from instructors and peers.',
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get - Updated */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
            What will I get from this course?
          </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
            20 proven visa routes with step-by-step guides, complete document checklists, and video tutorials • Everything you need to Japa within 6 months
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* UK Visa Guide */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-indigo-200">
              <div className="mb-4">
                <Image src="/uk.webp" alt="UK Flag" width={64} height={64} className="w-16 h-16 object-contain" />
              </div>
              <div className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-3">
                10 Step-by-Step UK Visa Guides
              </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Complete UK Visa Guide</h3>
              <p className="text-gray-700 mb-4 font-semibold">10 Proven Visa Routes That Actually Work</p>
              <p className="text-gray-600 mb-4 text-sm">
                Every guide includes everything you need:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Step-by-step guide</strong> - Easy-to-follow application process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Complete documents list</strong> - All documents needed clearly listed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Video tutorials</strong> - Watch everything being done step-by-step</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Cost breakdown</strong> and timeline for each route</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Work Permit routes, study routes and Permanent Residency routes</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>10 UK visa routes</strong> - The easiest and most straightforward options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Created by UK immigration expert</strong> on the ground</span>
                </li>
              </ul>
            </div>

            {/* Canada Visa Guide */}
            <div className="relative bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border-2 border-red-200">
              <div className="mb-4">
                <Image src="/canada.webp" alt="Canada Flag" width={64} height={64} className="w-16 h-16 object-contain" />
              </div>
              <div className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-3">
                10 Step-by-Step Canada Visa Guides
              </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Complete Canada Visa Guide</h3>
              <p className="text-gray-700 mb-4 font-semibold">10 Proven Visa Routes That Actually Work</p>
              <p className="text-gray-600 mb-4 text-sm">
                Every guide includes everything you need:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Step-by-step guide</strong> - Easy-to-follow application process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Complete documents list</strong> - All documents needed clearly listed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Video tutorials</strong> - Watch everything being done step-by-step</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Cost breakdown</strong> and timeline for each route</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Work Permit routes, study routes and Permanent Residency routes</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>10 Canada visa routes</strong> - The easiest and most straightforward options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 font-bold">✓</span>
                  <span><strong>Created by Canada immigration expert</strong> on the ground</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Support Group */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-8 rounded-2xl border-2 border-green-200">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="text-4xl sm:text-5xl flex-shrink-0">💬</div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 text-center sm:text-left">Bonus: Student Community & Support</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>Join a community of <strong>1,320+ successful students</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>Get your questions answered by course instructors (immigration experts)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>24/7 questions and answers from expert</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <span>24/7 access to course instructors and student support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Updated */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 text-gray-900">
            Student Success Stories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Hear from 1,320+ students who successfully completed their visa applications using this course
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Tosin',
                location: 'Lagos, Nigeria',
                destination: 'Canada',
                story: 'I hope everything is well with you over there! It has been a long time we spoke. Thank you for all your support since I started this journey. Me and hubby are eternally grateful. We landed in New Brunswick last month and still settling down. My hubby has started working already. I am not ready to start work yet due to the children. My hubby reminded me to send you a message today but I was not able to reach you on your number. We want to pick your brains on a few things.',
                rating: 5,
              },
              {
                name: 'Patience',
                location: 'Abuja, Nigeria',
                destination: 'Canada',
                story: 'Hello! With motivation from your videos, I took the steps and I am now in the final stage. I have gotten my settlement plan already, only thing I am waiting for is the work permit! Ha!!! I am so happy. I know you mentioned that I can message you at anytime and I just felt like sending you this message to thank you and also commend you for your selflessness. May God bless and reward you. Many thanks for your help.',
                rating: 5,
              },
              {
                name: 'Daniel',
                location: 'Port Harcourt, Nigeria',
                destination: 'Canada',
                story: 'Great work for putting it together, I watched the videos like 100 times a day, lol! I took your advice to apply to a specific state and I am now in the process of applying for my temporary work permit. I won\'t be able to travel yet due to some personal reasons but I have sent my application for PR also, so that everything will come at the same time. I have attached screenshot of my job offer and Work permit application. God bless you Danny boy, you will not lack!',
                rating: 5,
              },
              {
                name: 'Adebayo',
                location: 'Lagos, Nigeria',
                destination: 'UK',
                story: 'Got my visa approved! I watched the videos so many times sha, I think I can recite them now lol. The document list helped me a lot because I didn\'t know half of what I needed. I\'m in London now, just started my job last week. Still trying to adjust to the weather but we move!',
                rating: 5,
              },
              {
                name: 'Chioma',
                location: 'Ibadan, Nigeria',
                destination: 'Canada',
                story: 'My visa got approved o! I was so confused at first, didn\'t know which route to follow. But the guides helped me understand everything. The support group people were answering my questions even at night. Got approved in 3 months. Still processing everything but I\'m grateful.',
                rating: 5,
              },
              {
                name: 'Emeka',
                location: 'Kano, Nigeria',
                destination: 'UK',
                story: 'I chose the study route and I\'m in Manchester now. The guides covered everything - work permit, study, PR routes. I was asking so many questions in the group but people were patient with me. The videos made it easier to understand. Still settling in but I\'m here!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.story}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location} → {testimonial.destination}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA - Updated */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Enroll in the Complete UK & Canada Visa Course
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join 1,320+ students who successfully completed their visa applications using this comprehensive course
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="text-3xl font-bold text-gray-400 line-through">₦250,000</div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">₦67,000</div>
            </div>
            <p className="text-gray-200 mb-6">One-time enrollment fee • Lifetime course access • Both countries included</p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span><strong>Complete UK Visa Guide</strong> - 10 proven visa routes with step-by-step lessons, all documents listed, and video tutorials. Created by UK immigration expert on the ground.</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span><strong>Complete Canada Visa Guide</strong> - 10 proven visa routes with step-by-step lessons, all documents listed, and video tutorials. Created by Canada immigration expert on the ground.</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span>Every guide includes: Step-by-step lessons you can follow + Complete document checklists + Video tutorials showing everything</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span><strong>20 complete visa guides</strong> (10 UK + 10 Canada) - Everything you need to successfully apply, all in one place</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span>Chat with your visa expert 24/7 - Get instant answers to any questions</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span>Proven system used by 1,320+ successful students in the last 3 months</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span>Pick a visa route and relocate within 3-6 months</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2 font-bold">✓</span>
                <span>Lifetime Course Updates</span>
              </li>
            </ul>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-yellow-400 text-gray-900 px-12 py-5 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-colors shadow-2xl transform hover:scale-105"
          >
            Get Instant Access Now - ₦67,000
          </button>
          <p className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Payment powered by Flutterwave, All local payments accepted
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Used by 1,320+ people</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Created by real experts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Lifetime access</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Updated */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'In a nutshell, what will I get after I enrol?',
                a: (
                  <>
                    <p className="mb-4">
                      After enrolling, you'll get <strong>instant access</strong> to a complete visa application system that has helped <strong>1,320+ people successfully Japa in the last 3 months</strong>.
                    </p>
                    <p className="mb-3 font-semibold text-gray-900">Here's exactly what you receive:</p>
                    <ul className="space-y-2 mb-4 ml-4">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold mt-0.5">✓</span>
                        <span><strong>20 Complete Visa Guides</strong> (10 for UK + 10 for Canada) covering work permits, study routes, and permanent residency options</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold mt-0.5">✓</span>
                        <span>Each guide includes <strong>step-by-step instructions</strong> you can follow, <strong>complete document checklists</strong> so you know exactly what to prepare, and <strong>video tutorials</strong> showing everything being done step-by-step</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold mt-0.5">✓</span>
                        <span><strong>Lifetime access</strong> to all materials, so you can learn at your own pace and refer back anytime</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold mt-0.5">✓</span>
                        <span>Join a <strong>community of 1,320+ successful students</strong> and get <strong>24/7 access to licensed immigration experts</strong> who can answer your questions directly</span>
                      </li>
                    </ul>
                    <p className="mb-3">
                      Most importantly, you'll know <strong>exactly which visa route is best for you</strong>, what documents to prepare, how to fill out applications correctly, and avoid the common mistakes that lead to rejections.
                    </p>
                    <p className="mb-3">
                      This saves you <strong>hundreds of thousands in consultation fees</strong> and <strong>months of confusion</strong>. All for <strong className="text-green-600">₦67,000</strong> - that's both UK and Canada courses for less than what most people spend on a single consultation with an immigration lawyer.
                    </p>
                    <p className="font-semibold text-gray-900">
                      You'll have everything you need to start your application process immediately and potentially relocate within 3-6 months.
                    </p>
                  </>
                ),
              },
              {
                q: 'Is this course really easy to follow?',
                a: 'Yes! The course is designed by licensed immigration experts and structured to be easy-to-follow. We include video lessons showing everything step-by-step, and all documents needed are clearly listed. Over 1,320 students have successfully completed this course in the last 3 months.',
              },
              {
                q: 'Who teaches this course?',
                a: 'The course is taught by licensed immigration experts currently working on the ground in the UK and Canada. These are real professionals who process visas and know exactly what works. Not generic information - actual expert knowledge from the field.',
              },
              {
                q: 'Do I really get both UK and Canada courses?',
                a: 'Yes! You get both UK and Canada visa guides for the price of 1. That\'s the best value you\'ll find anywhere. Each country includes 10 comprehensive guides. Each guide has complete step-by-step lessons, all documents needed, and video tutorials showing everything.',
              },
              {
                q: 'What makes these routes the easiest to learn?',
                a: 'Our expert instructors have identified the most straightforward visa routes based on their experience helping 1,320+ students. We focus on routes that are easier to qualify for and have higher success rates, avoiding complicated paths that are hard to navigate.',
              },
              {
                q: 'Are video lessons included?',
                a: 'Yes! Every guide includes video lessons showing everything step-by-step. You\'ll see exactly what to do at each stage, making the process much easier to follow and learn.',
              },
              {
                q: 'Will I get all documents needed?',
                a: 'Absolutely! Each guide includes a complete checklist of all documents needed. Nothing is left out. You\'ll know exactly what documents to prepare before you start each guide.',
              },
              {
                q: 'How do I access support?',
                a: 'You can chat with Maya, your personal visa expert, 24/7 directly from your course dashboard. Just click the chat icon in the bottom right corner to ask any questions about your visa application. Maya has helped over 1,320+ students and is available anytime you need guidance.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.q}</h3>
                {typeof faq.a === 'string' ? (
                  <p className="text-gray-600">{faq.a}</p>
                ) : (
                  <div className="text-gray-600 space-y-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Join 1,320+ Students Who Successfully Completed This Course
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Enroll in both UK & Canada visa courses for the price of 1 • Structured learning • Video lessons • Complete resources included
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-2xl"
          >
            Get Instant Access Now - ₦67,000
          </button>
          <p className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Payment powered by Flutterwave, All local payments accepted
          </p>
          <p className="mt-6 text-sm text-gray-400">
            Taught by licensed immigration experts • Completed by 1,320+ students • 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
