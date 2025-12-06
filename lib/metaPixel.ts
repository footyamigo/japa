// Meta Pixel (Facebook Pixel) utility functions

declare global {
  interface Window {
    fbq: (
      action: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Track a Meta Pixel event
 */
export const trackMetaPixelEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

/**
 * Track landing page view
 */
export const trackMetaLandingPageView = () => {
  trackMetaPixelEvent('PageView', {
    content_name: 'Landing Page',
    content_category: 'Page View',
  });
};

/**
 * Track checkout page view (InitiateCheckout event)
 */
export const trackMetaCheckoutPageView = () => {
  trackMetaPixelEvent('InitiateCheckout', {
    content_name: 'Checkout Page',
    content_category: 'Checkout',
  });
};

/**
 * Track purchase completion
 */
export const trackMetaPurchase = (transactionData?: {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
}) => {
  trackMetaPixelEvent('Purchase', {
    value: transactionData?.value || 67000,
    currency: transactionData?.currency || 'NGN',
    content_name: transactionData?.content_name || 'Japa Course - UK & Canada Visa Guide',
    content_ids: transactionData?.content_ids || ['japa-course'],
    content_type: 'product',
  });
};

