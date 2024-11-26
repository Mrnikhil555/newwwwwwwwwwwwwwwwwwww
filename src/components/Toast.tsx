import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast(message, {
    style: {
      background: type === 'success' ? '#10B981' : '#EF4444',
      color: '#fff',
      borderRadius: '0.5rem',
    },
    position: 'bottom-center',
  });
};

export const Toast = () => (
  <Toaster>
    {(t) => (
      <AnimatePresence>
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {t.message}
        </motion.div>
      </AnimatePresence>
    )}
  </Toaster>
);