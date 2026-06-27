import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Instant Deploy',
    desc: 'Go from a GitHub URL to a live Kubernetes deployment in under 60 seconds.',
    color: '#7C4DFF',
    glow: 'rgba(124,77,255,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure by Default',
    desc: 'TLS certificates via Cert Manager, network policies, and secrets via External Secrets.',
    color: '#4CC9F0',
    glow: 'rgba(76,201,240,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Auto Scale',
    desc: 'K3s-powered cluster scales your workloads automatically with traffic spikes.',
    color: '#00FFA3',
    glow: 'rgba(0,255,163,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Observable',
    desc: 'Real-time deployment status, pod health, and ArgoCD sync — all in one dashboard.',
    color: '#9D6FFF',
    glow: 'rgba(157,111,255,0.15)',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>
      </svg>
    ),
    title: 'GitOps Powered',
    desc: 'Every deployment is a git commit. Declarative, versioned, and self-healing.',
    color: '#4CC9F0',
    glow: 'rgba(76,201,240,0.15)',
  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 48, filter: 'blur(10px)', scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, filter: 'blur(0px)', scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} className="relative py-28 overflow-hidden">
      {/* Faint grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 36, filter: 'blur(14px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)', color: '#C084FC' }}
          >
            Why DevPortal
          </span>
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to ship
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Production-grade infrastructure, zero configuration.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass rounded-2xl p-6 cursor-default transition-all duration-300 group"
              style={{
                '--feat-color': feat.color,
                '--feat-glow': feat.glow,
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: feat.glow,
                  border: `1px solid ${feat.color}30`,
                  color: feat.color,
                  boxShadow: `0 0 20px ${feat.glow}`,
                }}
              >
                {feat.icon}
              </div>
              <h3 className="font-semibold text-base mb-2" style={{ color: 'white' }}>
                {feat.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">{feat.desc}</p>

              {/* Bottom accent line */}
              <div
                className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500 rounded"
                style={{ background: `linear-gradient(90deg, ${feat.color}, transparent)` }}
              />
            </motion.div>
          ))}

          {/* Empty 6th slot — summary card */}
          <motion.div
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="glass-purple rounded-2xl p-6 flex flex-col justify-between cursor-default md:col-span-1"
          >
            <div>
              <div className="text-3xl font-bold text-gradient mb-2">V2.1</div>
              <div className="text-sm text-white/40 mb-4">Multi-tenant support, deletion workflow, premium UI</div>
            </div>
            <div className="space-y-2">
              {['Multi-tenant deploys', 'Full deletion pipeline', 'ArgoCD App-of-Apps', 'AWS ECR per app'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-white/55">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00FFA3" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
