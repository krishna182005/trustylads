import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  type: 'success' | 'info' | 'error';
  onResend?: () => void;
  isResending?: boolean;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  type,
  onResend,
  isResending = false
}) => {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Verification Email Sent!',
          message: `We've sent a verification link to ${email}`,
          details: 'Please check your email and click the verification link to activate your account.',
          buttonText: 'Got it!',
          buttonClass: 'bg-green-500 hover:bg-green-600'
        };
      case 'info':
        return {
          icon: <Mail className="h-16 w-16 text-blue-500" />,
          title: 'Check Your Email',
          message: `Verification email sent to ${email}`,
          details: 'Please check your inbox and spam folder. Click the verification link to complete your registration.',
          buttonText: 'Understood',
          buttonClass: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-16 w-16 text-red-500" />,
          title: 'Email Not Sent',
          message: 'There was an issue sending the verification email',
          details: 'Please try again or contact support if the problem persists.',
          buttonText: 'Try Again',
          buttonClass: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          icon: <Mail className="h-16 w-16 text-blue-500" />,
          title: 'Check Your Email',
          message: `Verification email sent to ${email}`,
          details: 'Please check your inbox and spam folder.',
          buttonText: 'Got it!',
          buttonClass: 'bg-blue-500 hover:bg-blue-600'
        };
    }
  };

  const content = getContent();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {content.icon}
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {content.title}
            </h2>
            
            <p className="text-lg text-gray-700">
              {content.message}
            </p>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {content.details}
            </p>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Important:</p>
                  <ul className="text-xs text-gray-600 mt-1 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• The link expires in 1 hour</li>
                    <li>• You must verify before logging in</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-6">
              {onResend && type !== 'error' && (
                <button
                  onClick={onResend}
                  disabled={isResending}
                  className="flex-1 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Resend Email'
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className={`flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${content.buttonClass}`}
              >
                {content.buttonText}
              </button>
            </div>

            {/* Support Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need help? Contact us at{' '}
                <a 
                  href="mailto:support@trustylads.com" 
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  support@trustylads.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationModal;
