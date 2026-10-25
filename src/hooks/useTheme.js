import { useCallback, useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

// Keep in sync with the inline script in index.html that applies the theme
// before first paint (prevents a flash of the wrong theme).
const STORAGE_KEY = 'taskflow.theme';

function getInitialTheme() {
  const saved = readJSON(STORAGE_KEY, null);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b0d17' : '#f4f5fb');
    writeJSON(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      // Temporarily enable colour transitions everywhere for a smooth crossfade.
      root.classList.add('theme-anim');
      window.setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
