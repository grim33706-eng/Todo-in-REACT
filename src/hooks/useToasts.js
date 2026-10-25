import { useCallback, useEffect, useRef, useState } from 'react';
import { createId } from '../utils/todos';

const MAX_VISIBLE = 4;

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  /** notify({ type: 'success' | 'info' | 'danger', message, action?, duration? }) */
  const notify = useCallback(
    (toast) => {
      const id = createId();
      const duration = toast.duration ?? 3200;
      setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), { type: 'info', ...toast, id, duration }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return { toasts, notify, dismiss };
}
