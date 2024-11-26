import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AdBannerProps {
  className?: string;
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'rectangle';
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  className = '',
  slot = '1234567890',
  format = 'horizontal'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize ads when there's actual content around them
    if (adRef.current && !initialized.current && document.readyState === 'complete') {
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.setAttribute('data-ad-client', 'ca-pub-4546141241525552');
      adElement.setAttribute('data-ad-slot', slot);
      adElement.setAttribute('data-ad-format', format);
      adElement.setAttribute('data-full-width-responsive', 'true');

      // Clear existing content
      if (adRef.current.children.length === 0) {
        adRef.current.appendChild(adElement);
        try {
          // Ensure window.adsbygoogle is initialized
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          initialized.current = true;
        } catch (error) {
          console.error('Error loading AdSense:', error);
        }
      }
    }

    return () => {
      initialized.current = false;
    };
  }, [slot, format]);

  return (
    <motion.div 
      ref={adRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className={`ad-banner ${className} min-h-[100px] bg-black/10 backdrop-blur-sm rounded-lg overflow-hidden my-8`}
    />
  );
};

export default AdBanner;