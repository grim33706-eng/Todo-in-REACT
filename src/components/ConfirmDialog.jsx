import { AnimatePresence, motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

function DialogPanel({ title, description, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  // Lock scrolling, close on Escape and restore focus to the opener on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onCancel]);

  // Simple focus trap: keep Tab cycling inside the dialog.
  function handleKeyDown(event) {
    if (event.key !== 'Tab') return;
    const focusable = panelRef.current.querySelectorAll('button:not([disabled])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <motion.div
      className="dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <motion.div
        ref={panelRef}
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0.92, y: 16, rotateX: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        style={{ transformPerspective: 900 }}
      >
        <span className="dialog-icon" aria-hidden="true">
          <TriangleAlert size={22} />
        </span>
        <h2 id={titleId}>{title}</h2>
        <p id={descId}>{description}</p>
        <div className="dialog-actions">
          <motion.button type="button" className="btn btn-secondary" onClick={onCancel} whileTap={{ scale: 0.96 }} autoFocus>
            {cancelLabel}
          </motion.button>
          <motion.button type="button" className="btn btn-danger" onClick={onConfirm} whileTap={{ scale: 0.96 }}>
            {confirmLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ConfirmDialog({ open, cancelLabel = 'Cancel', ...props }) {
  return createPortal(
    <AnimatePresence>{open && <DialogPanel cancelLabel={cancelLabel} {...props} />}</AnimatePresence>,
    document.body,
  );
}
