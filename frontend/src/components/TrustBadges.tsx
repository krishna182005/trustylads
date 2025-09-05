import { Wallet, ShieldCheck, Truck, Lock, CheckCircle } from 'lucide-react';

/**
 * TrustBadges - Production-ready trust and payment badges for TrustyLads
 *
 * Example usage:
 *
 * import TrustBadges from '@/components/TrustBadges';
 *
 * // Default
 * <TrustBadges />
 *
 * // Tight footer variant
 * <TrustBadges className="mt-6" />
 *
 * // Full-width checkout variant
 * <div className="w-full"><TrustBadges /></div>
 *
 * Legal note: Only display the Razorpay wordmark if payments are actually
 * processed through Razorpay on this site. Do not modify, recolor, or distort
 * the Razorpay logo. Refer to their brand guidelines: https://razorpay.com/brand/
 */
export default function TrustBadges(props?: { className?: string }) {
  return (
    <section 
      className={`bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 rounded-xl shadow-sm p-2 sm:p-3 ${props?.className || ''}`}
      role="region" 
      aria-labelledby="trust-badges-heading"
    >
      <h2 id="trust-badges-heading" className="sr-only">
        Trust & Payment badges
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* SSL Secure */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <Lock 
            className="w-4 h-4 text-green-600 dark:text-green-400" 
            aria-hidden="true" 
          />
          <span className="text-xs font-medium text-black dark:text-black">
            SSL Secure
          </span>
        </div>

        {/* Safe Checkout */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <CheckCircle 
            className="w-4 h-4 text-green-600 dark:text-green-400" 
            aria-hidden="true" 
          />
          <span className="text-xs font-medium text-black dark:text-black">
            Safe Checkout
          </span>
        </div>

        {/* Powered by Razorpay */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <img
            src="https://razorpay.com/assets/razorpay-logo.svg"
            alt="Powered by Razorpay"
            className="h-5 w-auto"
            loading="lazy"
          />
        </div>

        {/* Cash on Delivery */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <Wallet 
            className="w-4 h-4 text-blue-600 dark:text-blue-400" 
            aria-hidden="true" 
          />
          <span className="text-xs font-medium text-black dark:text-black">
            COD Available
          </span>
        </div>

        {/* Easy Returns */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <ShieldCheck 
            className="w-4 h-4 text-purple-600 dark:text-purple-400" 
            aria-hidden="true" 
          />
          <span className="text-xs font-medium text-black dark:text-black">
            7-Day Returns
          </span>
        </div>

        {/* Fast Shipping */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-white dark:bg-white border border-gray-200 dark:border-gray-300">
          <Truck 
            className="w-4 h-4 text-orange-600 dark:text-orange-400" 
            aria-hidden="true" 
          />
          <span className="text-xs font-medium text-black dark:text-black">
            Fast Shipping
          </span>
        </div>
      </div>
    </section>
  );
}


