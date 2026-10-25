export const MAX_TASK_LENGTH = 200;

export const FILTERS = ['all', 'active', 'completed'];

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Normalises whitespace and checks the task text. */
export function validateTaskText(raw) {
  const text = typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '';
  if (!text) {
    return { ok: false, error: 'Please type a task before adding it.' };
  }
  if (text.length > MAX_TASK_LENGTH) {
    return {
      ok: false,
      error: `Keep it under ${MAX_TASK_LENGTH} characters (currently ${text.length}).`,
    };
  }
  return { ok: true, text };
}

/** Guards against malformed records coming back from localStorage. */
export function isValidTodo(todo) {
  return (
    todo !== null &&
    typeof todo === 'object' &&
    typeof todo.id === 'string' &&
    typeof todo.text === 'string' &&
    todo.text.trim() !== '' &&
    typeof todo.completed === 'boolean' &&
    Number.isFinite(todo.createdAt)
  );
}

export function filterTodos(todos, filter) {
  if (filter === 'active') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos;
}

export function formatRelative(timestamp, now) {
  const seconds = Math.max(0, now - timestamp) / 1000;
  if (seconds < 45) return 'just now';
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatFull(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
