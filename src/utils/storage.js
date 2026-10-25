// Safe wrappers around localStorage. Storage can be unavailable (private mode,
// blocked cookies, quota exceeded) or hold corrupted data, so every access is
// guarded and falls back to a sensible default instead of crashing the app.

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
