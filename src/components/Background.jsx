/** Decorative, non-interactive backdrop: drifting gradient orbs and soft 3D shapes. */
export default function Background() {
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="shape cube">
        <div className="cube-inner">
          <span className="face front" />
          <span className="face back" />
          <span className="face right" />
          <span className="face left" />
          <span className="face top" />
          <span className="face bottom" />
        </div>
      </div>
      <div className="shape halo" />
      <div className="shape pill" />
    </div>
  );
}
