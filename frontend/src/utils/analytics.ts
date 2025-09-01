// Analytics utility for tracking user interactions and events
// This can be integrated with Google Analytics, Mixpanel, or other analytics services

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

interface PageViewEvent {
  page: string;
  title?: string;
  userId?: string;
  properties?: Record<string, any>;
}

interface EcommerceEvent {
  event: 'purchase' | 'add_to_cart' | 'remove_from_cart' | 'view_item' | 'begin_checkout';
  currency?: string;
  value?: number;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
  transaction_id?: string;
}

class Analytics {
  private isEnabled: boolean;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.isEnabled = !import.meta.env.DEV; // Disable in development
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics(): void {
    if (!this.isEnabled) {
      console.log('Analytics disabled in development mode');
      return;
    }

    // Initialize Google Analytics 4 if GA_MEASUREMENT_ID is provided
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      this.initializeGA4();
    }

    // Initialize other analytics services here
    // Example: Mixpanel, Hotjar, etc.
  }

  private initializeGA4(): void {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  // Set user ID for tracking
  setUserId(userId: string): void {
    this.userId = userId;
    
    if (this.isEnabled && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }
  }

  // Clear user ID (on logout)
  clearUserId(): void {
    this.userId = null;
  }

  // Track page views
  trackPageView(event: PageViewEvent): void {
    if (!this.isEnabled) {
      console.log('Analytics: Page view', event);
      return;
    }

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: event.title || document.title,
        page_location: window.location.href,
        page_path: event.page,
        user_id: event.userId || this.userId,
        session_id: this.sessionId,
        ...event.properties,
      });
    }

    // Add other analytics services here
    this.logEvent({
      name: 'page_view',
      properties: {
        page: event.page,
        title: event.title,
        ...event.properties,
      },
      userId: event.userId || this.userId || undefined,
    });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) {
      console.log('Analytics: Event', event);
      return;
    }

    // Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event.name, {
        user_id: event.userId || this.userId,
        session_id: this.sessionId,
        timestamp: event.timestamp || new Date(),
        ...event.properties,
      });
    }

    this.logEvent(event);
  }

  // Track e-commerce events
  trackEcommerce(event: EcommerceEvent): void {
    if (!this.isEnabled) {
      console.log('Analytics: E-commerce', event);
      return;
    }

    // Google Analytics 4 Enhanced Ecommerce
    if ((window as any).gtag) {
      (window as any).gtag('event', event.event, {
        currency: event.currency || 'INR',
        value: event.value,
        transaction_id: event.transaction_id,
        items: event.items,
        user_id: this.userId,
        session_id: this.sessionId,
      });
    }

    this.logEvent({
      name: event.event,
      properties: {
        currency: event.currency,
        value: event.value,
        transaction_id: event.transaction_id,
        items: event.items,
      },
      userId: this.userId || undefined,
    });
  }

  // Specific e-commerce tracking methods
  trackPurchase(orderId: string, value: number, items: any[]): void {
    this.trackEcommerce({
      event: 'purchase',
      transaction_id: orderId,
      value,
      currency: 'INR',
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  trackAddToCart(item: any): void {
    this.trackEcommerce({
      event: 'add_to_cart',
      currency: 'INR',
      value: item.price * item.quantity,
      items: [{
        item_id: item.productId,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      }],
    });
  }

  trackRemoveFromCart(item: any): void {
    this.trackEcommerce({
      event: 'remove_from_cart',
      currency: 'INR',
      value: item.price * item.quantity,
      items: [{
        item_id: item.productId,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      }],
    });
  }

  trackViewItem(product: any): void {
    this.trackEcommerce({
      event: 'view_item',
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product._id,
        item_name: product.name,
        category: product.category,
        quantity: 1,
        price: product.price,
      }],
    });
  }

  trackBeginCheckout(items: any[], value: number): void {
    this.trackEcommerce({
      event: 'begin_checkout',
      currency: 'INR',
      value,
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }

  // Track user interactions
  trackClick(element: string, properties?: Record<string, any>): void {
    this.trackEvent({
      name: 'click',
      properties: {
        element,
        ...properties,
      },
    });
  }

  trackSearch(query: string, results?: number): void {
    this.trackEvent({
      name: 'search',
      properties: {
        search_term: query,
        results_count: results,
      },
    });
  }

  trackShare(content: string, method: string): void {
    this.trackEvent({
      name: 'share',
      properties: {
        content_type: content,
        method,
      },
    });
  }

  trackError(error: string, context?: string): void {
    this.trackEvent({
      name: 'error',
      properties: {
        error_message: error,
        error_context: context,
        page: window.location.pathname,
      },
    });
  }

  // Track form interactions
  trackFormStart(formName: string): void {
    this.trackEvent({
      name: 'form_start',
      properties: {
        form_name: formName,
      },
    });
  }

  trackFormComplete(formName: string): void {
    this.trackEvent({
      name: 'form_complete',
      properties: {
        form_name: formName,
      },
    });
  }

  trackFormError(formName: string, error: string): void {
    this.trackEvent({
      name: 'form_error',
      properties: {
        form_name: formName,
        error_message: error,
      },
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      name: 'performance',
      properties: {
        metric_name: metric,
        metric_value: value,
        metric_unit: unit,
      },
    });
  }

  // Log events to console in development or send to custom analytics
  private logEvent(event: AnalyticsEvent): void {
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', {
        ...event,
        timestamp: event.timestamp || new Date(),
        sessionId: this.sessionId,
      });
    }

    // Send to custom analytics endpoint if needed
    if (import.meta.env.VITE_CUSTOM_ANALYTICS_ENDPOINT) {
      this.sendToCustomAnalytics(event);
    }
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(import.meta.env.VITE_CUSTOM_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date(),
          sessionId: this.sessionId,
          userId: event.userId || this.userId || undefined,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Get session information
  getSessionInfo(): { sessionId: string; userId: string | null } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create and export analytics instance
export const analytics = new Analytics();

// Export convenience functions
export const trackPageView = (page: string, title?: string, properties?: Record<string, any>) => {
  analytics.trackPageView({ page, title, properties });
};

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  analytics.trackEvent({ name, properties });
};

export const trackPurchase = (orderId: string, value: number, items: any[]) => {
  analytics.trackPurchase(orderId, value, items);
};

export const trackAddToCart = (item: any) => {
  analytics.trackAddToCart(item);
};

export const trackRemoveFromCart = (item: any) => {
  analytics.trackRemoveFromCart(item);
};

export const trackViewItem = (product: any) => {
  analytics.trackViewItem(product);
};

export const trackBeginCheckout = (items: any[], value: number) => {
  analytics.trackBeginCheckout(items, value);
};

export const trackClick = (element: string, properties?: Record<string, any>) => {
  analytics.trackClick(element, properties);
};

export const trackSearch = (query: string, results?: number) => {
  analytics.trackSearch(query, results);
};

export const trackError = (error: string, context?: string) => {
  analytics.trackError(error, context);
};

export const setUserId = (userId: string) => {
  analytics.setUserId(userId);
};

export const clearUserId = () => {
  analytics.clearUserId();
};

export default analytics;