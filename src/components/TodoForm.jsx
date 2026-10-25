import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'framer-motion';
import { CircleAlert, Plus } from 'lucide-react';
import { memo, useId, useState } from 'react';
import { MAX_TASK_LENGTH, validateTaskText } from '../utils/todos';

const COUNTER_THRESHOLD = MAX_TASK_LENGTH - 40;

function TodoForm({ onAdd, inputRef }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const errorId = useId();
  const inputId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    const result = validateTaskText(value);
    if (!result.ok) {
      setError(result.error);
      if (!reduceMotion) animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
      inputRef.current?.focus();
      return;
    }
    onAdd(result.text);
    setValue('');
    setError('');
  }

  function handleChange(event) {
    setValue(event.target.value);
    if (error) setError('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && value) {
      event.preventDefault();
      setValue('');
      setError('');
    }
  }

  const length = value.trim().length;

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div ref={scope} className={`input-wrap${error ? ' has-error' : ''}`}>
          <label htmlFor={inputId} className="sr-only">
            New task
          </label>
          <Plus className="input-icon" size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            id={inputId}
            className="task-input"
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            autoComplete="off"
            enterKeyHint="done"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          {length >= COUNTER_THRESHOLD && (
            <span className={`char-count${length > MAX_TASK_LENGTH ? ' over' : ''}`} aria-hidden="true">
              {length}/{MAX_TASK_LENGTH}
            </span>
          )}
          <kbd className="kbd-hint" aria-hidden="true">/</kbd>
        </div>

        <motion.button
          type="submit"
          className="btn btn-primary add-btn"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95, y: 1 }}
          aria-label="Add task"
        >
          <Plus size={18} strokeWidth={2.5} aria-hidden="true" />
          <span className="add-btn-text">Add task</span>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            className="form-error"
            role="alert"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <CircleAlert size={14} aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default memo(TodoForm);
