import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const NODES = [
  {
    id: 'github',
    label: 'GitHub',
    sub: 'Source pushed',
    detail: 'git push origin main',
    color: '#9D6FFF',
    rgb: '157,111,255',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
      </svg>
    ),
  },
  {
    id: 'actions',
    label: 'GitHub Actions',
    sub: 'Build & push',
    detail: 'Docker image → ECR',
    color: '#FF8C42',
    rgb: '255,140,66',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    id: 'ecr',
    label: 'AWS ECR',
    sub: 'Container registry',
    detail: 'Image stored & tagged',
    color: '#FF9900',
    rgb: '255,153,0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
  },
  {
    id: 'argocd',
    label: 'ArgoCD',
    sub: 'GitOps sync',
    detail: 'Manifest reconciled',
    color: '#4CC9F0',
    rgb: '76,201,240',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: 'k8s',
    label: 'Production',
    sub: 'K3s cluster · live',
    detail: '3/3 pods running · TLS ✓',
    color: '#00FFA3',
    rgb: '0,255,163',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/><line x1="2" y1="15.5" x2="22" y2="15.5"/>
      </svg>
    ),
  },
];

/* ── Animated connection track ───────────────────────────────── */
function Track({ active, done, color }) {
  return (
    <div className="flex-1 flex items-center relative mx-1" style={{ height: 2 }}>
      {/* base track */}
      <div className="w-full h-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {/* filled portion */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: color }}
        animate={{ width: done ? '100%' : active ? '60%' : '0%', opacity: done ? 0.8 : active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* traveling packet */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute w-2 h-2 rounded-full -translate-y-1/2"
            style={{ top: '50%', background: color, boxShadow: `0 0 8px ${color}, 0 0 20px ${color}` }}
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Node card ───────────────────────────────────────────────── */
function NodeCard({ node, state, index, inView }) {
  const isActive = state === 'active';
  const isDone   = state === 'done';

  return (
    <motion.div
      className="flex flex-col items-center gap-2 relative"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Icon circle */}
      <motion.div
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: 56, height: 56,
          background: isActive || isDone ? `rgba(${node.rgb},0.15)` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isActive ? node.color : isDone ? `rgba(${node.rgb},0.5)` : 'rgba(255,255,255,0.08)'}`,
          color: isActive || isDone ? node.color : 'rgba(255,255,255,0.25)',
          boxShadow: isActive ? `0 0 28px rgba(${node.rgb},0.45), 0 0 60px rgba(${node.rgb},0.15)` : isDone ? `0 0 12px rgba(${node.rgb},0.2)` : 'none',
          transition: 'all 0.5s ease',
        }}
        animate={isActive ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={isActive ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {node.icon}

        {/* Done checkmark badge */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
              style={{ background: '#00FFA3', boxShadow: '0 0 8px #00FFA3', width: 18, height: 18 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#040D18" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active pulse ring */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ border: `1px solid ${node.color}` }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label */}
      <div className="text-center">
        <div
          className="text-[11px] font-semibold font-mono leading-tight"
          style={{ color: isActive ? node.color : isDone ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.28)', transition: 'color 0.4s' }}
        >
          {node.label}
        </div>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {node.sub}
        </div>
      </div>

      {/* Detail tooltip on active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg font-mono text-[9px] z-20 pointer-events-none"
            style={{
              background: `rgba(${node.rgb},0.12)`,
              border: `1px solid rgba(${node.rgb},0.35)`,
              color: node.color,
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {node.detail}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export default function PipelineFlow() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const [activeNode, setActiveNode] = useState(-1);
  const [wave, setWave] = useState(0);

  /* Deploy wave animation — cycles through nodes */
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const run = async () => {
      await sleep(600);
      while (!cancelled) {
        for (let i = 0; i <= 4 && !cancelled; i++) {
          setActiveNode(i);
          await sleep(1600);
        }
        setActiveNode(-1);
        await sleep(900);
        setWave(w => w + 1);
      }
    };
    run();
    return () => { cancelled = true; setActiveNode(-1); };
  }, [inView]);

  /* Node state: idle | active | done */
  const nodeState = (i) => {
    if (activeNode === -1) return 'idle';
    if (i < activeNode) return 'done';
    if (i === activeNode) return 'active';
    return 'idle';
  };

  /* Track between nodes i and i+1: active when node i is done or active */
  const trackState = (i) => {
    if (activeNode === -1) return 'idle';
    if (i < activeNode) return 'done';
    if (i === activeNode) return 'active';
    return 'idle';
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,77,255,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(124,77,255,0.09)', border: '1px solid rgba(124,77,255,0.25)', color: '#C084FC' }}
          >
            Deployment Pipeline
          </span>
          <h2 className="text-4xl font-bold mb-3">From push to production</h2>
          <p className="text-white/40 text-base max-w-lg mx-auto">
            Watch your code travel through the pipeline in real time — every step automated, every handoff instant.
          </p>
        </motion.div>

        {/* Pipeline row */}
        <div className="relative">
          {/* Nodes + tracks */}
          <div className="flex items-start justify-between px-4">
            {NODES.map((node, i) => (
              <div key={node.id} className="flex items-center flex-1 last:flex-none" style={{ minWidth: 0 }}>
                <NodeCard node={node} state={nodeState(i)} index={i} inView={inView} />
                {i < NODES.length - 1 && (
                  <div className="flex-1 flex items-center" style={{ paddingTop: 14, paddingBottom: 40 }}>
                    <Track
                      active={trackState(i) === 'active'}
                      done={trackState(i) === 'done'}
                      color={NODES[i].color}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live status strip */}
        <motion.div
          className="mt-20 mx-auto rounded-2xl overflow-hidden"
          style={{ maxWidth: 680 }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#00FFA3', boxShadow: '0 0 8px #00FFA3' }}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-mono text-[11px] text-white/55">Live deployment stream</span>
              </div>
              <span className="font-mono text-[10px] text-white/20">wave #{wave + 1}</span>
            </div>

            {/* Step timeline */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Code Pushed',       t: '0s',   c: '#9D6FFF' },
                { label: 'Build Started',      t: '2s',   c: '#FF8C42' },
                { label: 'Image Built',        t: '18s',  c: '#4CC9F0' },
                { label: 'Pushed to ECR',      t: '26s',  c: '#FF9900' },
                { label: 'Manifest Updated',   t: '30s',  c: '#38BDF8' },
                { label: 'Deploying to K8s',   t: '42s',  c: '#7C4DFF' },
                { label: 'Application Ready',  t: '55s',  c: '#00FFA3' },
              ].map((step, i) => {
                const stageIdx = Math.floor(i / 1.4);
                const isActive = activeNode >= stageIdx;
                return (
                  <motion.div
                    key={step.label}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{
                      background: isActive ? `rgba(${NODES[Math.min(stageIdx, 4)].rgb},0.1)` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isActive ? `rgba(${NODES[Math.min(stageIdx, 4)].rgb},0.3)` : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.4s ease',
                    }}
                    animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                      stroke={isActive ? step.c : 'rgba(255,255,255,0.2)'} strokeWidth="2.5"
                      style={{ transition: 'stroke 0.4s', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="font-mono text-[9px]" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.22)', transition: 'color 0.4s' }}>
                      {step.label}
                    </span>
                    <span className="font-mono text-[8px]" style={{ color: isActive ? step.c : 'rgba(255,255,255,0.1)', transition: 'color 0.4s' }}>
                      +{step.t}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom metrics */}
            <div className="flex items-center gap-6 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Total time', value: '55s', color: '#00FFA3' },
                { label: 'Uptime',     value: '99.99%', color: '#4CC9F0' },
                { label: 'Response',   value: '142ms', color: '#9D6FFF' },
                { label: 'Pods',       value: '3/3 ✓',  color: '#7C4DFF' },
              ].map(m => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{m.label}</span>
                  <span className="font-mono text-[12px] font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
