import { useEffect, useState } from 'react';

/** Current timestamp, refreshed on an interval so relative times stay fresh. */
export function useNow(interval = 30000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return now;
}
