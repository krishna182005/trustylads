import { useState } from 'react';
import { apiClient } from '../utils/api';
import toast from 'react-hot-toast';

interface EmailVerificationHook {
  sendOTP: (email: string, orderData?: any) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string; orderData?: any }>;
  checkVerification: (email: string) => Promise<{ success: boolean; verified: boolean }>;
  loading: boolean;
  error: string | null;
}

export const useEmailVerification = (): EmailVerificationHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOTP = async (email: string, orderData?: any): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/email-verification/send-otp', {
        email,
        orderData
      }) as { success: boolean; message: string; token?: string };

      if (response.success) {
        toast.success(response.message);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        toast.error(response.message);
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string; orderData?: any }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/email-verification/verify-otp', {
        email,
        otp
      }) as { success: boolean; message: string; orderData?: any };

      if (response.success) {
        toast.success(response.message);
        return { 
          success: true, 
          message: response.message,
          orderData: response.orderData
        };
      } else {
        setError(response.message);
        toast.error(response.message);
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to verify code';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const checkVerification = async (email: string): Promise<{ success: boolean; verified: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/email-verification/check-verification/${email}`) as { success: boolean; verified: boolean; message?: string };
      
      if (response.success) {
        return { success: true, verified: response.verified };
      } else {
        setError(response.message || 'Failed to check verification status');
        return { success: false, verified: false };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to check verification status';
      setError(errorMessage);
      return { success: false, verified: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    checkVerification,
    loading,
    error
  };
};
