import { motion } from 'framer-motion';
import { CircleCheck, ClipboardList, PartyPopper, Plus } from 'lucide-react';

const VARIANTS = {
  empty: {
    icon: ClipboardList,
    title: 'Your list is wonderfully empty',
    text: 'Capture what’s on your mind and turn it into progress. Start with one small task.',
  },
  active: {
    icon: PartyPopper,
    title: 'All caught up!',
    text: 'Every task is complete. Take a breather — or add something new.',
  },
  completed: {
    icon: CircleCheck,
    title: 'Nothing completed yet',
    text: 'Tick off a task and it will show up here. You’ve got this.',
  },
};

export default function EmptyState({ variant, onAction }) {
  const { icon: Icon, title, text } = VARIANTS[variant];

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="empty-art" aria-hidden="true">
        <div className="empty-stack">
          <span className="layer layer-1" />
          <span className="layer layer-2" />
          <span className="layer layer-3">
            <Icon size={34} strokeWidth={1.75} />
          </span>
        </div>
        <span className="empty-shadow" />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {variant !== 'completed' && (
        <motion.button
          type="button"
          className="btn btn-soft"
          onClick={onAction}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
          {variant === 'empty' ? 'Add your first task' : 'Add a new task'}
        </motion.button>
      )}
    </motion.div>
  );
}
