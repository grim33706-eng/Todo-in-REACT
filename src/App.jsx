import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Background from './components/Background';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import Header from './components/Header';
import Toaster from './components/Toaster';
import TodoFilters from './components/TodoFilters';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import { useNow } from './hooks/useNow';
import { useTheme } from './hooks/useTheme';
import { useToasts } from './hooks/useToasts';
import { useTodos } from './hooks/useTodos';
import { readJSON, writeJSON } from './utils/storage';
import { FILTERS, filterTodos } from './utils/todos';

const FILTER_KEY = 'taskflow.filter';

function getInitialFilter() {
  const saved = readJSON(FILTER_KEY, 'all');
  return FILTERS.includes(saved) ? saved : 'all';
}

function isTypingTarget(element) {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName))
  );
}

export default function App() {
  const { todos, stats, addTodo, editTodo, toggleTodo, removeTodo, restoreTodo, clearCompleted } =
    useTodos();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismiss } = useToasts();
  const [filter, setFilter] = useState(getInitialFilter);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef(null);
  const now = useNow();

  const visibleTodos = useMemo(() => filterTodos(todos, filter), [todos, filter]);

  useEffect(() => {
    writeJSON(FILTER_KEY, filter);
  }, [filter]);

  // Press "/" anywhere to jump to the task input.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const handleAdd = useCallback(
    (text) => {
      addTodo(text);
      // A new task would be hidden under "Completed", so reveal it.
      setFilter((f) => (f === 'completed' ? 'all' : f));
      notify({ type: 'success', message: 'Task added' });
    },
    [addTodo, notify],
  );

  const handleToggle = useCallback(
    (id) => {
      const completed = toggleTodo(id);
      if (completed === null) return;
      notify(
        completed
          ? { type: 'success', message: 'Task completed — nice work!' }
          : { type: 'info', message: 'Task moved back to active' },
      );
    },
    [toggleTodo, notify],
  );

  const handleEdit = useCallback(
    (id, text) => {
      editTodo(id, text);
      notify({ type: 'info', message: 'Task updated' });
    },
    [editTodo, notify],
  );

  const handleDelete = useCallback(
    (id) => {
      const removed = removeTodo(id);
      if (!removed) return;
      notify({
        type: 'danger',
        message: 'Task deleted',
        duration: 5000,
        action: { label: 'Undo', onClick: () => restoreTodo(removed.todo, removed.index) },
      });
    },
    [removeTodo, restoreTodo, notify],
  );

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const handleClearCompleted = useCallback(() => {
    const count = clearCompleted();
    setConfirmOpen(false);
    notify({
      type: 'danger',
      message: `Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`,
    });
  }, [clearCompleted, notify]);

  const emptyVariant = stats.total === 0 ? 'empty' : filter;

  return (
    <MotionConfig reducedMotion="user">
      <Background />

      <div className="app-shell">
        <Header theme={theme} onToggleTheme={toggleTheme} stats={stats} now={now} />

        <main className="main">
          <TodoStats stats={stats} />

          <motion.section
            className="panel-stack"
            aria-labelledby="tasks-heading"
            initial={{ opacity: 0, y: 28, rotateX: 6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <div className="panel">
              <div className="panel-head">
                <h2 id="tasks-heading">My tasks</h2>
                <span className="panel-hint">
                  Press <kbd>/</kbd> to add · double-click a task to edit
                </span>
              </div>

              <TodoForm onAdd={handleAdd} inputRef={inputRef} />

              <div className="toolbar">
                <TodoFilters filter={filter} onChange={setFilter} stats={stats} />
              </div>

              <div className="list-region">
                <TodoList
                  todos={visibleTodos}
                  now={now}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {visibleTodos.length === 0 && (
                    <EmptyState key={emptyVariant} variant={emptyVariant} onAction={focusInput} />
                  )}
                </AnimatePresence>
              </div>

              {stats.total > 0 && (
                <motion.footer className="panel-foot" layout="position">
                  <span className="foot-count">
                    <strong>{stats.active}</strong> {stats.active === 1 ? 'task' : 'tasks'}{' '}
                    remaining
                  </span>
                  <motion.button
                    type="button"
                    className="btn btn-ghost-danger"
                    onClick={openConfirm}
                    disabled={stats.completed === 0}
                    whileTap={stats.completed ? { scale: 0.96 } : undefined}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Clear completed
                  </motion.button>
                </motion.footer>
              )}
            </div>
          </motion.section>
        </main>

        <footer className="app-foot">Your tasks are saved privately in this browser.</footer>
      </div>

      <Toaster toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        open={confirmOpen}
        title="Clear completed tasks?"
        description={`This will permanently remove ${stats.completed} completed ${
          stats.completed === 1 ? 'task' : 'tasks'
        }. This can’t be undone.`}
        confirmLabel="Clear tasks"
        onConfirm={handleClearCompleted}
        onCancel={closeConfirm}
      />
    </MotionConfig>
  );
}
