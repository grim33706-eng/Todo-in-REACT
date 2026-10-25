import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, Info, Trash2, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const ICONS = { success: CircleCheck, info: Info, danger: Trash2 };

export default function Toaster({ toasts, onDismiss }) {
  return createPortal(
    <div className="toaster" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] ?? Info;
          return (
            <motion.div
              key={toast.id}
              layout
              className={`toast toast-${toast.type}`}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.94, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            >
              <span className="toast-icon" aria-hidden="true">
                <Icon size={16} />
              </span>
              <span className="toast-message">{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  className="toast-action"
                  onClick={() => {
                    toast.action.onClick();
                    onDismiss(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                className="toast-close"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
              <motion.span
                className="toast-bar"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                aria-hidden="true"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
