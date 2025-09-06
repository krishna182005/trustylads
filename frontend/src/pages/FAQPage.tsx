import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, ShoppingBag, Truck, CreditCard, Shield } from 'lucide-react';
import { generateFAQSchema } from '../utils/schema';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const faqData: FAQItem[] = [
    // Ordering & Payment
    {
      question: "How do I place an order?",
      answer: "Placing an order is easy! Simply browse our products, add items to your cart, and proceed to checkout. You can pay using Cash on Delivery (COD) or online payment methods like UPI, cards, or digital wallets.",
      category: "ordering"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD) and various online payment methods including UPI, credit/debit cards, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
      category: "ordering"
    },
    {
      question: "Is it safe to pay online?",
      answer: "Yes, absolutely! We use secure payment gateways and encryption to protect your payment information. All online transactions are processed through trusted payment partners with industry-standard security measures.",
      category: "ordering"
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order if it's in 'Processing' or 'Packed' status. To cancel: Go to the Order Tracking page, scroll down to the end, and click the 'Cancel Order' button. Orders that are 'Shipped', 'Delivered', or 'Cancelled' cannot be cancelled. For assistance, contact us at +91 6369360104 or WhatsApp.",
      category: "ordering"
    },
    {
      question: "How do I cancel my order step by step?",
      answer: "To cancel your order: 1) Go to the Order Tracking page using your order ID, 2) Scroll down to the bottom of the page, 3) Look for the 'Cancel Order' button, 4) Click the button to cancel. This only works for orders in 'Processing' or 'Packed' status. Once cancelled, you'll receive a confirmation and refund within 5-7 business days.",
      category: "ordering"
    },
    // Shipping & Delivery
    {
      question: "How long does delivery take?",
      answer: "We offer free shipping across India with an average delivery time of 4-7 business days. Delivery times may vary based on your location and product availability.",
      category: "shipping"
    },
    {
      question: "Do you ship to all cities in India?",
      answer: "Yes, we deliver to all major cities and towns across India. We have extensive coverage including metro cities, tier-2 cities, and most rural areas.",
      category: "shipping"
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using your order ID on our website's Track Order page. You'll also receive email updates and can track directly with our courier partners.",
      category: "shipping"
    },
    {
      question: "What if my delivery fails?",
      answer: "If delivery fails, our courier will attempt delivery 2-3 times. You'll receive notifications about each attempt. If all attempts fail, we'll contact you to arrange re-delivery or refund.",
      category: "shipping"
    },
    // Returns & Refunds
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return window from the date of delivery. Products must be unused, in original packaging, and include all components. Some items like personal care products are non-returnable.",
      category: "returns"
    },
    {
      question: "How do I return an item?",
      answer: "Contact our customer support within 7 days of delivery via WhatsApp, email, or social media. Include your order ID and reason for return. We'll provide return instructions and process your refund within 5-7 business days.",
      category: "returns"
    },
    {
      question: "Are return shipping costs covered?",
      answer: "Customers are responsible for return shipping costs unless the item is defective or damaged. For defective items, we provide prepaid return labels.",
      category: "returns"
    },
    {
      question: "How long does it take to get a refund?",
      answer: "Refunds are processed within 5-7 business days after we receive your return. Processing time may vary depending on your payment method and bank processing times.",
      category: "returns"
    },
    // Product & Quality
    {
      question: "What is the quality of your products?",
      answer: "We source premium quality products and conduct thorough quality checks before shipping. All our products come with quality guarantees and we stand behind the quality of everything we sell.",
      category: "products"
    },
    {
      question: "Do you offer size guides?",
      answer: "Yes! We provide detailed size guides for all product categories including shirts, watches, and jewelry. You can find our comprehensive size guide on our website.",
      category: "products"
    },
    {
      question: "Are your products authentic?",
      answer: "Yes, all our products are authentic and sourced from authorized suppliers. We maintain strict quality control and only sell genuine products.",
      category: "products"
    },
    {
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged or defective product, contact us immediately within 48 hours of delivery. Take photos of the damage and we'll arrange for replacement or refund at no additional cost.",
      category: "products"
    },
    // Customer Support
    {
      question: "How can I contact customer support?",
      answer: "You can reach us via WhatsApp at +91 6369360104, email at support@trustylads.tech, or through our social media channels on Instagram and Facebook. We typically respond within 24 hours.",
      category: "support"
    },
    {
      question: "What are your customer support hours?",
      answer: "Our customer support team is available Monday to Saturday, 9 AM to 6 PM IST. For urgent matters, you can reach us on WhatsApp anytime.",
      category: "support"
    },
    {
      question: "Do you offer bulk orders?",
      answer: "Yes, we welcome bulk orders! Contact us directly via WhatsApp or email for bulk order inquiries, special pricing, and customized solutions.",
      category: "support"
    },
    {
      question: "Can I get a discount on my first order?",
      answer: "We regularly offer discounts and promotional deals. Follow us on Instagram and Facebook to stay updated on the latest offers and first-order discounts.",
      category: "support"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'ordering', name: 'Ordering & Payment', icon: ShoppingBag },
    { id: 'shipping', name: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', name: 'Returns & Refunds', icon: CreditCard },
    { id: 'products', name: 'Products & Quality', icon: Shield },
    { id: 'support', name: 'Customer Support', icon: HelpCircle }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Generate FAQ schema for SEO
  const faqSchema = generateFAQSchema(faqData.map(faq => ({
    question: faq.question,
    answer: faq.answer
  })));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-yellow-600" />
              <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">TrustyLads FAQ</h2>
            <p className="text-gray-600">
              Find answers to the most commonly asked questions about our products, services, and policies. 
              Can't find what you're looking for? Contact our customer support team.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-3 rounded-lg border transition-colors ${
                      activeCategory === category.id
                        ? 'bg-yellow-400 border-yellow-400 text-black'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our customer support team is here to help!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Email: <a href="mailto:support@trustylads.tech" className="text-yellow-600 hover:text-yellow-700">support@trustylads.tech</a></p>
                  <p>WhatsApp: <a href="https://wa.me/916369360104" className="text-yellow-600 hover:text-yellow-700">+91 6369360104</a></p>
                  <p>Instagram: <a href="https://www.instagram.com/trustylads?igsh=MTRraWIwdGM3eWVsMw==" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">@trustylads</a></p>
                  <p>Facebook: <a href="https://www.facebook.com/share/16NDSH4AmT/" className="text-yellow-600 hover:text-yellow-700" target="_blank" rel="noopener noreferrer">TrustyLads</a></p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Quick Links</h4>
                <div className="space-y-2 text-sm">
                  <Link to="/size-guide" className="block text-yellow-600 hover:text-yellow-700">Size Guide</Link>
                  <Link to="/returns-refunds" className="block text-yellow-600 hover:text-yellow-700">Returns & Refunds</Link>
                  <Link to="/shipping-info" className="block text-yellow-600 hover:text-yellow-700">Shipping Information</Link>
                  <Link to="/track" className="block text-yellow-600 hover:text-yellow-700">Track Order</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
