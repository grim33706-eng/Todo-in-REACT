import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, Hourglass, ListTodo } from 'lucide-react';
import { memo } from 'react';
import TiltCard from './TiltCard';

function AnimatedNumber({ value }) {
  return (
    <span className="num-roll">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '60%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function StatCard({ label, value, icon: Icon, tone, index }) {
  return (
    <TiltCard
      className={`stat-card tone-${tone}`}
      initial={{ opacity: 0, y: 18, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-content">
        <span className="stat-icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.25} />
        </span>
        <span className="stat-value">
          <AnimatedNumber value={value} />
        </span>
        <span className="stat-label">{label}</span>
      </div>
    </TiltCard>
  );
}

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressCard({ percent, completed, total }) {
  return (
    <TiltCard
      className="stat-card progress-card"
      initial={{ opacity: 0, y: 18, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.24, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="stat-content progress-content">
        <div
          className="ring"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Tasks completed"
        >
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <defs>
              <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" style={{ stopColor: 'var(--ring-from)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--ring-to)' }} />
              </linearGradient>
            </defs>
            <circle className="ring-track" cx="32" cy="32" r={RADIUS} />
            <motion.circle
              className="ring-bar"
              cx="32"
              cy="32"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - percent / 100) }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="ring-label">{percent}%</span>
        </div>
        <div className="progress-text">
          <span className="stat-label">Progress</span>
          <span className="progress-sub">
            {total === 0 ? 'No tasks yet' : `${completed} of ${total} done`}
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

function TodoStats({ stats }) {
  return (
    <section className="stats" aria-label="Task statistics">
      <StatCard index={0} label="Total tasks" value={stats.total} icon={ListTodo} tone="primary" />
      <StatCard index={1} label="Remaining" value={stats.active} icon={Hourglass} tone="lavender" />
      <StatCard index={2} label="Completed" value={stats.completed} icon={CircleCheck} tone="success" />
      <ProgressCard percent={stats.percent} completed={stats.completed} total={stats.total} />
    </section>
  );
}

export default memo(TodoStats);
