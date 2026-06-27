import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import ThreeDCube from './ThreeDCube';

/* ─────────────────────────────────────────────────────────────────
   Stage interior: SOURCE
   Code fragments drift chaotically → snap to organized grid when active
──────────────────────────────────────────────────────────────────── */
function SourceInterior({ isActive }) {
  const CODE = ['const', 'fn()', '</>', '{}', '=>', 'import', 'async', 'await', '.git', 'npm'];
  const grid = [
    [-52, -28], [  0, -28], [ 52, -28],
    [-52,   0], [  0,   0], [ 52,   0],
    [-52,  28], [  0,  28], [ 52,  28],
    [ 26,  -14],
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(157,111,255,0.9), transparent)',
          boxShadow: '0 0 10px rgba(157,111,255,0.7)',
        }}
        animate={isActive
          ? { y: [-55, 55], opacity: [0, 1, 1, 0] }
          : { y: 0, opacity: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', times: [0, 0.05, 0.95, 1] }}
      />
      {CODE.map((c, i) => (
        <motion.span
          key={c}
          className="absolute text-[10px] font-mono select-none"
          style={{ color: `rgba(157,111,255,${isActive ? 0.9 : 0.22})` }}
          animate={isActive
            ? { x: grid[i][0], y: grid[i][1], opacity: 0.9 }
            : { x: Math.cos(i * 2.39) * 58, y: Math.sin(i * 2.39) * 42, opacity: 0.22 }}
          transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          {c}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stage interior: BUILD
   Concentric spinning rings with a forge-hot core; particles stream in
──────────────────────────────────────────────────────────────────── */
function BuildInterior({ isActive }) {
  const RINGS = [
    { size: 80, dur: 2.6, dir: 1  },
    { size: 56, dur: 1.9, dir: -1 },
    { size: 32, dur: 1.3, dir: 1  },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {RINGS.map(({ size, dur, dir }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size, height: size,
            border: `1px solid rgba(255,140,66,${isActive ? 0.55 : 0.12})`,
            boxShadow: isActive ? `0 0 8px rgba(255,140,66,0.2)` : 'none',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}
          animate={{ rotate: 360 * dir }}
          transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      <motion.div
        className="w-5 h-5 rounded-full z-10"
        style={{ background: 'radial-gradient(circle, #fff 0%, #FFAA50 30%, #FF6B35 60%, transparent 100%)' }}
        animate={{ scale: isActive ? [0.85, 1.45, 0.85] : 0.4, opacity: isActive ? 1 : 0.25 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
      />
      {isActive && Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: '#FF8C42' }}
            animate={{
              x: [Math.cos(a) * 48, 0],
              y: [Math.sin(a) * 48, 0],
              opacity: [0.9, 0],
              scale: [1.2, 0.1],
            }}
            transition={{ duration: 0.7, delay: i * 0.12, repeat: Infinity, repeatDelay: 0.5 }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stage interior: IMAGE  — rotating 3-D container cube
──────────────────────────────────────────────────────────────────── */
function ImageInterior({ isActive }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-1">
      <ThreeDCube size={52} color="#4CC9F0" active={isActive} speed={8} />
      <span className="text-[8px] font-mono text-white/20 tracking-wider">sha256:a1b2c3d4</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stage interior: DEPLOY — three K8s pods in a triangle
──────────────────────────────────────────────────────────────────── */
function DeployInterior({ isActive }) {
  const PODS = [{ cx: 80, cy: 38 }, { cx: 50, cy: 88 }, { cx: 110, cy: 88 }];
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg className="w-[160px] h-[130px]" viewBox="0 0 160 130" style={{ overflow: 'visible' }}>
        {isActive && [[0, 1], [0, 2], [1, 2]].map(([a, b], i) => (
          <motion.line
            key={i}
            x1={PODS[a].cx} y1={PODS[a].cy} x2={PODS[b].cx} y2={PODS[b].cy}
            stroke="rgba(0,255,163,0.3)" strokeWidth="1" strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
        {PODS.map(({ cx, cy }, i) => (
          <g key={i}>
            {isActive && (
              <motion.circle
                cx={cx} cy={cy} r={14}
                fill="none" stroke="rgba(0,255,163,0.4)" strokeWidth="1"
                animate={{ r: [14, 26], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
              />
            )}
            <rect
              x={cx - 14} y={cy - 12} width={28} height={24} rx={5}
              fill={isActive ? 'rgba(0,255,163,0.1)' : 'rgba(255,255,255,0.03)'}
              stroke={isActive ? 'rgba(0,255,163,0.45)' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1"
              style={{ transition: 'all 0.4s' }}
            />
            <text
              x={cx} y={cy + 4}
              textAnchor="middle" fontSize="8"
              fontFamily="JetBrains Mono, monospace" fontWeight="600"
              fill={isActive ? '#00FFA3' : 'rgba(255,255,255,0.2)'}
              style={{ transition: 'fill 0.4s' }}
            >
              pod
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Stage definitions
──────────────────────────────────────────────────────────────────── */
const ICON_SOURCE = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const ICON_BUILD = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);
const ICON_IMAGE = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="3"/>
    <path d="M2 8h20M8 22V8"/>
  </svg>
);
const ICON_DEPLOY = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const STAGES = [
  { id: 'source', label: 'SOURCE', sub: 'Code Ingestion',        color: '#9D6FFF', rgb: '157,111,255', desc: 'Repo cloned, filesystem mounted',          icon: ICON_SOURCE, Interior: SourceInterior },
  { id: 'build',  label: 'BUILD',  sub: 'Compilation Forge',     color: '#FF8C42', rgb: '255,140,66',  desc: 'Deps installed, artifacts compiled',        icon: ICON_BUILD,  Interior: BuildInterior  },
  { id: 'image',  label: 'IMAGE',  sub: 'Containerization',      color: '#4CC9F0', rgb: '76,201,240',  desc: 'Docker image sealed, pushed to ECR',        icon: ICON_IMAGE,  Interior: ImageInterior  },
  { id: 'deploy', label: 'DEPLOY', sub: 'Cluster Orchestration', color: '#00FFA3', rgb: '0,255,163',   desc: 'Pods live, ingress configured, TLS active',  icon: ICON_DEPLOY, Interior: DeployInterior },
];

/*
  Layout in 800×530 viewBox:
    SOURCE top-left  center (130, 115)  card x=20,  y=22
    BUILD  top-right center (670, 115)  card x=560, y=22
    IMAGE  bot-right center (670, 415)  card x=560, y=322
    DEPLOY bot-left  center (130, 415)  card x=20,  y=322

  Curved bezier connections:
  A: Source→Build  M 240,115 C 370,55  430,55  560,115
  B: Build→Image   M 670,208 C 735,265 735,265 670,322
  C: Image→Deploy  M 560,415 C 430,475 370,475 240,415
  D: Deploy→Source M 130,322 C 65,265  65,265  130,208
*/
const PATHS = [
  { id: 'sb', d: 'M 240,115 C 370,55 430,55 560,115',   from: 0, to: 1 },
  { id: 'bi', d: 'M 670,208 C 735,265 735,265 670,322', from: 1, to: 2 },
  { id: 'id', d: 'M 560,415 C 430,475 370,475 240,415', from: 2, to: 3 },
  { id: 'ds', d: 'M 130,322 C 65,265 65,265 130,208',   from: 3, to: 0 },
];

/* Single path tracing all 4 connections — used for the power-surge bolt */
const SURGE_PATH =
  'M 240,115 C 370,55 430,55 560,115 ' +
  'L 670,115 670,208 C 735,265 735,265 670,322 ' +
  'L 670,415 560,415 C 430,475 370,475 240,415 ' +
  'L 130,415 130,322 C 65,265 65,265 130,208 ' +
  'L 130,115 240,115';

/* Card positions — must match the coordinate comment above */
const CARD_POSITIONS = [
  { top: 22,    left:  20 },  // SOURCE
  { top: 22,    right: 20 },  // BUILD
  { bottom: 22, right: 20 },  // IMAGE
  { bottom: 22, left:  20 },  // DEPLOY
];

function StageCard({ stage, index, isActive, inView }) {
  const Interior = stage.Interior;
  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden rounded-2xl"
      style={{
        ...CARD_POSITIONS[index],
        width: 220,
        height: 186,
        background: isActive ? `rgba(${stage.rgb},0.09)` : 'rgba(255,255,255,0.025)',
        border: `1px solid rgba(${stage.rgb},${isActive ? 0.55 : 0.15})`,
        boxShadow: isActive
          ? `0 0 36px rgba(${stage.rgb},0.22), 0 0 80px rgba(${stage.rgb},0.08), inset 0 0 30px rgba(${stage.rgb},0.04)`
          : 'none',
        transition: 'background 0.45s, border-color 0.45s, box-shadow 0.45s',
        zIndex: 5,
      }}
      initial={{ opacity: 0, scale: 0.82, y: index < 2 ? -12 : 12 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 220, damping: 24 }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 pt-2.5 pb-2 flex-none"
        style={{ borderBottom: `1px solid rgba(${stage.rgb},0.12)` }}
      >
        <span style={{ color: stage.color }}>{stage.icon}</span>
        <span className="text-[11px] font-mono font-bold tracking-widest" style={{ color: stage.color }}>
          {stage.label}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {isActive && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: stage.color }}
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          )}
          <span className="text-[8px] font-mono" style={{ color: `rgba(${stage.rgb},0.4)` }}>
            {stage.sub}
          </span>
        </div>
      </div>

      {/* Interior */}
      <div className="flex-1 relative overflow-hidden">
        <Interior isActive={isActive} />
      </div>

      {/* Footer */}
      <div className="flex-none px-3 py-1.5" style={{ borderTop: `1px solid rgba(${stage.rgb},0.08)` }}>
        <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>{stage.desc}</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main export
──────────────────────────────────────────────────────────────────── */
export default function WorkflowSection() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: false, margin: '-60px' });

  // phase: idle → drawing → surge → powered
  const [phase,       setPhase]       = useState('idle');
  const [activeStage, setActiveStage] = useState(0);
  const [surgeKey,    setSurgeKey]    = useState(0);

  useEffect(() => {
    if (!inView) { setPhase('idle'); setActiveStage(0); return; }
    setPhase('drawing');
    // All 4 paths finish drawing around 2.1s (3×0.45s delay + 0.65s draw)
    const t1 = setTimeout(() => { setPhase('surge'); setSurgeKey(k => k + 1); }, 2400);
    const t2 = setTimeout(() => setPhase('powered'), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  useEffect(() => {
    if (phase !== 'powered') return;
    const id = setInterval(() => setActiveStage(a => (a + 1) % 4), 2400);
    return () => clearInterval(id);
  }, [phase]);

  const powered = phase === 'powered';
  const drawing = phase !== 'idle';

  return (
    <section ref={ref} id="workflow" className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 65% at 50% 50%, rgba(124,77,255,0.055) 0%, transparent 72%)' }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(124,77,255,0.09)', border: '1px solid rgba(124,77,255,0.25)', color: '#9D6FFF' }}
          >
            Pipeline
          </span>
          <h2 className="text-4xl font-bold mb-3">
            The <span className="text-gradient">Forge Circuit</span>
          </h2>
          <p className="text-white/35 text-base max-w-md mx-auto">
            Particles assemble the circuit live — then power surges through.
            Code in, live app out.
          </p>
        </motion.div>

        {/* Main visualization */}
        <div className="relative mx-auto" style={{ maxWidth: 800, height: 530 }}>

          {/* SVG circuit overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 530"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 2 }}
          >
            {/* Faint track */}
            {PATHS.map(p => (
              <path key={`track-${p.id}`} d={p.d} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
            ))}

            {/* Path draw-in animations */}
            {drawing && PATHS.map((p, i) => {
              const clr = STAGES[p.from].color;
              const lit = powered && activeStage === p.from;
              return (
                <g key={`draw-${p.id}`}>
                  <motion.path
                    d={p.d}
                    fill="none"
                    stroke={lit ? clr : `rgba(${STAGES[p.from].rgb},0.32)`}
                    strokeWidth={lit ? 2.4 : 1.4}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.65, delay: i * 0.45, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      filter: lit ? `drop-shadow(0 0 6px ${clr})` : 'none',
                      transition: 'stroke 0.5s, stroke-width 0.5s',
                    }}
                  />
                  {/* Construction particle rides the drawing front */}
                  <motion.circle
                    r={4} fill={clr}
                    style={{ filter: `drop-shadow(0 0 6px ${clr})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.65, delay: i * 0.45, times: [0, 0.05, 0.9, 1] }}
                  >
                    <animateMotion
                      dur="0.65s"
                      begin={`${i * 0.45}s`}
                      fill="remove"
                      path={p.d}
                    />
                  </motion.circle>
                </g>
              );
            })}

            {/* Power surge bolt — one bright flash around the full circuit */}
            {(phase === 'surge' || powered) && (
              <g key={`surge-${surgeKey}`}>
                <motion.circle
                  r={5} fill="#fff"
                  style={{ filter: 'drop-shadow(0 0 12px #fff) drop-shadow(0 0 24px #7C4DFF)' }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 1, 0] }}
                  transition={{ duration: 1.2, times: [0, 0.85, 1] }}
                >
                  <animateMotion dur="1.1s" begin="0s" fill="remove" path={SURGE_PATH} />
                </motion.circle>
                <motion.circle
                  r={3} fill="#C084FC"
                  style={{ filter: 'drop-shadow(0 0 8px #9D6FFF)' }}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: [0.7, 0.7, 0] }}
                  transition={{ duration: 1.2, times: [0, 0.85, 1] }}
                >
                  <animateMotion dur="1.1s" begin="0.07s" fill="remove" path={SURGE_PATH} />
                </motion.circle>
              </g>
            )}

            {/* Powered: continuous energy dots per connection */}
            {powered && PATHS.map((p, i) => {
              const lit = activeStage === p.from;
              const clr = STAGES[p.from].color;
              return (
                <g key={`flow-${p.id}`}>
                  <circle r={lit ? 4 : 2.5} fill={clr}
                    style={{ filter: `drop-shadow(0 0 ${lit ? 8 : 4}px ${clr})`, opacity: lit ? 1 : 0.4 }}>
                    <animateMotion dur={lit ? '1.15s' : '2.2s'} repeatCount="indefinite" path={p.d} />
                  </circle>
                  {lit && (
                    <circle r={2} fill={clr} opacity={0.35}>
                      <animateMotion dur="1.15s" begin="-0.32s" repeatCount="indefinite" path={p.d} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Junction dots at card connection points */}
            {drawing && [
              [240, 115, 0], [670, 115, 1], [670, 415, 2], [240, 415, 3],
            ].map(([cx, cy, si]) => (
              <motion.circle
                key={`node-${si}`}
                cx={cx} cy={cy} r={3}
                fill={STAGES[si].color}
                style={{ filter: `drop-shadow(0 0 6px ${STAGES[si].color})` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: powered ? (activeStage === si ? 1 : 0.4) : 0.6 }}
                transition={{ delay: si * 0.45 + 0.55, type: 'spring', stiffness: 400 }}
              />
            ))}
          </svg>

          {/* Stage cards */}
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              index={i}
              isActive={powered && activeStage === i}
              inView={inView}
            />
          ))}

          {/* Center status orb */}
          <div
            className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center text-center"
            style={{ transform: 'translate(-50%, -50%)', width: 190, zIndex: 6 }}
          >
            <div className="relative mb-3">
              {powered && (
                <>
                  <motion.div
                    className="absolute rounded-full border"
                    style={{ width: 68, height: 68, top: -6, left: -6, borderColor: STAGES[activeStage].color, opacity: 0.25 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                  {[0, 0.5].map((d, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border"
                      style={{ width: 68, height: 68, top: -6, left: -6, borderColor: STAGES[activeStage].color }}
                      animate={{ scale: [1, 1.65], opacity: [0.2, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: d }}
                    />
                  ))}
                </>
              )}
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
                style={{
                  background: powered
                    ? `radial-gradient(circle, rgba(${STAGES[activeStage].rgb},0.22) 0%, rgba(4,13,24,0.9) 70%)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${powered ? STAGES[activeStage].color : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: powered
                    ? `0 0 32px rgba(${STAGES[activeStage].rgb},0.35), inset 0 0 20px rgba(${STAGES[activeStage].rgb},0.08)`
                    : 'none',
                  transition: 'all 0.5s ease',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={powered ? activeStage : phase}
                    initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
                    transition={{ duration: 0.28 }}
                    style={{ color: powered ? STAGES[activeStage].color : 'rgba(255,255,255,0.18)' }}
                  >
                    {powered ? STAGES[activeStage].icon : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="8" strokeDasharray="3 3"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={powered ? `p-${activeStage}` : phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center gap-1"
              >
                {powered ? (
                  <>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: STAGES[activeStage].color }}>
                      {STAGES[activeStage].label}
                    </span>
                    <span className="text-[9px] text-white/35 font-mono leading-tight text-center px-2">
                      {STAGES[activeStage].desc}
                    </span>
                  </>
                ) : (
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    {phase === 'drawing' ? 'assembling circuit…' : phase === 'surge' ? 'charging…' : 'initializing…'}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Status bar */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: powered ? '#00FFA3' : '#7C4DFF' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[11px] font-mono text-white/28">
            {powered
              ? `pipeline live · ${STAGES[activeStage].sub.toLowerCase()} active`
              : phase === 'drawing' ? 'circuit assembling…'
              : phase === 'surge'   ? 'powering up…'
              : 'standby'}
          </span>
          {powered && (
            <>
              <div className="w-px h-3 bg-white/10" />
              {STAGES.map((s, i) => (
                <motion.div
                  key={s.id}
                  className="w-6 h-1 rounded-full"
                  style={{ background: `rgba(${s.rgb},${activeStage === i ? 1 : 0.22})` }}
                  animate={{ opacity: activeStage === i ? 1 : 0.22 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
