import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';

/* ── Orbital rings data ───────────────────────────────────── */
const RING1 = {
  radius: 90, duration: 22, color: '#7C4DFF',
  items: [
    { label: 'Kubernetes', icon: 'k8s', color: '#326CE5' },
    { label: 'ArgoCD',     icon: 'argo', color: '#EF7B4D' },
  ],
};
const RING2 = {
  radius: 175, duration: 38, color: '#4CC9F0',
  items: [
    { label: 'Docker',         icon: 'dkr',  color: '#4CC9F0' },
    { label: 'Helm',           icon: 'helm', color: '#7C4DFF' },
    { label: 'AWS ECR',        icon: 'ecr',  color: '#FF9900' },
    { label: 'GitHub Actions', icon: 'ci',   color: '#2DA44E' },
  ],
};
const RING3 = {
  radius: 265, duration: 60, color: '#9D6FFF', ccw: true,
  items: [
    { label: 'Terraform',       icon: 'tf',   color: '#844FBA' },
    { label: 'Cert Manager',    icon: 'cert', color: '#4CC9F0' },
    { label: 'External Secrets',icon: 'ext',  color: '#9D6FFF' },
    { label: 'K3s',             icon: 'k3s',  color: '#FFC61C' },
    { label: 'NGINX Ingress',   icon: 'ngx',  color: '#009639' },
  ],
};

/* ── Single orbiting badge ─────────────────────────────────── */
function OrbitalItem({ item, angle, index, total, radius }) {
  const offset = (index / total) * Math.PI * 2;
  const x = useTransform(angle, a => Math.cos(a + offset) * radius - 26);
  const y = useTransform(angle, a => Math.sin(a + offset) * radius - 26);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-auto cursor-pointer"
      style={{ x, y, width: 52, height: 52 }}
      whileHover={{ scale: 1.45 }}
    >
      <motion.div
        className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-0.5 relative overflow-hidden"
        style={{ background: `rgba(${hexRgb(item.color)},0.1)`, border: `1px solid rgba(${hexRgb(item.color)},0.4)` }}
        whileHover={{ boxShadow: `0 0 24px rgba(${hexRgb(item.color)},0.6), 0 0 48px rgba(${hexRgb(item.color)},0.25)` }}
      >
        <span className="text-[9px] font-bold font-mono" style={{ color: item.color }}>{item.icon}</span>
        <span className="text-[7px] text-white/40 font-mono leading-tight text-center px-0.5 hidden group-hover:block">{item.label}</span>
      </motion.div>

      {/* tooltip on hover */}
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-[9px] font-mono pointer-events-none z-20"
        style={{ background: 'rgba(4,13,24,0.95)', border: `1px solid rgba(${hexRgb(item.color)},0.4)`, color: item.color }}
        initial={{ opacity: 0, y: 4 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {item.label}
      </motion.div>
    </motion.div>
  );
}

/* ── Ring track ────────────────────────────────────────────── */
function OrbitRing({ ring, inView }) {
  const angle = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const { stop } = animate(angle, ring.ccw ? -Math.PI * 2 : Math.PI * 2, {
      duration: ring.duration,
      repeat: Infinity,
      ease: 'linear',
    });
    return stop;
  }, [inView, angle, ring]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* track circle */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: ring.radius * 2,
          height: ring.radius * 2,
          border: `1px solid rgba(${hexRgb(ring.color)},0.12)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, type: 'spring', stiffness: 140, delay: 0.3 }}
      />
      {/* rotating items */}
      {ring.items.map((item, i) => (
        <OrbitalItem
          key={item.label}
          item={item}
          angle={angle}
          index={i}
          total={ring.items.length}
          radius={ring.radius}
        />
      ))}
    </div>
  );
}

/* ── Main export ───────────────────────────────────────────── */
export default function InfraOrbits() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const ORBIT_SIZE = 600;

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(76,201,240,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(76,201,240,0.09)', border: '1px solid rgba(76,201,240,0.25)', color: '#4CC9F0' }}
          >
            Infrastructure
          </span>
          <h2 className="text-4xl font-bold mb-3">Everything in orbit</h2>
          <p className="text-white/40 text-base">Hover over any technology to inspect it.</p>
        </motion.div>

        {/* orbital scene */}
        <div className="flex justify-center">
          <motion.div
            className="relative"
            style={{ width: ORBIT_SIZE, height: ORBIT_SIZE }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Three rings */}
            <OrbitRing ring={RING3} inView={inView} />
            <OrbitRing ring={RING2} inView={inView} />
            <OrbitRing ring={RING1} inView={inView} />

            {/* Center — DevPortal core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* pulse rings */}
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border"
                  style={{ borderColor: 'rgba(124,77,255,0.2)', width: 72 + i * 18, height: 72 + i * 18 }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}

              {/* core logo */}
              <motion.div
                className="relative w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 z-10"
                style={{
                  background: 'rgba(124,77,255,0.12)',
                  border: '1px solid rgba(124,77,255,0.45)',
                  boxShadow: '0 0 40px rgba(124,77,255,0.3), inset 0 0 30px rgba(124,77,255,0.08)',
                }}
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.4 }}
              >
                {/* geometric cube icon */}
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 bg-[#7C4DFF] rotate-45 rounded-sm" />
                  <div className="absolute inset-[3px] bg-[#040D18] rotate-45 rounded-sm" />
                  <div className="absolute inset-[5px] bg-[#7C4DFF] rotate-45 rounded-sm opacity-80" />
                </div>
                <span className="text-[9px] font-bold text-white/80 font-mono">DevPortal</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* legend */}
        <motion.div
          className="flex justify-center mt-10 gap-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          {[RING1, RING2, RING3].map((ring, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/35">
              <div className="w-12 h-px" style={{ background: `rgba(${hexRgb(ring.color)},0.5)` }} />
              <span className="font-mono">
                {i === 0 ? 'Core' : i === 1 ? 'Runtime' : 'Infrastructure'}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function hexRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
