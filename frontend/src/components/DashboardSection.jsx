import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const TIMELINE = [
  { step: 'Code Pushed',      time: '0s',   done: true },
  { step: 'Build Started',    time: '5s',   done: true },
  { step: 'Docker Image',     time: '18s',  done: true },
  { step: 'Pushed to ECR',    time: '26s',  done: true },
  { step: 'Manifest Updated', time: '30s',  done: true },
  { step: 'Deploying to K8s', time: '42s',  done: true },
  { step: 'App Ready',        time: '55s',  done: true, final: true },
];

const APPS = [
  { name: 'ecommerce', status: 'Live',      url: 'ecommerce.hardikdevportal.duckdns.org' },
  { name: 'portfolio',  status: 'Live',      url: 'portfolio.hardikdevportal.duckdns.org'  },
  { name: 'blog',       status: 'Building',  url: 'blog.hardikdevportal.duckdns.org'       },
  { name: 'chat-app',   status: 'Deploying', url: 'chat.hardikdevportal.duckdns.org'       },
];

function statusColor(s) {
  if (s === 'Live') return { color: '#00FFA3', bg: 'rgba(0,255,163,0.1)', border: 'rgba(0,255,163,0.25)' };
  if (s === 'Building') return { color: '#FEBC2E', bg: 'rgba(254,188,46,0.1)', border: 'rgba(254,188,46,0.25)' };
  return { color: '#4CC9F0', bg: 'rgba(76,201,240,0.1)', border: 'rgba(76,201,240,0.25)' };
}

function Metric({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-[#00FFA3]">{value}</div>
      <div className="text-[10px] text-white/35 uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function DashboardSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let p = 0;
      const iv = setInterval(() => {
        p += 1;
        setProgress(p);
        if (p >= 100) clearInterval(iv);
      }, 18);
      return () => clearInterval(iv);
    }, 400);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(124,77,255,0.03) 50%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(76,201,240,0.1)', border: '1px solid rgba(76,201,240,0.25)', color: '#4CC9F0' }}
          >
            Dashboard
          </span>
          <h2 className="text-4xl font-bold mb-4">Built for velocity</h2>
          <p className="text-white/40 text-lg">Real-time visibility across every deployment.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Card 1 — Deployment timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Live Deploy Flow</div>
            <div className="space-y-3">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]"
                    style={{
                      background: item.final ? 'rgba(0,255,163,0.15)' : 'rgba(124,77,255,0.15)',
                      border: `1px solid ${item.final ? 'rgba(0,255,163,0.4)' : 'rgba(124,77,255,0.4)'}`,
                      color: item.final ? '#00FFA3' : '#7C4DFF',
                    }}
                  >
                    ✓
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-xs text-white/70">{item.step}</span>
                    <span className="text-[10px] font-mono text-white/30">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Card 2 — Apps table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-5 lg:col-span-1"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest">Applications</div>
              <span className="text-xs text-[#7C4DFF] font-medium cursor-pointer hover:text-[#9D6FFF]">View All →</span>
            </div>
            <div className="space-y-2.5">
              {APPS.map((app, i) => {
                const sc = statusColor(app.status);
                return (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{app.name}</div>
                      <div className="text-[9px] font-mono text-white/25 mt-0.5 truncate max-w-[140px]">{app.url}</div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0"
                      style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                    >
                      {app.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 3 — Status + metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-5 flex flex-col"
          >
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Deployment Status</div>

            {/* Circular progress */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#progressGrad)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.05s linear', filter: 'drop-shadow(0 0 6px rgba(0,255,163,0.5))' }}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C4DFF" />
                      <stop offset="100%" stopColor="#00FFA3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#00FFA3]">{progress}%</span>
                  <span className="text-[9px] text-white/35 font-mono uppercase">health</span>
                </div>
              </div>

              <div
                className="w-full py-2 rounded-lg text-center text-xs font-semibold"
                style={{ background: 'rgba(0,255,163,0.08)', border: '1px solid rgba(0,255,163,0.2)', color: '#00FFA3' }}
              >
                DEPLOYED — Live & Healthy
              </div>

              <div className="grid grid-cols-3 w-full gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Metric value="99.9%" label="Uptime" />
                <Metric value="142ms" label="Response" />
                <Metric value="3/3" label="Pods" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
