import { motion } from 'framer-motion';
import ParticleField from './ParticleField';
import AssemblyHero from './AssemblyHero';

const item = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: 80 }}
    >
      {/* ── Particle canvas background ── */}
      <ParticleField density={80} />

      {/* ── Deep background radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,77,255,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 75% 50%, rgba(76,201,240,0.07) 0%, transparent 65%)',
        }}
      />

      {/* ── Horizontal gradient lines (depth) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,77,255,0.06) 1px, transparent 1px)',
          backgroundSize: '100% 70px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-start">

          {/* ── Left: content ── */}
          <motion.div variants={container} initial="hidden" animate="visible">

            {/* Badge */}
            <motion.div variants={item} className="mb-5">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)', color: '#C084FC' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C4DFF]" style={{ animation: 'status-blink 2s infinite' }} />
                Self-service PaaS · V2.1
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item} className="text-5xl lg:text-[3.6rem] font-bold leading-[1.12] tracking-tight mb-4">
              You Build.
              <br />
              <span className="text-gradient">We Deploy.</span>
            </motion.h1>

            {/* Motto accent line */}
            <motion.div variants={item} className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#7C4DFF] opacity-50" />
              <span className="text-xs font-mono text-white/35 uppercase tracking-widest">From code to production</span>
            </motion.div>

            {/* Sub */}
            <motion.p variants={item} className="text-lg text-white/45 mb-8 max-w-md leading-relaxed">
              Paste a GitHub URL. Name your app. Watch it go live on Kubernetes — TLS provisioned, ingress configured, fully automated.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex items-center gap-4 mb-9">
              <motion.a
                href="#deploy"
                whileHover={{ scale: 1.04, boxShadow: '0 0 44px rgba(124,77,255,0.55)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg,#7C4DFF,#5B2FD4)', boxShadow: '0 0 24px rgba(124,77,255,0.4)' }}
              >
                Deploy Now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.a>
              <a
                href="#features"
                className="px-6 py-3.5 rounded-xl text-sm font-medium text-white/55 hover:text-white inline-flex items-center gap-2 border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                See How It Works
              </a>
            </motion.div>

            {/* Stack tags */}
            <motion.div variants={item} className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/20 font-mono mr-1">stack</span>
              {['K3s', 'ArgoCD', 'Helm', 'AWS ECR', 'Cert Manager'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{
                    scale: 1.12,
                    boxShadow: '0 0 14px rgba(124,77,255,0.35)',
                    backgroundColor: 'rgba(124,77,255,0.12)',
                    borderColor: 'rgba(124,77,255,0.38)',
                  }}
                  className="px-2.5 py-0.5 rounded text-[11px] font-mono cursor-default"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.42)' }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: 3D assembly animation ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pl-4 lg:pt-4"
          >
            <AssemblyHero />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <span className="text-[13px] font-mono tracking-[0.22em] uppercase text-white/28 group-hover:text-white/45 transition-colors duration-300">Explore</span>
            <div className="p-2 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
