/**
 * JSON-LD Schema Generator for SEO and Bot Optimization
 */

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{ url: string; isPrimary?: boolean }>;
  category: string | { name: string };
  totalStock: number;
  reviews?: Array<{
    rating: number;
    comment: string;
    user: { name: string };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const generateProductSchema = (product: Product) => {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
  
  // Calculate average rating
  const avgRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": primaryImage ? `https://www.trustylads.tech${primaryImage.url}` : undefined,
    "brand": {
      "@type": "Brand",
      "name": "TrustyLads"
    },
    "category": categoryName,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "TrustyLads",
        "url": "https://www.trustylads.tech"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          },
          "cutoffTime": "14:00",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      }
    },
    "aggregateRating": product.reviews && product.reviews.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": product.reviews.length,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "review": product.reviews?.slice(0, 5).map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5,
        "worstRating": 1
      },
      "author": {
        "@type": "Person",
        "name": review.user.name
      },
      "reviewBody": review.comment,
      "datePublished": review.createdAt
    })) || [],
    "sku": product._id,
    "mpn": product._id,
    "url": `https://www.trustylads.tech/product/${product._id}`,
    "datePublished": product.createdAt,
    "dateModified": product.updatedAt
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrustyLads",
    "url": "https://www.trustylads.tech",
    "description": "Premium quality products for the bold and confident. Made in India, for India.",
    "publisher": {
      "@type": "Organization",
      "name": "TrustyLads",
      "url": "https://www.trustylads.tech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.trustylads.tech/logo.svg"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.trustylads.tech/shop?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.instagram.com/trustylads",
      "https://www.facebook.com/share/16NDSH4AmT/"
    ]
  };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://www.trustylads.tech${item.url}`
    }))
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
