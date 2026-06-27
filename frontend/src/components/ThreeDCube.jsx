import { motion } from 'framer-motion';

function hexRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function ThreeDCube({
  size     = 64,
  color    = '#7C4DFF',
  icon     = null,
  label    = '',
  active   = false,
  speed    = 9,
  pulse    = false,
}) {
  const h   = size / 2;
  const rgb = hexRgb(color);

  const face = (transform, brightnessMul = 1, showIcon = false) => ({
    position: 'absolute',
    inset: 0,
    width: size,
    height: size,
    transform,
    background:  `rgba(${rgb}, ${(active ? 0.18 : 0.06) * brightnessMul})`,
    border:      `1px solid rgba(${rgb}, ${(active ? 0.7  : 0.25) * brightnessMul})`,
    display:     'flex',
    alignItems:  'center',
    justifyContent: 'center',
    fontSize:    size * 0.30,
    color,
    boxShadow:   active && showIcon
      ? `inset 0 0 24px rgba(${rgb},0.2), 0 0 18px rgba(${rgb},0.45)`
      : 'none',
    backfaceVisibility: 'hidden',
  });

  return (
    <div className="flex flex-col items-center">
      {/* perspective wrapper */}
      <div style={{ perspective: `${size * 5.5}px`, width: size * 1.6, height: size * 1.6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          key={pulse && active ? 'active' : 'idle'}
          style={{ width: size, height: size, transformStyle: 'preserve-3d', position: 'relative' }}
          initial={pulse && active ? { scale: 1.35 } : { scale: 1 }}
          animate={{ scale: 1, rotateY: [0, 360], rotateX: [8, -8, 8] }}
          transition={{
            scale:   { duration: 0.4, ease: 'easeOut' },
            rotateY: { duration: speed, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: speed * 0.65, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {/* Six faces */}
          <div style={face(`translateZ(${h}px)`,          1.0,  true)}>{icon}</div>
          <div style={face(`rotateY(180deg) translateZ(${h}px)`, 0.35)} />
          <div style={face(`rotateY( 90deg) translateZ(${h}px)`, 0.6 )} />
          <div style={face(`rotateY(-90deg) translateZ(${h}px)`, 0.6 )} />
          <div style={face(`rotateX( 90deg) translateZ(${h}px)`, 0.8 )} />
          <div style={face(`rotateX(-90deg) translateZ(${h}px)`, 0.15)} />
        </motion.div>
      </div>

      {label && (
        <span
          className="text-[9px] font-mono uppercase tracking-widest -mt-1 transition-colors duration-300"
          style={{ color: active ? color : 'rgba(255,255,255,0.3)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
