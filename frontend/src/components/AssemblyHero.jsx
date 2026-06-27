import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ThreeDCube from './ThreeDCube';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Stage definitions ────────────────────────────────────────── */
const STAGES = [
  { id: 'source', label: 'Source',  sub: 'Repo cloned',               color: '#9D6FFF', rgb: '157,111,255', emoji: '⬡' },
  { id: 'build',  label: 'Build',   sub: 'Compiling artifacts',        color: '#FF8C42', rgb: '255,140,66',  emoji: '⚙' },
  { id: 'image',  label: 'Image',   sub: 'Container sealed',           color: '#4CC9F0', rgb: '76,201,240',  emoji: '◈' },
  { id: 'push',   label: 'Push',    sub: 'Uploading to ECR',           color: '#38BDF8', rgb: '56,189,248',  emoji: '↑' },
  { id: 'deploy', label: 'Deploy',  sub: 'Pods scheduling on K8s',     color: '#7C4DFF', rgb: '124,77,255',  emoji: '⬡' },
  { id: 'live',   label: 'Live',    sub: 'TLS active · ingress ready', color: '#00FFA3', rgb: '0,255,163',   emoji: '✦' },
];

/* Per-stage metrics displayed in the footer */
const STAGE_META = [
  { a: '2,341 files', b: '12.4 MB',  c: 'github clone'  },
  { a: '234 modules', b: '247 KB',   c: 'npm ci + build' },
  { a: '7 layers',    b: '127 MB',   c: 'docker build'   },
  { a: '127 MB',      b: '1.2 GB/s', c: 'ecr push'       },
  { a: '3/3 pods',    b: '256 Mi',   c: 'k8s apply'      },
  { a: '99.99%',      b: '142 ms',   c: 'ingress + TLS'  },
];

/* ── Stage content components ─────────────────────────────────── */
function SourceContent() {
  const LINES = [
    { t: 'const repo = await git.clone(url)', c: '#9D6FFF' },
    { t: 'await fs.mount(repo.path)',          c: '#4CC9F0' },
    { t: '✓ 2,341 files indexed',             c: '#00FFA3' },
  ];
  return (
    <div className="flex flex-col gap-2 px-5 py-4 font-mono text-[10.5px]">
      {LINES.map((l, i) => (
        <motion.div key={i} className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2, duration: 0.35, ease: [0.22,1,0.36,1] }}>
          <span style={{ color: 'rgba(255,255,255,0.18)' }}>{String(i+1).padStart(2,'0')}</span>
          <span style={{ color: l.c }}>{l.t}</span>
        </motion.div>
      ))}
      <motion.div className="flex items-center gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <span className="text-white/18">04</span>
        <motion.span className="inline-block w-1.5 h-3.5" style={{ background: '#9D6FFF' }}
          animate={{ opacity: [1,0,1] }} transition={{ duration: 0.8, repeat: Infinity }} />
      </motion.div>
    </div>
  );
}

function BuildContent() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct(p => Math.min(100, p + 3)), 75);
    return () => clearInterval(id);
  }, []);
  const STEPS = ['Resolving packages…', 'Compiling 234 modules…', 'Tree-shaking & bundling…'];
  const step = Math.min(2, Math.floor(pct / 34));
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* Spinning rings + progress */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex-none">
          {[40,28,16].map((sz, i) => (
            <motion.div key={i} className="absolute rounded-full inset-0 m-auto"
              style={{ width: sz, height: sz, border: `1px solid rgba(255,140,66,${0.7 - i*0.2})` }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 1.4 + i * 0.6, repeat: Infinity, ease: 'linear' }} />
          ))}
          <motion.div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full"
            style={{ background: '#FF8C42', boxShadow: '0 0 10px #FF8C42' }}
            animate={{ scale: [0.8,1.4,0.8] }} transition={{ duration: 0.9, repeat: Infinity }} />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-mono text-white/45 mb-1.5">{STEPS[step]}</div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,140,66,0.12)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#FF6B35,#FF8C42,#FFB347)', boxShadow: '0 0 8px #FF8C42' }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.08 }} />
          </div>
          <div className="text-[9px] font-mono text-white/25 mt-1">{pct}%  ·  {Math.round(pct * 2.47)} KB</div>
        </div>
      </div>
      {/* Module stream */}
      <div className="flex gap-1 flex-wrap">
        {Array.from({ length: Math.floor(pct / 6) }).map((_, i) => (
          <motion.div key={i} className="w-2 h-2 rounded-sm"
            style={{ background: `rgba(255,140,66,${0.3 + (i % 3) * 0.2})` }}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.15 }} />
        ))}
      </div>
    </div>
  );
}

function ImageContent() {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-5">
      <ThreeDCube size={64} color="#4CC9F0" active speed={7} />
      <div className="flex flex-col gap-1.5 font-mono text-[10px] flex-1">
        {['FROM node:18-alpine','COPY . /app','RUN npm ci','EXPOSE 3000','CMD ["node","server"]'].map((l, i) => (
          <motion.div key={i}
            style={{ color: i === 3 || i === 4 ? '#4CC9F0' : 'rgba(255,255,255,0.28)' }}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <span className="text-white/15 mr-1.5">{String(i+1).padStart(2,'0')}</span>{l}
          </motion.div>
        ))}
        <motion.div className="mt-1 text-[9px] font-bold" style={{ color: '#00FFA3' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          ✓ sha256:a1b2c3d4  ·  127 MB  ·  sealed
        </motion.div>
      </div>
    </div>
  );
}

function PushContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-3">
      {/* Upload visualization */}
      <div className="relative flex items-center justify-center w-full h-14">
        {[-48,-24,0,24,48].map((x, i) => (
          <motion.div key={i} className="absolute w-0.5 rounded-full"
            style={{ left: `calc(50% + ${x}px)`, background: `linear-gradient(to top, transparent, rgba(56,189,248,${0.4 + (i===2?0.4:0.1)}))` }}
            animate={{ height: [8, 28+i*4, 8], y: [-4,-16,-4] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity, repeatDelay: 0.2, ease: 'easeInOut' }} />
        ))}
        <motion.div className="w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{ background: 'rgba(56,189,248,0.12)', border: '1.5px solid rgba(56,189,248,0.55)', boxShadow: '0 0 24px rgba(56,189,248,0.3)' }}
          animate={{ y: [-2,2,-2] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </motion.div>
      </div>
      {/* ECR endpoint */}
      <div className="font-mono text-[9.5px] text-center">
        <div style={{ color: 'rgba(255,255,255,0.28)' }}>→  123456789.dkr.ecr.ap-south-1.amazonaws.com</div>
        <motion.div className="mt-1 font-bold" style={{ color: '#00FFA3' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          ✓  digest: sha256:9f8e7d·  127 MB pushed
        </motion.div>
      </div>
    </div>
  );
}

function DeployContent() {
  const PODS = [{ x: 0, y: -30 }, { x: -28, y: 15 }, { x: 28, y: 15 }];
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-5">
      {/* Pod cluster */}
      <div className="relative w-24 h-20 flex-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 80">
          <line x1="48" y1="20" x2="20" y2="55" stroke="rgba(124,77,255,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
          <line x1="48" y1="20" x2="76" y2="55" stroke="rgba(124,77,255,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
          <line x1="20" y1="55" x2="76" y2="55" stroke="rgba(124,77,255,0.3)" strokeWidth="1" strokeDasharray="3 2"/>
        </svg>
        {PODS.map(({ x, y }, i) => (
          <motion.div key={i}
            className="absolute w-11 h-8 rounded-xl flex items-center justify-center font-mono text-[8px] font-bold"
            style={{
              left: `calc(50% + ${x}px - 22px)`, top: `calc(50% + ${y}px - 16px)`,
              background: 'rgba(124,77,255,0.12)', border: '1px solid rgba(124,77,255,0.5)',
              color: '#7C4DFF',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2, type: 'spring', stiffness: 380 }}>
            pod-{i+1}
            <motion.div className="absolute -inset-1 rounded-xl border border-[#7C4DFF]"
              animate={{ scale: [1,1.5], opacity: [0.3,0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }} />
          </motion.div>
        ))}
      </div>
      {/* Status lines */}
      <div className="flex flex-col gap-2 font-mono text-[10px]">
        {[
          { t: '3/3 pods running', c: '#7C4DFF' },
          { t: 'ingress ready ✓',  c: 'rgba(255,255,255,0.4)' },
          { t: 'cert issued ✓',    c: 'rgba(255,255,255,0.4)' },
          { t: 'healthcheck ✓',    c: '#00FFA3' },
        ].map((l, i) => (
          <motion.div key={i} style={{ color: l.c }}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}>
            {l.t}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FULL_URL = 'app-name.hardikdevportal.duckdns.org';

function LiveContent() {
  const [typed, setTyped] = useState('');
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(FULL_URL.slice(0, i));
      if (i >= FULL_URL.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  const done = typed.length >= FULL_URL.length;

  return (
    <div className="w-full h-full px-3 py-2.5">
      <div className="w-full h-full rounded-xl overflow-hidden flex flex-col"
        style={{ border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>

        {/* Tab bar */}
        <div className="flex items-center gap-2 px-3 flex-none"
          style={{ height: 28, background: '#0e0e22', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex gap-1.5 flex-none">
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 rounded-t-lg flex-none"
            style={{ height: '100%', background: '#1a1a38', borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-2 h-2 rounded-sm flex-none" style={{ background: '#7C4DFF' }} />
            <span className="font-mono text-[8px] text-white/55 whitespace-nowrap">app-name — DevPortal</span>
          </div>
        </div>

        {/* Address bar */}
        <div className="flex items-center gap-2 px-3 flex-none"
          style={{ height: 30, background: '#111128', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex gap-1 flex-none">
            {['←','→','↻'].map((s, i) => (
              <div key={i} className="w-5 h-5 rounded-md flex items-center justify-center text-[9px]"
                style={{ background: 'rgba(255,255,255,0.04)', color: i < 2 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.45)' }}>
                {s}
              </div>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2 rounded-lg h-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${done ? 'rgba(0,255,163,0.35)' : 'rgba(255,255,255,0.08)'}`, transition: 'border-color 0.5s' }}>
            <svg width="7" height="8" viewBox="0 0 24 24" fill="none"
              stroke={done ? '#00FFA3' : 'rgba(255,255,255,0.25)'} strokeWidth="2.5" style={{ flexShrink: 0, transition: 'stroke 0.5s' }}>
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span className="font-mono text-[8px] flex-1 overflow-hidden whitespace-nowrap"
              style={{ color: done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}>
              {typed}{!done && <span style={{ opacity: cursorOn ? 1 : 0 }}>|</span>}
            </span>
            {done && (
              <motion.div className="w-1.5 h-1.5 rounded-full flex-none"
                style={{ background: '#00FFA3', boxShadow: '0 0 5px #00FFA3' }}
                animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.1, repeat: Infinity }} />
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 relative overflow-hidden" style={{ background: '#040D18' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(124,77,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,77,255,0.04) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
          {/* navbar */}
          <div className="flex items-center px-3 py-1.5 gap-2 relative z-10"
            style={{ borderBottom: '1px solid rgba(124,77,255,0.12)', background: 'rgba(4,13,24,0.92)' }}>
            <div className="w-3 h-3 rounded-sm flex-none" style={{ background: '#7C4DFF', boxShadow: '0 0 6px rgba(124,77,255,0.6)' }} />
            <div className="w-10 h-1 rounded-full bg-white/20 flex-none" />
            <div className="flex gap-2.5 ml-2">
              {[18,14,20,13].map((w,i) => <div key={i} className="h-0.5 rounded-full bg-white/14" style={{ width: w }} />)}
            </div>
            <div className="ml-auto h-4 w-14 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(124,77,255,0.55)', boxShadow: '0 0 10px rgba(124,77,255,0.3)' }}>
              <div className="h-0.5 w-8 rounded-full bg-white/60" />
            </div>
          </div>
          {/* hero content */}
          <div className="flex items-start px-3 pt-3 gap-3 relative z-10">
            <div className="flex-1">
              <motion.div className="flex items-center gap-1 mb-2 w-fit px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <div className="w-1 h-1 rounded-full" style={{ background: '#7C4DFF' }} />
                <div className="h-0.5 w-12 rounded-full bg-white/20" />
              </motion.div>
              <motion.div className="h-4 rounded-sm mb-1"
                style={{ width: 106, background: 'linear-gradient(90deg,#7C4DFF,#4CC9F0)' }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: [null,0.8,1,0.8], y: 0 }}
                transition={{ opacity: { duration: 2, repeat: Infinity, delay: 0.2 }, y: { duration: 0.35, delay: 0.2 } }} />
              <motion.div className="h-2.5 rounded-sm mb-2.5"
                style={{ width: 80, background: 'rgba(124,77,255,0.35)' }}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
                <div className="h-1 rounded-full bg-white/16 mb-1" style={{ width: 120 }} />
                <div className="h-1 rounded-full bg-white/10 mb-2.5" style={{ width: 90 }} />
              </motion.div>
              <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>
                <div className="h-5 rounded-md flex items-center justify-center"
                  style={{ width: 46, background: 'rgba(124,77,255,0.65)', boxShadow: '0 0 8px rgba(124,77,255,0.4)' }}>
                  <div className="h-0.5 w-5 rounded-full bg-white/70" />
                </div>
                <div className="h-5 rounded-md" style={{ width: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </motion.div>
            </div>
            <motion.div className="flex-none flex flex-col gap-1.5"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}>
              <motion.div className="rounded-lg p-2"
                style={{ width: 68, background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)', boxShadow: '0 0 16px rgba(124,77,255,0.15)' }}
                animate={{ y: [0,-3,0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="h-1 w-8 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FFA3', boxShadow: '0 0 4px #00FFA3' }} />
                </div>
                <div className="h-0.5 w-full rounded-full bg-white/10 mb-1" />
                <div className="h-0.5 w-3/4 rounded-full bg-white/8" />
              </motion.div>
              <motion.div className="rounded-lg p-1.5"
                style={{ width: 68, background: 'rgba(76,201,240,0.07)', border: '1px solid rgba(76,201,240,0.2)' }}
                animate={{ y: [0,-2,0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
                <div className="h-1 w-6 rounded-full bg-white/15 mb-1" />
                <div className="h-0.5 w-10 rounded-full bg-white/8" />
              </motion.div>
            </motion.div>
          </div>
          <div className="flex gap-1.5 px-3 mt-3 relative z-10">
            {[{ r:'157,111,255',icon:'⚡' },{ r:'76,201,240',icon:'🔒' },{ r:'0,255,163',icon:'📈' }].map(({ r, icon }, i) => (
              <motion.div key={i} className="flex-1 rounded-lg px-2 py-1.5 flex flex-col gap-1"
                style={{ background: `rgba(${r},0.07)`, border: `1px solid rgba(${r},0.2)` }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.1 }}>
                <span style={{ fontSize: 9, lineHeight: 1 }}>{icon}</span>
                <div className="h-1 rounded-full" style={{ width: '85%', background: `rgba(${r},0.45)` }} />
                <div className="h-0.5 rounded-full bg-white/10" style={{ width: '60%' }} />
              </motion.div>
            ))}
          </div>
          {/* LIVE badge */}
          <motion.div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,255,163,0.14)', border: '1px solid rgba(0,255,163,0.45)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [null,0.85,1,0.85], scale: 1 }}
            transition={{ scale: { delay: 0.6, type: 'spring', stiffness: 300 }, opacity: { duration: 1.6, repeat: Infinity, delay: 0.6 } }}>
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FFA3', boxShadow: '0 0 6px #00FFA3' }}
              animate={{ opacity: [1,0.2,1] }} transition={{ duration: 0.9, repeat: Infinity }} />
            <span className="text-[8px] font-mono font-bold tracking-wider" style={{ color: '#00FFA3' }}>LIVE</span>
          </motion.div>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(124,77,255,0.07) 0%, transparent 70%)' }} />
        </div>
      </div>
    </div>
  );
}

const STAGE_CONTENT = [SourceContent, BuildContent, ImageContent, PushContent, DeployContent, LiveContent];

/* ── Elapsed timer ───────────────────────────────────────────── */
function ElapsedTimer({ running }) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const id = setInterval(() => setMs(Date.now() - start), 100);
    return () => clearInterval(id);
  }, [running]);
  const s = (ms / 1000).toFixed(1);
  return <span>{s}s</span>;
}

/* ── Stage node in the pipeline tracker ─────────────────────── */
function PipelineNode({ stage, state, index }) {
  const isActive = state === 'active';
  const isDone   = state === 'done';
  return (
    <div className="flex flex-col items-center gap-1 relative">
      <motion.div
        className="relative w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold flex-none"
        style={{
          background: isDone ? `rgba(${stage.rgb},0.25)` : isActive ? `rgba(${stage.rgb},0.2)` : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${isActive ? stage.color : isDone ? `rgba(${stage.rgb},0.6)` : 'rgba(255,255,255,0.1)'}`,
          color: isActive || isDone ? stage.color : 'rgba(255,255,255,0.2)',
          boxShadow: isActive ? `0 0 16px rgba(${stage.rgb},0.5)` : 'none',
          transition: 'all 0.4s ease',
        }}
        animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={isActive ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        {isDone ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : (
          index + 1
        )}
        {isActive && (
          <motion.div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: `1px solid ${stage.color}` }}
            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }} />
        )}
      </motion.div>
      <span className="text-[8px] font-mono"
        style={{ color: isActive ? stage.color : isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.18)', transition: 'color 0.4s' }}>
        {stage.label}
      </span>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */
export default function AssemblyHero() {
  const [step,        setStep]        = useState('cube');
  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      while (!cancelled) {
        setStep('cube'); setActiveStage(-1);
        await sleep(2600);
        if (cancelled) break;
        setStep('launch');
        await sleep(700);
        if (cancelled) break;
        setStep('pipeline');
        for (let i = 0; i < 6 && !cancelled; i++) {
          setActiveStage(i);
          await sleep(i === 5 ? 3800 : 2800);
        }
        if (cancelled) break;
        setStep('explode');
        await sleep(1800);
      }
    };
    go();
    return () => { cancelled = true; };
  }, []);

  const pipeOn      = step === 'pipeline' || step === 'explode';
  const cubeVisible = step === 'cube' || step === 'launch';
  const launched    = step === 'launch';
  const stage       = STAGES[activeStage] ?? STAGES[0];
  const Content     = STAGE_CONTENT[activeStage] ?? SourceContent;
  const meta        = STAGE_META[activeStage] ?? STAGE_META[0];

  const nodeState = (i) => {
    if (!pipeOn) return 'idle';
    if (i < activeStage) return 'done';
    if (i === activeStage) return 'active';
    return 'idle';
  };

  return (
    <div className="relative flex flex-col items-center gap-0 select-none overflow-visible" style={{ width: '100%' }}>

      {/* ── Pre-pipeline: 3D cube centered ── */}
      <AnimatePresence>
        {cubeVisible && (
          <motion.div
            className="flex items-center justify-center"
            style={{ height: 200 }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: launched ? 0 : 1, scale: launched ? 1.4 : 1, y: launched ? -40 : 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -20 }}
            transition={{ opacity: { duration: 0.4 }, scale: { duration: 0.45, ease: launched ? 'easeIn' : 'backOut' }, y: { duration: 0.45 } }}
          >
            {/* Radial glow behind cube */}
            <div className="absolute w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.3) 0%, transparent 70%)', filter: 'blur(24px)' }} />
            {/* Rotating ring */}
            <motion.div className="absolute w-36 h-36 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(124,77,255,0.2)' }}
              animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute w-48 h-48 rounded-full pointer-events-none"
              style={{ border: '1px solid rgba(76,201,240,0.1)' }}
              animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
            <ThreeDCube size={86} color="#7C4DFF" icon="</>" active speed={5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stage Display Panel ── */}
      <AnimatePresence>
        {pipeOn && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 32, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ambient glow under card */}
            <div className="absolute left-1/2 -translate-x-1/2 w-3/4 h-16 -bottom-4 pointer-events-none rounded-full"
              style={{ background: `rgba(${stage.rgb},0.22)`, filter: 'blur(28px)', transition: 'background 0.6s ease' }} />

            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: `rgba(4,13,24,0.92)`,
                border: `1px solid rgba(${stage.rgb},0.3)`,
                boxShadow: `0 0 0 1px rgba(${stage.rgb},0.08), 0 8px 40px rgba(0,0,0,0.6), 0 0 80px rgba(${stage.rgb},0.14), inset 0 0 60px rgba(${stage.rgb},0.03)`,
                transition: 'border-color 0.55s, box-shadow 0.55s',
              }}
            >
              {/* Subtle grid inside card */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />

              {/* ── Header: pipeline tracker + stage label ── */}
              <div className="relative px-5 pt-4 pb-3" style={{ borderBottom: `1px solid rgba(${stage.rgb},0.12)` }}>

                {/* Pipeline node tracker */}
                <div className="flex items-start justify-between mb-4">
                  {STAGES.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                      <PipelineNode stage={s} state={nodeState(i)} index={i} />
                      {i < STAGES.length - 1 && (
                        <div className="flex-1 relative mx-1" style={{ height: 1.5, marginBottom: 18 }}>
                          <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                          <motion.div className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: i < activeStage ? STAGES[i].color : 'transparent', transition: 'background 0.4s ease' }}
                            animate={{ width: i < activeStage ? '100%' : i === activeStage ? '55%' : '0%' }}
                            transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Active stage name + sub + timer */}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div className="w-3 h-3 rounded-full flex-none"
                      style={{ background: stage.color, boxShadow: `0 0 10px ${stage.color}` }}
                      animate={{ opacity: [1,0.2,1], scale: [1,1.25,1] }}
                      transition={{ duration: 1.1, repeat: Infinity }} />
                    <AnimatePresence mode="wait">
                      <motion.div key={activeStage} className="flex items-baseline gap-2"
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}>
                        <span className="text-[22px] font-bold tracking-tight leading-none" style={{ color: stage.color }}>
                          {stage.label}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: `rgba(${stage.rgb},0.55)` }}>
                          {stage.sub}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <motion.span animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1.6, repeat: Infinity }}>●</motion.span>
                    <ElapsedTimer key={activeStage} running={step === 'pipeline'} />
                  </div>
                </div>
              </div>

              {/* ── Progress bar (full-bleed, stage color) ── */}
              <div className="h-[2px] w-full relative overflow-hidden" style={{ background: `rgba(${stage.rgb},0.07)` }}>
                <motion.div className="absolute inset-y-0 left-0"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(${stage.rgb},0.5), ${stage.color})`, boxShadow: `2px 0 12px ${stage.color}` }}
                  key={activeStage}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: activeStage === 5 ? 3.8 : 2.8, ease: 'linear' }} />
              </div>

              {/* ── Content area ── */}
              <motion.div
                className="relative overflow-hidden"
                animate={{ height: activeStage === 5 ? 280 : 155 }}
                transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
              >
                {/* Stage-color edge glow */}
                <div className="absolute inset-y-0 left-0 w-1 pointer-events-none"
                  style={{ background: `linear-gradient(to bottom, transparent, rgba(${stage.rgb},0.4), transparent)`, transition: 'background 0.55s' }} />

                <AnimatePresence mode="wait">
                  <motion.div key={activeStage} className="absolute inset-0 flex items-center"
                    initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -24, filter: 'blur(4px)' }}
                    transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}>
                    <div className="w-full">
                      <Content />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* ── Footer: live metrics ── */}
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid rgba(${stage.rgb},0.1)` }}>
                {/* Metric pills */}
                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeStage} className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}>
                      {[meta.a, meta.b, meta.c].map((val, i) => (
                        <span key={i}
                          className="px-2 py-0.5 rounded-lg font-mono text-[9px]"
                          style={{
                            background: `rgba(${stage.rgb},0.1)`,
                            border: `1px solid rgba(${stage.rgb},0.22)`,
                            color: i === 0 ? stage.color : 'rgba(255,255,255,0.45)',
                          }}>
                          {val}
                        </span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pulse bars + running indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-0.5 rounded-full"
                        style={{ background: stage.color }}
                        animate={{ height: [6, 14+i*4, 6], opacity: [0.4,1,0.4] }}
                        transition={{ duration: 0.9, delay: i*0.18, repeat: Infinity, ease: 'easeInOut' }} />
                    ))}
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: `rgba(${stage.rgb},0.7)` }}>
                    ● running
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Explode burst ── */}
      <AnimatePresence>
        {step === 'explode' && (
          <div className="absolute top-20 right-4 pointer-events-none">
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              const c = ['#00FFA3','#4CC9F0','#9D6FFF','#FF8C42'][i % 4];
              return (
                <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                  style={{ background: c, boxShadow: `0 0 6px ${c}` }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: Math.cos(a)*80, y: Math.sin(a)*80, scale: 0, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.02 }} />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
