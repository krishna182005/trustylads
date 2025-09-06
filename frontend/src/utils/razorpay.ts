import { CheckoutData, RazorpayOptions, RazorpayResponse } from '../types';
import { apiClient } from './api';

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      console.log('✅ Razorpay SDK already loaded');
      resolve(true);
      return;
    }

    console.log('🔄 Loading Razorpay SDK...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    // Set a timeout for script loading
    const timeout = setTimeout(() => {
      console.error('❌ Razorpay SDK loading timeout');
      resolve(false);
    }, 10000); // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Razorpay SDK loaded successfully');
      resolve(true);
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ Failed to load Razorpay SDK:', error);
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
};

// Fallback method to load Razorpay script
export const loadRazorpayScriptFallback = (): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('🔄 Trying fallback Razorpay SDK loading...');
    
    // Check if already loaded
    if (window.Razorpay) {
      console.log('✅ Razorpay SDK already loaded (fallback)');
      resolve(true);
      return;
    }

    // Try loading with different approach
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    
    const timeout = setTimeout(() => {
      console.error('❌ Fallback Razorpay SDK loading timeout');
      resolve(false);
    }, 15000); // 15 second timeout for fallback
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Razorpay SDK loaded successfully (fallback)');
      resolve(true);
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ Failed to load Razorpay SDK (fallback):', error);
      resolve(false);
    };
    
    // Try appending to body instead of head
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  responseData: any,
  checkoutData: CheckoutData,
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    console.log('🔄 Starting Razorpay payment initialization...');
    console.log('📦 Response data:', responseData);

    // Validate response data
    if (!responseData) {
      console.error('❌ Response data is undefined');
      throw new Error('No payment data received from server');
    }

    if (!responseData.order) {
      console.error('❌ Order data missing from response:', responseData);
      throw new Error('Invalid payment data: order information missing');
    }

    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      console.error('❌ Failed to load Razorpay SDK, trying fallback...');
      
      // Try alternative loading method
      const fallbackLoaded = await loadRazorpayScriptFallback();
      if (!fallbackLoaded) {
        console.error('❌ Fallback also failed');
        throw new Error('Failed to load Razorpay SDK');
      }
    }

    // Extract order and key from response data
    const order = responseData.order;
    const key = responseData.key;

    console.log('🔑 Using Razorpay key:', key);
    console.log('📋 Order details:', order);

    // Verify Razorpay is available
    if (!window.Razorpay) {
      console.error('❌ Razorpay object not available on window');
      throw new Error('Razorpay SDK not properly loaded');
    }

    // Detect mock mode: when backend didn't create a real Razorpay order
    // const isMockOrder = !!(order?.id && String(order.id).startsWith('order_mock_'));

    const options: RazorpayOptions = {
      // Use key from backend response or fallback to env variable
      key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'TrustyLads',
      description: 'Streetwear that screams YOU',
      image: '/logo.svg',

      order_id: order.id,
      handler: (response: RazorpayResponse) => {
        onSuccess(response);
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {}
      },
      prefill: {
        name: checkoutData.customer.name || `${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}`,
        email: checkoutData.customer.email,
        contact: checkoutData.customer.phone,
      },
      theme: {
        color: '#FBBF24', // TrustyLads yellow
      },
      modal: {
        ondismiss: () => {
          onError({
            code: 'PAYMENT_CANCELLED',
            description: 'Payment was cancelled by user',
            source: 'customer',
            step: 'payment_authentication',
            reason: 'user_cancelled'
          });
        },
      },
    };

    console.log('🔧 Creating Razorpay instance with options:', options);
    const razorpay = new window.Razorpay(options);
    
    // Handle payment failure
    razorpay.on('payment.failed', (response: any) => {
      console.error('❌ Payment failed:', response.error);
      onError(response.error);
    });

    console.log('🚀 Opening Razorpay checkout...');
    // Open Razorpay checkout
    razorpay.open();
  } catch (error: any) {
    console.error('❌ Razorpay initialization error:', error);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Window.Razorpay available:', !!window.Razorpay);
    console.error('❌ Response data:', responseData);
    
    onError({
      code: 'RAZORPAY_INIT_ERROR',
      description: 'Failed to initialize payment gateway',
      source: 'client',
      step: 'payment_initialization',
      reason: 'sdk_error',
      details: error?.message || 'Unknown error',
      stack: error?.stack
    });
  }
};

// Verify payment signature (client-side validation)
export const verifyPaymentSignature = (
  _orderId: string,
  _paymentId: string,
  _signature: string,
  _keySecret: string
): boolean => {
  // Note: This is just for client-side validation
  // The actual verification should always be done on the server
  try {
    // Note: Client-side crypto verification is not secure
    // This should be handled on the server side
    return false;
  } catch {
    console.error('Client-side signature verification failed');
    return false;
  }
};

// Format amount for Razorpay (convert to paise)
export const formatAmountForRazorpay = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount from Razorpay (convert from paise)
export const formatAmountFromRazorpay = (amount: number): number => {
  return amount / 100;
};

// Get payment method display name
export const getPaymentMethodName = (method: string): string => {
  const methodNames: Record<string, string> = {
    card: 'Credit/Debit Card',
    netbanking: 'Net Banking',
    wallet: 'Wallet',
    upi: 'UPI',
    emi: 'EMI',
    paylater: 'Pay Later',
    cardless_emi: 'Cardless EMI',
    bank_transfer: 'Bank Transfer',
  };

  return methodNames[method] || method.charAt(0).toUpperCase() + method.slice(1);
};

// Get bank display name
export const getBankName = (bankCode: string): string => {
  const bankNames: Record<string, string> = {
    HDFC: 'HDFC Bank',
    ICIC: 'ICICI Bank',
    SBIN: 'State Bank of India',
    AXIS: 'Axis Bank',
    YESB: 'Yes Bank',
    KKBK: 'Kotak Mahindra Bank',
    UTIB: 'Axis Bank',
    PUNB: 'Punjab National Bank',
    ALLA: 'Allahabad Bank',
    CBIN: 'Central Bank of India',
    CNRB: 'Canara Bank',
    CORP: 'Corporation Bank',
    COSB: 'City Union Bank',
    DBSS: 'DBS Bank',
    DEUT: 'Deutsche Bank',
    FDRL: 'Federal Bank',
    IDFB: 'IDFC First Bank',
    IDIB: 'Indian Bank',
    INDB: 'IndusInd Bank',
    IOBA: 'Indian Overseas Bank',
    JAKA: 'Jammu & Kashmir Bank',
    KARB: 'Karnataka Bank',
    KVBL: 'Karur Vysya Bank',
    MAHB: 'Bank of Maharashtra',
    ORBC: 'Oriental Bank of Commerce',
    PSIB: 'Punjab & Sind Bank',
    RATN: 'RBL Bank',
    SCBL: 'Standard Chartered Bank',
    SIBL: 'South Indian Bank',
    SRCB: 'Saraswat Bank',
    SVCB: 'Shamrao Vithal Co-operative Bank',
    SYNB: 'Syndicate Bank',
    TMBL: 'Tamilnad Mercantile Bank',
    TNSC: 'Tamil Nadu State Cooperative Bank',
    UBIN: 'Union Bank of India',
    UCBA: 'UCO Bank',
    VIJB: 'Vijaya Bank',
  };

  return bankNames[bankCode] || bankCode;
};

// Handle Razorpay errors
export const handleRazorpayError = (error: any): string => {
  const errorMessages: Record<string, string> = {
    BAD_REQUEST_ERROR: 'Invalid request. Please try again.',
    GATEWAY_ERROR: 'Payment gateway error. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    PAYMENT_CANCELLED: 'Payment was cancelled.',
    PAYMENT_FAILED: 'Payment failed. Please try again.',
  };

  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  if (error.description) {
    return error.description;
  }

  return 'Payment failed. Please try again.';
};

// Razorpay configuration
export const razorpayConfig = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  currency: 'INR',
  theme: {
    color: '#FBBF24',
  },
  company: {
    name: 'TrustyLads',
    description: 'Streetwear that screams YOU',
  },
};

// Payment status checker
export const checkPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    return await apiClient.get(`/api/payments/status/${paymentId}`);
  } catch {
    console.error('Failed to check payment status');
    throw new Error('Failed to check payment status');
  }
};

// Retry payment helper
export const retryPayment = async (
  orderId: string,
  checkoutData: CheckoutData,
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    const orderData = await apiClient.get(`/api/payments/razorpay/order/${orderId}`);
    await initiateRazorpayPayment(orderData, checkoutData, onSuccess, onError);
  } catch {
    onError({
      code: 'RETRY_FAILED',
      description: 'Failed to retry payment',
      source: 'client',
      step: 'payment_retry',
      reason: 'order_fetch_failed'
    });
  }
};

export default {
  loadRazorpayScript,
  initiateRazorpayPayment,
  verifyPaymentSignature,
  formatAmountForRazorpay,
  formatAmountFromRazorpay,
  getPaymentMethodName,
  getBankName,
  handleRazorpayError,
  razorpayConfig,
  checkPaymentStatus,
  retryPayment,
};
