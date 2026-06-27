import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TECH = [
  'GitHub', 'Docker', 'Amazon ECR', 'Helm', 'Kubernetes',
  'ArgoCD', 'Cert Manager', 'External Secrets', 'K3s', 'AWS',
  'NGINX Ingress', 'Terraform',
  // duplicate for seamless loop
  'GitHub', 'Docker', 'Amazon ECR', 'Helm', 'Kubernetes',
  'ArgoCD', 'Cert Manager', 'External Secrets', 'K3s', 'AWS',
  'NGINX Ingress', 'Terraform',
];

const LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Docs:    ['Getting Started', 'API Reference', 'CLI', 'Guides'],
  Company: ['About', 'Blog', 'GitHub', 'Contact'],
};

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer
      ref={ref}
      className="relative pt-20 pb-10 overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,77,255,0.6), rgba(76,201,240,0.6), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Tech ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center text-xs font-semibold text-white/25 uppercase tracking-widest mb-6">
            Built for Modern Infrastructure
          </div>
          <div className="ticker-wrap py-3 relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, #050510, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(270deg, #050510, transparent)' }} />
            <div className="ticker">
              {TECH.map((t, i) => (
                <div
                  key={`${t}-${i}`}
                  className="flex-shrink-0 mx-3 px-4 py-2 rounded-lg text-xs text-white/40 font-medium whitespace-nowrap"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Links grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-10 mb-14"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 bg-[#7C4DFF] rotate-45 rounded-sm" />
                <div className="absolute inset-[3px] bg-[#050510] rotate-45 rounded-sm" />
                <div className="absolute inset-[5px] bg-[#7C4DFF] rotate-45 rounded-sm opacity-80" />
              </div>
              <span className="font-bold text-base">Dev<span className="text-[#7C4DFF]">Portal</span></span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed mb-4">
              Self-service PaaS for developers. Deploy to Kubernetes in seconds.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3]" style={{ boxShadow: '0 0 6px #00FFA3' }} />
              <span className="text-[10px] text-[#00FFA3] font-mono">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">{heading}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/35 hover:text-white transition-colors duration-200">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="text-xs text-white/25">
            © 2025 DevPortal. Built with GitOps.
          </span>
          <div className="flex items-center gap-1 text-xs text-white/20">
            <span>Made with</span>
            <span className="text-[#7C4DFF]">♦</span>
            <span>for developers</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
