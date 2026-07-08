import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toast } from '../types';

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full bg-white border border-outline-variant rounded-2xl shadow-lg p-4 flex items-start gap-3.5 relative overflow-hidden"
            >
              {/* Left Color Indicator Bar */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isSuccess ? 'bg-emerald-500' : isError ? 'bg-rose-500' : 'bg-blue-500'
                }`}
              />
              
              {/* Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isSuccess ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                ) : isError ? (
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      error
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      info
                    </span>
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-grow pr-6">
                <p className="font-bold text-xs text-on-surface font-sans uppercase tracking-wider mb-0.5">
                  {isSuccess ? 'Éxito' : isError ? 'Error' : 'Aviso'}
                </p>
                <p className="text-sm text-on-surface-variant font-medium font-sans leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => onClose(toast.id)}
                className="absolute top-3 right-3 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high p-1 rounded-full transition-colors"
                aria-label="Cerrar notificación"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>

              {/* Simple Auto-collapse indicator bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 ${
                  isSuccess ? 'bg-emerald-500/30' : isError ? 'bg-rose-500/30' : 'bg-blue-500/30'
                }`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
