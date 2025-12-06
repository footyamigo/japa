# Google Tag Manager Setup Guide

This guide explains how to configure Google Tag Manager to track events from your Japa GPT website.

## Events Being Tracked

Your website automatically pushes the following events to the GTM dataLayer:

1. **Landing Page View** - When users visit the landing page (`/`)
   - Event: `page_view`
   - Data: `{ event: 'page_view', page_name: 'Landing Page' }`

2. **Checkout Page View** - When users visit the checkout page (`/checkout`)
   - Event: `page_view`
   - Data: `{ event: 'page_view', page_name: 'Checkout Page' }`

3. **Purchase Completion** - When users complete a purchase (`/payment-success`)
   - Event: `purchase`
   - Data: 
     ```javascript
     {
       event: 'purchase',
       transaction_id: 'txn_...',
       value: 67000,
       currency: 'NGN',
       items: [{
         item_id: 'japa-course',
         item_name: 'Japa Course - UK & Canada Visa Guide',
         price: 67000,
         quantity: 1
       }]
     }
     ```

## GTM Setup Steps

### 1. Create Triggers

#### Trigger 1: Landing Page View
- **Trigger Type**: Custom Event
- **Event Name**: `page_view`
- **Conditions**: 
  - `page_name` equals `Landing Page`

#### Trigger 2: Checkout Page View
- **Trigger Type**: Custom Event
- **Event Name**: `page_view`
- **Conditions**: 
  - `page_name` equals `Checkout Page`

#### Trigger 3: Purchase Event
- **Trigger Type**: Custom Event
- **Event Name**: `purchase`
- **No additional conditions needed**

### 2. Create Tags

#### Tag 1: Google Analytics 4 - Landing Page View
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Your GA4 Configuration Tag
- **Event Name**: `landing_page_view` (or keep as `page_view`)
- **Trigger**: Landing Page View Trigger
- **Optional Parameters**:
  - `page_name`: `{{page_name}}`
  - `page_location`: `{{Page URL}}`

#### Tag 2: Google Analytics 4 - Checkout Page View
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Your GA4 Configuration Tag
- **Event Name**: `checkout_page_view` (or `initiate_checkout`)
- **Trigger**: Checkout Page View Trigger
- **Optional Parameters**:
  - `page_name`: `{{page_name}}`
  - `page_location`: `{{Page URL}}`

#### Tag 3: Google Analytics 4 - Purchase
- **Tag Type**: Google Analytics: GA4 Event
- **Configuration Tag**: Your GA4 Configuration Tag
- **Event Name**: `purchase`
- **Trigger**: Purchase Event Trigger
- **Parameters**:
  - `transaction_id`: `{{transaction_id}}`
  - `value`: `{{value}}`
  - `currency`: `{{currency}}`
  - `items`: `{{items}}` (as JSON string)

#### Tag 4: Facebook Pixel - Landing Page View (Optional)
- **Tag Type**: Custom HTML
- **HTML**:
  ```html
  <script>
    fbq('track', 'PageView', {
      content_name: 'Landing Page',
      content_category: 'Page View'
    });
  </script>
  ```
- **Trigger**: Landing Page View Trigger

#### Tag 5: Facebook Pixel - InitiateCheckout (Optional)
- **Tag Type**: Custom HTML
- **HTML**:
  ```html
  <script>
    fbq('track', 'InitiateCheckout', {
      content_name: 'Checkout Page',
      content_category: 'Checkout'
    });
  </script>
  ```
- **Trigger**: Checkout Page View Trigger

#### Tag 6: Facebook Pixel - Purchase (Optional)
- **Tag Type**: Custom HTML
- **HTML**:
  ```html
  <script>
    fbq('track', 'Purchase', {
      value: {{value}},
      currency: '{{currency}}',
      content_name: 'Japa Course - UK & Canada Visa Guide',
      content_ids: ['japa-course']
    });
  </script>
  ```
- **Trigger**: Purchase Event Trigger

### 3. Create Data Layer Variables (Optional but Recommended)

Create these variables to easily access dataLayer values:

1. **Variable: page_name**
   - Type: Data Layer Variable
   - Data Layer Variable Name: `page_name`

2. **Variable: transaction_id**
   - Type: Data Layer Variable
   - Data Layer Variable Name: `transaction_id`

3. **Variable: purchase_value**
   - Type: Data Layer Variable
   - Data Layer Variable Name: `value`

4. **Variable: purchase_currency**
   - Type: Data Layer Variable
   - Data Layer Variable Name: `currency`

5. **Variable: purchase_items**
   - Type: Data Layer Variable
   - Data Layer Variable Name: `items`

### 4. Testing Your Setup

1. **Enable Preview Mode** in GTM
2. Visit your website and navigate through:
   - Landing page (`/`)
   - Checkout page (`/checkout`)
   - Complete a test purchase (if possible)
3. In the GTM Preview window, verify:
   - Events are firing correctly
   - Data layer variables are populated
   - Tags are firing as expected

### 5. Recommended Conversions/Goals

Set up these conversions in Google Analytics:

1. **Landing Page Visit** - Track when users visit the landing page
2. **Checkout Initiated** - Track when users reach checkout
3. **Purchase Completed** - Track completed purchases (most important!)

### 6. Facebook Pixel Events (Already Implemented)

Note: Facebook Pixel is already implemented directly in your code, so you don't need to set it up in GTM unless you want to manage it through GTM instead. The current implementation tracks:
- `PageView` on landing page
- `InitiateCheckout` on checkout page
- `Purchase` on payment success

If you prefer to manage Facebook Pixel through GTM, you can remove the direct implementation and use the GTM tags mentioned above.

## Quick Setup Checklist

- [ ] Create 3 triggers (Landing Page, Checkout Page, Purchase)
- [ ] Create GA4 tags for each event
- [ ] Create data layer variables (optional)
- [ ] Test in Preview Mode
- [ ] Publish the GTM container
- [ ] Set up conversions in Google Analytics
- [ ] Verify events are being received in GA4

## Troubleshooting

- **Events not firing**: Check browser console for errors, verify GTM container ID is correct
- **Data not appearing**: Use GTM Preview mode to debug, check dataLayer in browser console
- **Facebook Pixel issues**: Verify Pixel ID is correct, check Facebook Events Manager for received events

