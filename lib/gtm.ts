// Google Tag Manager utility functions

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push an event to Google Tag Manager dataLayer
 */
export const pushToDataLayer = (eventData: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string, additionalData?: Record<string, any>) => {
  pushToDataLayer({
    event: 'page_view',
    page_name: pageName,
    ...additionalData,
  });
};

/**
 * Track landing page visit
 */
export const trackLandingPageView = () => {
  trackPageView('Landing Page');
};

/**
 * Track checkout page visit
 */
export const trackCheckoutPageView = () => {
  trackPageView('Checkout Page');
};

/**
 * Track purchase completion
 */
export const trackPurchase = (transactionData?: {
  transaction_id?: string;
  value?: number;
  currency?: string;
  items?: Array<{
    item_id?: string;
    item_name?: string;
    price?: number;
    quantity?: number;
  }>;
}) => {
  pushToDataLayer({
    event: 'purchase',
    ...transactionData,
  });
};

