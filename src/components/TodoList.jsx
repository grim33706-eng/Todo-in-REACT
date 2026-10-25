import { AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';

export default function TodoList({ todos, now, onToggle, onEdit, onDelete }) {
  return (
    <ul className="todo-list" aria-label="Tasks">
      <AnimatePresence mode="popLayout" initial={false}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            now={now}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
