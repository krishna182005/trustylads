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
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  order: any,
  checkoutData: CheckoutData,
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    const options: RazorpayOptions = {
      key: order.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'TrustyLads',
      description: 'Streetwear that screams YOU',
      order_id: order.id,
      handler: (response: RazorpayResponse) => {
        onSuccess(response);
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

    const razorpay = new window.Razorpay(options);
    
    // Handle payment failure
    razorpay.on('payment.failed', (response: any) => {
      onError(response.error);
    });

    // Open Razorpay checkout
    // If in mock mode (no key), skip opening Razorpay and simulate success
    if (!options.key) {
      setTimeout(() => {
        onSuccess({
          razorpay_order_id: order.id,
          razorpay_payment_id: `mock_payment_${Date.now()}`,
          razorpay_signature: 'mock_signature',
        } as any);
      }, 300);
      return;
    }

    razorpay.open();
  } catch {
    onError({
      code: 'RAZORPAY_INIT_ERROR',
      description: 'Failed to initialize payment gateway',
      source: 'client',
      step: 'payment_initialization',
      reason: 'sdk_error'
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