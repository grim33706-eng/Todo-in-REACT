import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Card that gently tilts toward the mouse pointer with a soft light glare.
 * Tilt is mouse-only and disabled when the user prefers reduced motion.
 */
export default function TiltCard({ children, className = '', max = 8, ...rest }) {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, var(--glare), transparent 65%)`;

  function handlePointerMove(event) {
    if (reduceMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      className={`tilt ${className}`}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {children}
      <motion.span className="tilt-glare" style={{ background: glare }} aria-hidden="true" />
    </motion.div>
  );
}
