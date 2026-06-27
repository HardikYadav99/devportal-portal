import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 45, start = false) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!start) { setDisplay(''); return; }
    let i = 0;
    setDisplay('');
    const iv = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, start]);
  return display;
}

/* ── Individual requirement item ── */
function Req({ children }) {
  return (
    <li className="flex items-start gap-2 text-xs text-white/40 leading-relaxed">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C4DFF" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {children}
    </li>
  );
}

/* ── App row in deployed list ── */
function AppRow({ app, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(app.name);
    setDeleting(false);
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-[#00FFA3]" style={{ boxShadow: '0 0 6px #00FFA3', animation: 'status-blink 2s ease-in-out infinite' }} />
        <div>
          <div className="text-sm font-semibold text-white">{app.name}</div>
          <a
            href={app.url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-mono text-[#4CC9F0] hover:text-[#7C4DFF] transition-colors"
          >
            {app.url}
          </a>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDelete}
        disabled={deleting}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
        style={{
          background: deleting ? 'rgba(255,255,255,0.03)' : 'rgba(255,59,48,0.08)',
          border: `1px solid ${deleting ? 'rgba(255,255,255,0.08)' : 'rgba(255,59,48,0.25)'}`,
          color: deleting ? 'rgba(255,255,255,0.3)' : 'rgba(255,100,90,0.9)',
        }}
      >
        {deleting ? '...' : 'Delete'}
      </motion.button>
    </motion.div>
  );
}

/* ── Main component ── */
export default function DeploySection({ repoUrl, setRepoUrl, appName, setAppName, handleDeploy, loading, message, applications, handleDelete }) {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });
  const titleStarted = useInView(sectionRef, { once: true, margin: '-120px' });
  const typed = useTypewriter('Deploy Your Application', 50, titleStarted);

  /* Scroll-driven 3D effect */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 95%', 'start 15%'],
  });
  const rotateX  = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale    = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity  = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const glowY    = useTransform(scrollYProgress, [0, 1], ['80px', '0px']);

  /* Form variants */
  const formContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const formItem = {
    hidden:  { opacity: 0, y: 18, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const messageIsError = message && (message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') || message.toLowerCase().includes('required'));

  return (
    <section
      id="deploy"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Animated grid that powers up on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,77,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,77,255,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: gridOpacity,
        }}
      />

      {/* Ambient glow that rises with scroll */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{
          y: glowY,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(124,77,255,0.2), transparent 70%)',
          bottom: 0,
        }}
      />

      {/* Subtle scan line across section */}
      {inView && (
        <div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(124,77,255,0.5), rgba(76,201,240,0.5), transparent)',
            animation: 'scan-line 4s ease-in-out 0.5s forwards',
            zIndex: 0,
          }}
        />
      )}

      <div className="relative max-w-3xl mx-auto px-6">
        {/* 3D fold-in container */}
        <motion.div style={{ rotateX, scale, opacity, transformOrigin: 'top center' }}>

          {/* Section heading */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)', color: '#C084FC' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Ready to Launch
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-4 min-h-[1.2em]">
              <span className="text-gradient">{typed}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-[#7C4DFF] ml-0.5"
              >
                |
              </motion.span>
            </h2>
            <p className="text-white/40 text-base max-w-md mx-auto">
              Paste your GitHub repo, give it a name, and watch it go live on Kubernetes.
            </p>
          </div>

          {/* Form card */}
          <motion.div
            ref={formRef}
            variants={formContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative glass rounded-3xl p-8"
            style={{ border: '1px solid rgba(124,77,255,0.2)', boxShadow: '0 0 80px rgba(124,77,255,0.1)' }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 rounded-tl-3xl border-t-2 border-l-2 border-[#7C4DFF] opacity-60" />
            <div className="absolute top-0 right-0 w-6 h-6 rounded-tr-3xl border-t-2 border-r-2 border-[#7C4DFF] opacity-60" />
            <div className="absolute bottom-0 left-0 w-6 h-6 rounded-bl-3xl border-b-2 border-l-2 border-[#7C4DFF] opacity-60" />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-br-3xl border-b-2 border-r-2 border-[#7C4DFF] opacity-60" />

            {/* Inputs */}
            <div className="space-y-4">
              <motion.div variants={formItem} className="relative group">
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="neon-input w-full pl-9 pr-4 py-3.5 rounded-xl"
                  />
                  {/* Scanline effect on focus */}
                  <div
                    className="absolute left-0 right-0 h-px pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity"
                    style={{ background: 'linear-gradient(90deg, transparent, #7C4DFF80, transparent)', animation: 'scan-line 2s ease-in-out 0.1s forwards' }}
                  />
                </div>
              </motion.div>

              <motion.div variants={formItem} className="relative group">
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Application Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 font-mono text-xs">$</span>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="my-app (lowercase, hyphens only)"
                    className="neon-input w-full pl-8 pr-4 py-3.5 rounded-xl"
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-white/25 font-mono pl-1">
                  → accessible at <span className="text-[#4CC9F0]">{appName || 'your-app'}.hardikdevportal.duckdns.org</span>
                </p>
              </motion.div>

              {/* Requirements */}
              <motion.div
                variants={formItem}
                className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Requirements</div>
                <ul className="space-y-1.5">
                  <Req>Repository must be public</Req>
                  <Req>Dockerfile in root of repository</Req>
                  <Req>App must expose port <span className="text-[#7C4DFF] font-mono">3000</span></Req>
                  <Req>Node.js applications currently supported</Req>
                </ul>
              </motion.div>

              {/* Deploy button */}
              <motion.div variants={formItem}>
                <motion.button
                  onClick={handleDeploy}
                  disabled={loading}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className="btn-deploy w-full py-4 rounded-xl text-sm relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        Deploy to Kubernetes
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Status message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="mt-4 px-5 py-3.5 rounded-xl text-sm flex items-center gap-3"
                style={{
                  background: messageIsError ? 'rgba(255,59,48,0.08)' : 'rgba(0,255,163,0.07)',
                  border: `1px solid ${messageIsError ? 'rgba(255,59,48,0.2)' : 'rgba(0,255,163,0.2)'}`,
                  color: messageIsError ? 'rgba(255,100,90,0.9)' : '#00FFA3',
                }}
              >
                <span className="text-base">{messageIsError ? '⚠' : '✓'}</span>
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deployed apps */}
          <AnimatePresence>
            {applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Deployed Applications
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(0,255,163,0.1)', color: '#00FFA3', border: '1px solid rgba(0,255,163,0.2)' }}
                  >
                    {applications.length} live
                  </span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {applications.map((app) => (
                      <AppRow key={app.name} app={app} onDelete={handleDelete} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
}
