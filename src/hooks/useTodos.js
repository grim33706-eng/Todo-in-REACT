import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { readJSON, writeJSON } from '../utils/storage';
import { createId, isValidTodo } from '../utils/todos';

const STORAGE_KEY = 'taskflow.todos.v1';

function loadTodos() {
  const data = readJSON(STORAGE_KEY, []);
  return Array.isArray(data) ? data.filter(isValidTodo) : [];
}

function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [action.todo, ...state];
    case 'edit':
      return state.map((t) =>
        t.id === action.id ? { ...t, text: action.text, updatedAt: Date.now() } : t,
      );
    case 'toggle':
      return state.map((t) =>
        t.id === action.id
          ? { ...t, completed: !t.completed, completedAt: t.completed ? null : Date.now() }
          : t,
      );
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    case 'restore': {
      if (state.some((t) => t.id === action.todo.id)) return state;
      const next = [...state];
      next.splice(Math.min(action.index, next.length), 0, action.todo);
      return next;
    }
    case 'clearCompleted':
      return state.filter((t) => !t.completed);
    case 'replace':
      return action.todos;
    default:
      return state;
  }
}

/**
 * Owns the task collection: state, persistence and stable action callbacks.
 * Callbacks never change identity, so memoised rows don't re-render needlessly.
 */
export function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos);
  const todosRef = useRef(todos);

  useEffect(() => {
    todosRef.current = todos;
    writeJSON(STORAGE_KEY, todos);
  }, [todos]);

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) dispatch({ type: 'replace', todos: loadTodos() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addTodo = useCallback((text) => {
    const todo = {
      id: createId(),
      text,
      completed: false,
      createdAt: Date.now(),
      updatedAt: null,
      completedAt: null,
    };
    dispatch({ type: 'add', todo });
    return todo;
  }, []);

  const editTodo = useCallback((id, text) => dispatch({ type: 'edit', id, text }), []);

  /** Returns the new completed state, or null if the task no longer exists. */
  const toggleTodo = useCallback((id) => {
    const todo = todosRef.current.find((t) => t.id === id);
    if (!todo) return null;
    dispatch({ type: 'toggle', id });
    return !todo.completed;
  }, []);

  /** Returns what was removed so the caller can offer an undo. */
  const removeTodo = useCallback((id) => {
    const index = todosRef.current.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const todo = todosRef.current[index];
    dispatch({ type: 'remove', id });
    return { todo, index };
  }, []);

  const restoreTodo = useCallback(
    (todo, index) => dispatch({ type: 'restore', todo, index }),
    [],
  );

  const clearCompleted = useCallback(() => {
    const count = todosRef.current.filter((t) => t.completed).length;
    dispatch({ type: 'clearCompleted' });
    return count;
  }, []);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    return {
      total,
      completed,
      active: total - completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [todos]);

  return { todos, stats, addTodo, editTodo, toggleTodo, removeTodo, restoreTodo, clearCompleted };
}
