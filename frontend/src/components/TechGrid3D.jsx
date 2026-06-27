import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import ThreeDCube from './ThreeDCube';
import ParticleField from './ParticleField';

const TECH = [
  { icon: 'k8s',  label: 'Kubernetes',       color: '#326CE5', size: 72, speed: 9  },
  { icon: 'dkr',  label: 'Docker',            color: '#4CC9F0', size: 62, speed: 11 },
  { icon: 'ecr',  label: 'AWS ECR',           color: '#FF9900', size: 54, speed: 13 },
  { icon: 'argo', label: 'ArgoCD',            color: '#EF7B4D', size: 62, speed: 10 },
  { icon: 'tf',   label: 'Terraform',         color: '#844FBA', size: 54, speed: 14 },
  { icon: 'helm', label: 'Helm',              color: '#7C4DFF', size: 72, speed: 8  },
  { icon: 'cert', label: 'Cert Manager',      color: '#4CC9F0', size: 54, speed: 12 },
  { icon: 'k3s',  label: 'K3s',               color: '#FFC61C', size: 62, speed: 10 },
  { icon: 'ext',  label: 'Ext Secrets',       color: '#9D6FFF', size: 54, speed: 15 },
  { icon: 'ci',   label: 'GitHub Actions',    color: '#2DA44E', size: 62, speed: 11 },
];

const HOW_STEPS = [
  { n: '01', title: 'Submit Repo',    desc: 'Paste your GitHub URL + app name in the portal.' },
  { n: '02', title: 'Automated Build', desc: 'GitHub Actions clones, builds Docker image, pushes to ECR.' },
  { n: '03', title: 'GitOps Sync',    desc: 'Helm values committed to devportal-gitops → ArgoCD picks it up.' },
  { n: '04', title: 'Live in ~55s',   desc: 'Kubernetes deploys, Cert Manager provisions TLS, ingress is up.' },
];

export default function TechGrid3D() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 overflow-hidden">
      <ParticleField density={40} className="opacity-40" />

      {/* Glow centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(76,201,240,0.05) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(76,201,240,0.1)', border: '1px solid rgba(76,201,240,0.25)', color: '#4CC9F0' }}
          >
            How It Works
          </span>
          <h2 className="text-4xl font-bold mb-4">Four steps to production</h2>
          <p className="text-white/40 text-lg">End-to-end automated, every time.</p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-5 mb-20">
          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group"
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #7C4DFF60, transparent)' }}
              />
              <span
                className="text-4xl font-bold mb-3 block text-gradient-purple opacity-30 group-hover:opacity-60 transition-opacity duration-300"
              >
                {s.n}
              </span>
              <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              {i < HOW_STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(124,77,255,0.4)" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── 3D Tech Grid heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)', color: '#C084FC' }}
          >
            Infrastructure Stack
          </span>
          <h2 className="text-4xl font-bold mb-3">Built on battle-tested tools</h2>
          <p className="text-white/40">Every component of the stack, visualised.</p>
        </motion.div>

        {/* Cubes grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {TECH.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.12 }}
              className="cursor-default group relative"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                style={{ background: t.color }}
              />
              <ThreeDCube
                size={t.size}
                color={t.color}
                icon={<span className="text-[10px] font-bold font-mono">{t.icon}</span>}
                label={t.label}
                active={false}
                speed={t.speed}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom connection line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 1, ease: 'easeInOut' }}
          className="mt-16 mx-auto"
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #7C4DFF60, #4CC9F060, transparent)',
            transformOrigin: 'center',
          }}
        />
      </div>
    </section>
  );
}
