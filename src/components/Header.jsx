import { AnimatePresence, motion } from 'framer-motion';
import { CheckCheck, Moon, Sun } from 'lucide-react';

function greetingFor(hour) {
  if (hour < 5) return 'Working late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function summaryFor({ total, active }) {
  if (total === 0) return 'Plan your day — add your first task to get started.';
  if (active === 0) return 'Everything is done. Enjoy the clear head.';
  return `You have ${active} ${active === 1 ? 'task' : 'tasks'} left to tackle.`;
}

export default function Header({ theme, onToggleTheme, stats, now }) {
  const date = new Date(now);
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <CheckCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Taskflow</span>
            <span className="brand-tag">
              {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        <motion.button
          type="button"
          className="icon-btn theme-toggle"
          onClick={onToggleTheme}
          whileTap={{ scale: 0.9 }}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              className="theme-icon"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {isDark ? <Moon size={19} /> : <Sun size={19} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1>
          {greetingFor(date.getHours())}, <span className="gradient-text">let&apos;s get it done.</span>
        </h1>
        <p>{summaryFor(stats)}</p>
      </motion.div>
    </header>
  );
}
