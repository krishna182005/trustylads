import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Check, Lock, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CheckoutData } from '../types';
import { initiateRazorpayPayment } from '../utils/razorpay';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { isAuthenticated, user, refreshUser, incrementOrderCount } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderJustPlaced, setOrderJustPlaced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Refs for form fields to enable Enter key navigation
  const fieldRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    customer: { email: '', phone: '', name: '' },
    shipping: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India'
    },
    paymentMethod: 'razorpay'
  });

  // Auto-fill user details if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setCheckoutData(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          email: user.email || '',
          name: user.name || ''
        }
      }));
    }
  }, [isAuthenticated, user]);

  // Phone number is not auto-filled - user must enter manually



  const subtotal = getSubtotal();
  
  // Calculate discount (example: 10% off for products over ₹500)
  const discountPercentage = 10;
  const discountAmount = subtotal >= 500 ? Math.round(subtotal * (discountPercentage / 100)) : 0;
  
  // Free delivery for first 5 orders for signed-in users ONLY
  const isEligibleForFreeDelivery = isAuthenticated && user && (user.orderCount || 0) < 5;
  const shipping = isEligibleForFreeDelivery ? 0 : 99; // After first 5 orders, always ₹99 shipping
  
  // All taxes are included in product prices
  const total = subtotal - discountAmount + shipping;

  // Field order for Enter key navigation
  const fieldOrder = {
    1: ['customer.email', 'customer.phone', 'customer.name'],
    2: ['shipping.firstName', 'shipping.lastName', 'shipping.address', 'shipping.apartment', 'shipping.pinCode']
  };

  // Validation functions
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string): string => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit phone number';
    return '';
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value.trim()) return `${fieldName} is required`;
    return '';
  };

  const validatePinCode = (pinCode: string): string => {
    const pinCodeRegex = /^\d{6}$/;
    if (!pinCode) return 'PIN code is required';
    if (!pinCodeRegex.test(pinCode)) return 'Please enter a valid 6-digit PIN code';
    return '';
  };

  // Handle field validation
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'customer.email':
        return validateEmail(value);
      case 'customer.phone':
        return validatePhone(value);
      case 'shipping.firstName':
        return validateRequired(value, 'First name');
      case 'shipping.address':
        return validateRequired(value, 'Address');
      case 'shipping.city':
        return validateRequired(value, 'City');
      case 'shipping.state':
        return validateRequired(value, 'State');
      case 'shipping.pinCode':
        return validatePinCode(value);
      default:
        return '';
    }
  };

  // Handle field change with validation
  const handleFieldChange = (field: string, value: string) => {
    // Update the data
    const fieldParts = field.split('.');
    setCheckoutData(prev => {
      const newData = { ...prev };
      if (fieldParts.length === 2) {
        const section = fieldParts[0] as keyof CheckoutData;
        const key = fieldParts[1];
        if (section === 'customer') {
          newData.customer = {
            ...newData.customer,
            [key]: value
          };
        } else if (section === 'shipping') {
          newData.shipping = {
            ...newData.shipping,
            [key]: value
          };
        }
      }

      // Persist customer contact fields for future auto-fill
      try {
        if (field.startsWith('customer.')) {
          const toSave = {
            email: field === 'customer.email' ? value : newData.customer.email,
            phone: field === 'customer.phone' ? value : newData.customer.phone,
            name: field === 'customer.name' ? value : newData.customer.name,
          };
          localStorage.setItem('trustylads-customer-contact', JSON.stringify(toSave));
        }
      } catch (error) {
        console.warn('Failed to save customer contact details:', error);
      }
      return newData;
    });

    // Validate the field
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error;
  };

  // Handle Enter key navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentField: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const currentStepFields = fieldOrder[currentStep as keyof typeof fieldOrder] || [];
      const currentIndex = currentStepFields.indexOf(currentField);
      
      if (currentIndex < currentStepFields.length - 1) {
        // Move to next field in same step
        const nextField = currentStepFields[currentIndex + 1];
        const nextFieldRef = fieldRefs.current[nextField];
        if (nextFieldRef) {
          nextFieldRef.focus();
        }
      } else if (currentIndex === currentStepFields.length - 1) {
        // Last field in step, validate and move to next step
        const hasErrors = Object.values(validationErrors).some(error => error);
        if (!hasErrors && validateStep(currentStep)) {
          handleNext();
        } else {
          // Show validation errors
          toast.error('Please fix the validation errors before proceeding');
        }
      }
    }
  };

  // Handle field blur with validation
  const handleFieldBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Redirect to cart if cart is empty and we didn't just place an order
  useEffect(() => {
    if (items.length === 0 && !orderJustPlaced) {
      navigate('/cart');
    }
  }, [items.length, orderJustPlaced, navigate]);

  // Stock validation function
  const validateStock = (items: any[]) => {
    const stockIssues = [];
    
    for (const item of items) {
      if (item.quantity > item.maxStock) {
        stockIssues.push(`${item.name} (${item.size}): Requested ${item.quantity}, Available ${item.maxStock}`);
      }
    }
    
    return stockIssues;
  };

  const steps = [
    { number: 1, title: 'Contact', completed: currentStep > 1 },
    { number: 2, title: 'Shipping', completed: currentStep > 2 },
    { number: 3, title: 'Payment', completed: currentStep > 3 },
    { number: 4, title: 'Review', completed: false }
  ];

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(checkoutData.customer.email && checkoutData.customer.phone);
      case 2:
        return !!(checkoutData.shipping.firstName && checkoutData.shipping.address && 
                 checkoutData.shipping.city && checkoutData.shipping.state && checkoutData.shipping.pinCode);
      case 3:
        return !!checkoutData.paymentMethod;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      // Scroll to the step content instead of top
      setTimeout(() => {
        const stepContent = document.querySelector('[data-step-content]');
        if (stepContent) {
          stepContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/cart');
    }
  };

  const handlePinCodeChange = async (pinCode: string) => {
    setCheckoutData(prev => ({
      ...prev,
      shipping: { ...prev.shipping, pinCode }
    }));

    if (pinCode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
        const data = await response.json();
        
        if (data[0]?.Status === 'Success') {
          const { District, State } = data[0].PostOffice[0];
          setCheckoutData(prev => ({
            ...prev,
            shipping: { 
              ...prev.shipping, 
              city: District,
              state: State
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch pincode data:', error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Check if items exist and are valid
      if (!items || items.length === 0) {
        toast.error('No items in cart. Please add items before placing order.');
        setLoading(false);
        return;
      }

      // Validate items structure
      const validItems = items.filter(item => 
        item.productId && item.name && item.size && item.quantity > 0
      );
      
      if (validItems.length === 0) {
        toast.error('Invalid items in cart. Please refresh and try again.');
        setLoading(false);
        return;
      }

      // Check stock availability
      const stockIssues = validateStock(validItems);
      if (stockIssues.length > 0) {
        toast.error(`Insufficient stock for the following items:\n${stockIssues.join('\n')}`);
        setLoading(false);
        return;
      }

      // Clean up empty strings and only send fields with actual values
      const cleanCustomer = {
        email: checkoutData.customer.email.trim(),
        phone: checkoutData.customer.phone.trim(),
        ...(checkoutData.customer.name && { name: checkoutData.customer.name.trim() })
      };

      const cleanShipping = {
        firstName: checkoutData.shipping.firstName.trim(),
        address: checkoutData.shipping.address.trim(),
        city: checkoutData.shipping.city.trim(),
        state: checkoutData.shipping.state.trim(),
        pinCode: checkoutData.shipping.pinCode.trim(),
        country: checkoutData.shipping.country.trim(),
        ...(checkoutData.shipping.lastName && { lastName: checkoutData.shipping.lastName.trim() }),
        ...(checkoutData.shipping.company && { company: checkoutData.shipping.company.trim() }),
        ...(checkoutData.shipping.apartment && { apartment: checkoutData.shipping.apartment.trim() })
      };

      const orderData = {
        customer: cleanCustomer,
        shipping: cleanShipping,
        items: validItems, // Use validated items instead of original items
        paymentMethod: checkoutData.paymentMethod,
        subtotal,
        shippingCost: shipping,
        discountAmount,
        total
      };

      // Debug: Log what we're sending to the backend (only in development)
      if (import.meta.env.DEV) {
        console.log('Sending orderData to backend:', { 
          itemCount: items.length, 
          total: orderData.total,
          paymentMethod: orderData.paymentMethod 
        });
        console.log('Items being sent:', items.map(item => ({ name: item.name, quantity: item.quantity })));
        console.log('Customer data:', { name: cleanCustomer.name, email: cleanCustomer.email });
        console.log('Shipping data:', { city: cleanShipping.city, state: cleanShipping.state });
      }

      if (checkoutData.paymentMethod === 'razorpay') {
        // Create Razorpay order
        const response = await apiClient.post<any>('/api/payments/razorpay/create', {
          amount: total,
          orderId: `TL${Date.now()}`,
          customer: checkoutData.customer
        });

        // If backend is in mock mode, do not proceed to payment
        if (response?.mock) {
          toast.error('Payment gateway is not fully configured. Please add Razorpay keys and restart backend.');
          setCurrentStep(3);
          setLoading(false);
          return;
        }

        await initiateRazorpayPayment(
          response.order,
          checkoutData,
          async (razorpayResponse) => {
            // Verify payment and create order
            const verifyResponse: any = await apiClient.post('/api/payments/razorpay/verify', {
              ...razorpayResponse,
              orderId: response.order.receipt,
              orderData: orderData // Send complete order data
            });

            if (verifyResponse) {
              const finalOrderId = verifyResponse.orderId || response.order.receipt;
              // Update order count immediately for UI responsiveness
              if (isAuthenticated) {
                incrementOrderCount();
                // Also refresh from server to ensure consistency
                try {
                  await refreshUser();
                } catch (error) {
                  console.error('Failed to refresh user data:', error);
                }
              }
              // Prevent redirect to cart by marking intentional navigation
              setOrderJustPlaced(true);
              // Navigate first, then clear cart to avoid race conditions
              setTimeout(() => navigate(`/order-success/${finalOrderId}`, { replace: true }), 0);
              setTimeout(() => clearCart(), 0);
            }
          },
          (error) => {
            toast.error(`Payment failed: ${error.description || error.message}`);
            // Return to payment step to let user retry
            setCurrentStep(3);
            setLoading(false);
          }
        );
      } else {
        // COD Order
        try {
          const result = await apiClient.post<any>('/api/orders', orderData);
          
          // Debug: Log the actual processed result (apiClient returns data, not AxiosResponse)
          if (import.meta.env.DEV) {
            console.log('Order create result:', { 
              success: result?.success, 
              orderId: result?.orderId,
              trackingId: result?.trackingId 
            });
          }
          
          const orderId = result?.orderId ?? result?.data?.orderId;
          if (orderId) {
            // Update order count immediately for UI responsiveness
            if (isAuthenticated) {
              incrementOrderCount();
              // Also refresh from server to ensure consistency
              try {
                await refreshUser();
              } catch (error) {
                console.error('Failed to refresh user data:', error);
              }
            }
            // Mark that we're intentionally navigating after clearing cart
            setOrderJustPlaced(true);
            // Navigate first to avoid render-phase updates and cart guard races
            setTimeout(() => navigate(`/order-success/${orderId}`, { replace: true }), 0);
            // Clear the cart on the next tick so success page mounts cleanly
            setTimeout(() => clearCart(), 0);
          } else {
            console.error('Response validation failed:', {
              hasOrderId: !!orderId,
              actualResult: result
            });
            throw new Error('Invalid response format from server');
          }
        } catch (error: any) {
          console.error('COD Order placement error:', error);
          
          // Handle specific error types
          if (error.response?.data?.message) {
            const errorMessage = error.response.data.message;
            if (errorMessage.includes('Insufficient stock')) {
              toast.error(`Stock issue: ${errorMessage}. Please check your cart and try again.`);
            } else if (errorMessage.includes('Validation failed')) {
              toast.error(`Validation error: ${errorMessage}. Please check your information.`);
            } else {
              toast.error(`Order failed: ${errorMessage}`);
            }
          } else {
            toast.error('Failed to place COD order. Please try again.');
          }
          return; // Don't clear cart or navigate on error
        }
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

     return (
     <div className="min-h-screen bg-gray-50 py-8 pb-16 sm:pb-20">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Back to Cart' : 'Previous Step'}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </motion.div>

                 {/* User Authentication Status */}
         <motion.div 
           className="mb-6"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
         >
           <div className={`flex items-center p-4 rounded-lg ${
             isAuthenticated 
               ? 'bg-green-50 border border-green-200' 
               : 'bg-blue-50 border border-blue-200'
           }`}>
             <User className={`h-5 w-5 mr-3 ${
               isAuthenticated ? 'text-green-600' : 'text-blue-600'
             }`} />
             <div>
               <p className={`font-medium ${
                 isAuthenticated ? 'text-green-800' : 'text-blue-800'
               }`}>
                 {isAuthenticated ? 'Signed in as ' + (user?.name || user?.email) : 'Guest Checkout'}
               </p>
               <p className={`text-sm ${
                 isAuthenticated ? 'text-green-600' : 'text-blue-600'
               }`}>
                 {isAuthenticated 
                   ? 'Your order will be linked to your account for easy tracking.' 
                   : 'Create an account after checkout to track your orders easily.'
                 }
               </p>
             </div>
           </div>
         </motion.div>

         {/* Security Badges */}
         <motion.div 
           className="mb-6"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.3 }}
         >
           <div className="bg-white border border-gray-200 rounded-lg p-4">
             <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
               <div className="flex items-center">
                 <Lock className="h-4 w-4 mr-2 text-green-600" />
                 <span>SSL Secured</span>
               </div>
               <div className="flex items-center">
                 <Check className="h-4 w-4 mr-2 text-green-600" />
                 <span>PCI Compliant</span>
               </div>
               <div className="flex items-center">
                 <Shield className="h-4 w-4 mr-2 text-green-600" />
                 <span>256-bit Encryption</span>
               </div>
             </div>
           </div>
         </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between overflow-x-auto no-scrollbar -mx-2 px-2 sm:overflow-visible sm:mx-0 sm:px-0">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-shrink-0 mr-4 last:mr-0 sm:mr-0">
                    <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 ${
                      step.completed ? 'bg-green-500 border-green-500 text-white' :
                      currentStep === step.number ? 'bg-yellow-400 border-yellow-400 text-black' :
                      'bg-white border-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : step.number}
                    </div>
                    <span className={`ml-2 text-xs sm:text-sm font-medium ${
                      step.completed || currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`hidden md:block w-10 sm:w-16 h-px mx-2 sm:mx-4 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step Content */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              key={currentStep}
              data-step-content
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['customer.email'] = el}
                        type="email"
                        required
                        value={checkoutData.customer.email}
                        onChange={(e) => handleFieldChange('customer.email', e.target.value)}
                        onBlur={(e) => handleFieldBlur('customer.email', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'customer.email')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['customer.email'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {validationErrors['customer.email'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['customer.email']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['customer.phone'] = el}
                        type="tel"
                        required
                        value={checkoutData.customer.phone}
                        onChange={(e) => handleFieldChange('customer.phone', e.target.value)}
                        onBlur={(e) => handleFieldBlur('customer.phone', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'customer.phone')}
                        pattern="[6-9]\d{9}"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['customer.phone'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                      />
                      {validationErrors['customer.phone'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['customer.phone']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['customer.name'] = el}
                        type="text"
                        value={checkoutData.customer.name}
                        onChange={(e) => handleFieldChange('customer.name', e.target.value)}
                        onBlur={(e) => handleFieldBlur('customer.name', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'customer.name')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['customer.name'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your full name"
                      />
                      {validationErrors['customer.name'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['customer.name']}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.firstName'] = el}
                        type="text"
                        required
                        value={checkoutData.shipping.firstName}
                        onChange={(e) => handleFieldChange('shipping.firstName', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.firstName', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.firstName')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['shipping.firstName'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors['shipping.firstName'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.firstName']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.lastName'] = el}
                        type="text"
                        value={checkoutData.shipping.lastName}
                        onChange={(e) => handleFieldChange('shipping.lastName', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.lastName', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.lastName')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['shipping.lastName'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors['shipping.lastName'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.lastName']}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.address'] = el}
                        type="text"
                        required
                        value={checkoutData.shipping.address}
                        onChange={(e) => handleFieldChange('shipping.address', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.address', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.address')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['shipping.address'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="House number and street name"
                      />
                      {validationErrors['shipping.address'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.address']}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc.
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.apartment'] = el}
                        type="text"
                        value={checkoutData.shipping.apartment}
                        onChange={(e) => handleFieldChange('shipping.apartment', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.apartment', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.apartment')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['shipping.apartment'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                      {validationErrors['shipping.apartment'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.apartment']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.pinCode'] = el}
                        type="text"
                        required
                        value={checkoutData.shipping.pinCode}
                        onChange={(e) => handlePinCodeChange(e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.pinCode', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.pinCode')}
                        pattern="\d{6}"
                        maxLength={6}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                          validationErrors['shipping.pinCode'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                      />
                      {validationErrors['shipping.pinCode'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.pinCode']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.city'] = el}
                        type="text"
                        required
                        value={checkoutData.shipping.city}
                        onChange={(e) => handleFieldChange('shipping.city', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.city', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.city')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 ${
                          validationErrors['shipping.city'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        readOnly
                      />
                      {validationErrors['shipping.city'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.city']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        ref={(el) => fieldRefs.current['shipping.state'] = el}
                        type="text"
                        required
                        value={checkoutData.shipping.state}
                        onChange={(e) => handleFieldChange('shipping.state', e.target.value)}
                        onBlur={(e) => handleFieldBlur('shipping.state', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'shipping.state')}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-gray-50 ${
                          validationErrors['shipping.state'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        readOnly
                      />
                      {validationErrors['shipping.state'] && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors['shipping.state']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value="India"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        checkoutData.paymentMethod === 'razorpay' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                      }`}
                      onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="razorpay"
                          checked={checkoutData.paymentMethod === 'razorpay'}
                          onChange={() => {}}
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                        />
                        <CreditCard className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <div>
                          <p className="font-medium">Online Payment</p>
                          <p className="text-sm text-gray-600">UPI, Cards, Net Banking via Razorpay</p>
                        </div>
                      </div>
                      {checkoutData.paymentMethod === 'razorpay' && (
                        <div className="mt-3 ml-9 flex items-center text-sm text-gray-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Secured by Razorpay
                        </div>
                      )}
                    </div>

                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        checkoutData.paymentMethod === 'cod' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                      }`}
                      onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={checkoutData.paymentMethod === 'cod'}
                          onChange={() => {}}
                          className="h-4 w-4 text-yellow-400 focus:ring-yellow-400"
                        />
                        <Banknote className="h-5 w-5 ml-3 mr-2 text-gray-600" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-6">Review Your Order</h2>
                  
                  {/* Customer Details */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-600">{checkoutData.customer.email}</p>
                    <p className="text-sm text-gray-600">{checkoutData.customer.phone}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{checkoutData.shipping.firstName} {checkoutData.shipping.lastName}</p>
                      <p>{checkoutData.shipping.address}</p>
                      {checkoutData.shipping.apartment && <p>{checkoutData.shipping.apartment}</p>}
                      <p>{checkoutData.shipping.city}, {checkoutData.shipping.state} - {checkoutData.shipping.pinCode}</p>
                      <p>{checkoutData.shipping.country}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {checkoutData.paymentMethod === 'razorpay' ? 'Online Payment (Razorpay)' : 
                       checkoutData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                       'Bank Transfer'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || '/api/placeholder/50/60'}
                            alt={item.name}
                            className="w-12 h-15 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                            <p className={`text-xs ${item.quantity > item.maxStock ? 'text-red-600' : 'text-green-600'}`}>
                              Stock: {item.maxStock} available
                            </p>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Note */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      📦 Your order will arrive in our signature neon yellow box!
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Estimated delivery: 5-7 business days
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      checkoutData.paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                    <img
                      src={item.image || '/api/placeholder/40/50'}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">+{items.length - 3} more items</p>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                                 {discountAmount > 0 && (
                   <div className="flex justify-between text-sm text-green-600">
                     <span>Discount ({discountPercentage}% off)</span>
                     <span>-₹{discountAmount.toLocaleString()}</span>
                   </div>
                 )}
                 
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                   <span>
                     {shipping === 0 ? (
                       <span className="text-green-600">
                         {isEligibleForFreeDelivery ? 'Free (First 5 orders)' : 'Free'}
                       </span>
                     ) : (
                       `₹${shipping}`
                     )}
                   </span>
                </div>
                 
                 <div className="flex justify-between text-sm text-gray-500">
                   <span>Includes all taxes</span>
                </div>
                 
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                
                                 {isEligibleForFreeDelivery && (
                   <p className="text-xs text-green-600 text-center mt-2">
                     🎉 Free delivery! {5 - (user?.orderCount || 0)} orders left
                   </p>
                 )}
              </div>
            </div>
          </motion.div>
                 </div>
       </div>

               {/* Animated Security Strip */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white py-1 sm:py-2 overflow-hidden z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8 text-xs sm:text-sm font-medium animate-pulse px-2">
            <div className="flex items-center">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Secure Checkout</span>
              <span className="sm:hidden">Secure</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">256-bit SSL Encryption</span>
              <span className="hidden sm:inline md:hidden">SSL Encrypted</span>
              <span className="sm:hidden">SSL</span>
            </div>
            <div className="flex items-center">
              <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden lg:inline">PCI DSS Compliant</span>
              <span className="hidden sm:inline lg:hidden">PCI Compliant</span>
              <span className="sm:hidden">PCI</span>
            </div>
            <div className="flex items-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xl:inline">Trusted by 10,000+ Customers</span>
              <span className="hidden md:inline xl:hidden">10,000+ Customers</span>
              <span className="hidden sm:inline md:hidden">Trusted</span>
              <span className="sm:hidden">✓</span>
            </div>
          </div>
        </motion.div>
     </div>
   );
 };

export default CheckoutPage;