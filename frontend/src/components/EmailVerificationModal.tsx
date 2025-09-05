import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, Clock, AlertCircle } from 'lucide-react';
import { useEmailVerification } from '../hooks/useEmailVerification';
import toast from 'react-hot-toast';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerified: (orderData?: any) => void;
  orderData?: any;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerified,
  orderData
}) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const { sendOTP, verifyOTP, loading } = useEmailVerification();

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Send OTP when modal opens
  useEffect(() => {
    if (isOpen && email) {
      handleSendOTP();
    }
  }, [isOpen, email]);

  const handleSendOTP = async () => {
    const result = await sendOTP(email, orderData);
    if (result.success) {
      setTimeLeft(10 * 60); // 10 minutes
      setCanResend(false);
      setOtp('');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    const result = await verifyOTP(email, otp);
    if (result.success) {
      onVerified(result.orderData);
      onClose();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    const result = await sendOTP(email, orderData);
    if (result.success) {
      setTimeLeft(10 * 60);
      setCanResend(false);
      setOtp('');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Email Verification</h2>
              <p className="text-sm text-gray-600">Secure your order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Security Verification Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  To prevent fraud and ensure order security, we need to verify your email address for online payments.
                </p>
              </div>
            </div>
          </div>

          {/* Email Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Verification code sent to:</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit verification code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          {/* Timer */}
          {timeLeft > 0 && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Code expires in {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {/* Resend Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendOTP}
              disabled={!canResend || loading}
              className={`text-sm ${
                canResend && !loading
                  ? 'text-blue-600 hover:text-blue-800 underline'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Sending...' : canResend ? 'Resend code' : 'Resend code in ' + formatTime(timeLeft)}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyOTP}
              disabled={!otp || otp.length !== 6 || loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            🔒 Your information is secure and encrypted. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
