import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const NAV_LINKS = ['Features', 'How It Works', 'Pricing', 'Docs', 'Changelog'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 30));

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(5,5,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 bg-[#7C4DFF] rotate-45 rounded-sm" />
            <div className="absolute inset-[3px] bg-[#050510] rotate-45 rounded-sm" />
            <div className="absolute inset-[6px] bg-[#7C4DFF] rotate-45 rounded-sm opacity-80" />
          </div>
          <span className="text-xl font-bold tracking-tight select-none">
            Dev<span className="text-[#7C4DFF]">Portal</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="relative text-sm font-medium text-white/50 hover:text-white transition-colors duration-200 group"
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-[#7C4DFF] to-[#4CC9F0] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200">
            Sign In
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C4DFF, #5B2FD4)', boxShadow: '0 0 20px rgba(124,77,255,0.35)' }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
