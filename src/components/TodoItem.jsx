import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleAlert, Clock, Pencil, Trash2, X } from 'lucide-react';
import { memo, useEffect, useId, useRef, useState } from 'react';
import { formatFull, formatRelative, validateTaskText } from '../utils/todos';

const itemTransition = { type: 'spring', stiffness: 380, damping: 32 };

function Checkbox({ checked, label, onToggle }) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`check${checked ? ' is-checked' : ''}`}
      onClick={onToggle}
      whileTap={{ scale: 0.82 }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </svg>
      <AnimatePresence initial={false}>
        {checked && (
          <motion.span
            key="burst"
            className="check-burst"
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function TodoItem({ todo, now, onToggle, onEdit, onDelete, ref }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const editRowRef = useRef(null);
  const errorId = useId();

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEditing() {
    setDraft(todo.text);
    setError('');
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError('');
  }

  function save() {
    const result = validateTaskText(draft);
    if (!result.ok) {
      setError(result.error);
      inputRef.current?.focus();
      return;
    }
    if (result.text !== todo.text) onEdit(todo.id, result.text);
    setEditing(false);
  }

  function handleEditKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      save();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  }

  // Leaving the edit row (e.g. clicking elsewhere) saves valid edits and discards invalid ones.
  function handleEditBlur(event) {
    if (editRowRef.current?.contains(event.relatedTarget)) return;
    if (validateTaskText(draft).ok) save();
    else cancelEditing();
  }

  const className = [
    'todo-item',
    todo.completed && 'is-done',
    editing && 'is-editing',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.li
      ref={ref}
      layout
      className={className}
      initial={{ opacity: 0, y: -14, scale: 0.97, rotateX: -24 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, x: 48, scale: 0.94, transition: { duration: 0.22, ease: 'easeIn' } }}
      transition={itemTransition}
      style={{ transformPerspective: 900 }}
    >
      <Checkbox
        checked={todo.completed}
        label={`Mark "${todo.text}" as ${todo.completed ? 'not completed' : 'completed'}`}
        onToggle={() => onToggle(todo.id)}
      />

      <div className="todo-body">
        {editing ? (
          <div className="edit-row" ref={editRowRef} onBlur={handleEditBlur}>
            <input
              ref={inputRef}
              className={`edit-input${error ? ' has-error' : ''}`}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleEditKeyDown}
              aria-label="Edit task"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              enterKeyHint="done"
            />
            <div className="todo-actions is-visible">
              <motion.button
                type="button"
                className="action-btn save"
                onClick={save}
                whileTap={{ scale: 0.88 }}
                aria-label="Save changes"
                title="Save (Enter)"
              >
                <Check size={17} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                type="button"
                className="action-btn"
                onClick={cancelEditing}
                whileTap={{ scale: 0.88 }}
                aria-label="Cancel editing"
                title="Cancel (Esc)"
              >
                <X size={17} />
              </motion.button>
            </div>
          </div>
        ) : (
          <span className="todo-text" onDoubleClick={startEditing}>
            {todo.text}
          </span>
        )}

        {editing && error ? (
          <p id={errorId} className="form-error inline" role="alert">
            <CircleAlert size={13} aria-hidden="true" />
            {error}
          </p>
        ) : (
          <div className="todo-meta">
            <span className="meta-item" title={`Created ${formatFull(todo.createdAt)}`}>
              <Clock size={12} aria-hidden="true" />
              Added {formatRelative(todo.createdAt, now)}
            </span>
            {todo.updatedAt && (
              <span className="meta-item" title={`Edited ${formatFull(todo.updatedAt)}`}>
                · Edited
              </span>
            )}
            <AnimatePresence initial={false}>
              {todo.completed && (
                <motion.span
                  className="done-chip"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  title={todo.completedAt ? `Completed ${formatFull(todo.completedAt)}` : undefined}
                >
                  <Check size={11} strokeWidth={3} aria-hidden="true" />
                  Done
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {!editing && (
        <div className="todo-actions">
          <motion.button
            type="button"
            className="action-btn"
            onClick={startEditing}
            whileTap={{ scale: 0.88 }}
            aria-label={`Edit "${todo.text}"`}
            title="Edit"
          >
            <Pencil size={16} />
          </motion.button>
          <motion.button
            type="button"
            className="action-btn danger"
            onClick={() => onDelete(todo.id)}
            whileTap={{ scale: 0.88 }}
            aria-label={`Delete "${todo.text}"`}
            title="Delete"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      )}
    </motion.li>
  );
}

export default memo(TodoItem);
