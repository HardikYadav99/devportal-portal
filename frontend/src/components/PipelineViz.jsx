import { motion } from 'framer-motion';

const STAGES = [
  { label: 'Source',    icon: '</>',  color: '#7C4DFF', glow: 'rgba(124,77,255,0.5)'  },
  { label: 'Build',     icon: '⚙',    color: '#9D6FFF', glow: 'rgba(157,111,255,0.5)' },
  { label: 'Image',     icon: '▣',    color: '#4CC9F0', glow: 'rgba(76,201,240,0.5)'  },
  { label: 'Push',      icon: '↑',    color: '#4CC9F0', glow: 'rgba(76,201,240,0.5)'  },
  { label: 'Deploy',    icon: '✦',    color: '#7C4DFF', glow: 'rgba(124,77,255,0.5)'  },
  { label: 'TLS',       icon: '◉',    color: '#9D6FFF', glow: 'rgba(157,111,255,0.5)' },
  { label: 'Live',      icon: '✓',    color: '#00FFA3', glow: 'rgba(0,255,163,0.6)'   },
];

const wrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};

const stage = {
  hidden:  { opacity: 0, scale: 0.6, y: 16 },
  visible: { opacity: 1, scale: 1,   y: 0,  transition: { type: 'spring', stiffness: 300, damping: 22 } },
};

export default function PipelineViz() {
  return (
    <div className="relative w-full select-none">
      {/* Ambient glow behind card */}
      <div
        className="absolute -inset-8 rounded-3xl blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #7C4DFF 0%, #4CC9F0 50%, transparent 70%)' }}
      />

      <motion.div
        className="relative glass rounded-2xl p-6 float"
        style={{ border: '1px solid rgba(124,77,255,0.18)' }}
        variants={wrap}
        initial="hidden"
        animate="visible"
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-xs font-mono text-white/40 ml-2">deployment-pipeline.yaml</span>
          <div className="flex-1 h-px bg-white/5 ml-2" />
          <span className="text-[10px] font-mono text-[#00FFA3] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] inline-block" style={{ animation: 'status-blink 1.5s ease-in-out infinite' }} />
            RUNNING
          </span>
        </div>

        {/* Pipeline stages */}
        <div className="flex items-center">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex items-center flex-1 min-w-0">
              <motion.div variants={stage} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                {/* Stage icon box */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold relative"
                  style={{
                    background: `${s.color}12`,
                    border: `1px solid ${s.color}35`,
                    color: s.color,
                    boxShadow: s.label === 'Live' ? `0 0 18px ${s.glow}` : 'none',
                  }}
                >
                  {s.icon}
                  {s.label === 'Live' && (
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{ border: `1px solid ${s.color}`, animation: 'pulse-ring 2s ease-out infinite' }}
                    />
                  )}
                </div>
                <span className="text-[9px] text-white/40 font-medium tracking-wide uppercase">{s.label}</span>
              </motion.div>

              {/* Connector with traveling particle */}
              {i < STAGES.length - 1 && (
                <div className="flex-1 relative h-px mx-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: s.color,
                      boxShadow: `0 0 6px ${s.color}`,
                      animation: `particle-travel ${1.2 + i * 0.05}s ${i * 0.28}s linear infinite`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer status */}
        <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-mono text-white/25">myapp:a1b2c3d → ecr.ap-south-1</span>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(0,255,163,0.1)', color: '#00FFA3', border: '1px solid rgba(0,255,163,0.2)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" />
            LIVE & SECURE
          </div>
        </div>
      </motion.div>

      {/* Floating stat chips */}
      <motion.div
        className="absolute -top-5 -right-3 glass rounded-xl px-3 py-2 float-b"
        style={{ border: '1px solid rgba(76,201,240,0.25)' }}
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}
      >
        <div className="text-[9px] font-mono text-white/35">deploy time</div>
        <div className="text-sm font-bold text-[#4CC9F0]">~55s</div>
      </motion.div>

      <motion.div
        className="absolute -bottom-5 -left-3 glass rounded-xl px-3 py-2 float-c"
        style={{ border: '1px solid rgba(0,255,163,0.25)' }}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
      >
        <div className="text-[9px] font-mono text-white/35">uptime</div>
        <div className="text-sm font-bold text-[#00FFA3]">99.9%</div>
      </motion.div>
    </div>
  );
}
