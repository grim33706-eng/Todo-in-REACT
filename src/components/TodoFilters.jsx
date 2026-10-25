import { motion } from 'framer-motion';
import { Circle, CircleCheck, ListTodo } from 'lucide-react';
import { memo } from 'react';

const OPTIONS = [
  { value: 'all', label: 'All', icon: ListTodo, countKey: 'total' },
  { value: 'active', label: 'Active', icon: Circle, countKey: 'active' },
  { value: 'completed', label: 'Completed', icon: CircleCheck, countKey: 'completed' },
];

function TodoFilters({ filter, onChange, stats }) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {OPTIONS.map(({ value, label, icon: Icon, countKey }) => {
        const active = filter === value;
        return (
          <button
            key={value}
            type="button"
            className={`filter-btn${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange(value)}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="filter-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="filter-content">
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
              <span className="filter-count">{stats[countKey]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(TodoFilters);
