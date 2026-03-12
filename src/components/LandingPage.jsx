/**
 * LandingPage.jsx
 * The first screen users see. Features the brand headline, tagline, social proof,
 * and CTA button to start the quiz. Uses staggered Framer Motion animations on load.
 */

import { motion } from 'framer-motion';
import { Compass, MapPin, Sparkles } from 'lucide-react';

// Animation variants for the staggered reveal effect
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/**
 * LandingPage component
 * @param {function} onStart - Callback to move to the quiz screen
 */
export default function LandingPage({ onStart }) {
  return (
    <div
      className="min-h-screen bg-cream linen-texture flex flex-col items-center justify-center px-4 py-16"
      aria-label="The Next Stamp AI Travel Quiz landing page"
    >
      <motion.div
        className="flex flex-col items-center text-center max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small label — "AI-POWERED TRAVEL DISCOVERY" */}
        <motion.p
          variants={itemVariants}
          className="text-caramel text-xs font-lato font-bold uppercase tracking-widest mb-6"
          aria-label="AI-Powered Travel Discovery"
        >
          AI-Powered Travel Discovery
        </motion.p>

        {/* Main headline */}
        <motion.h1
          variants={itemVariants}
          className="font-playfair text-dark-brown font-bold leading-tight mb-6"
          style={{ fontSize: 'clamp(36px, 6vw, 56px)' }}
        >
          Discover Your Next Stamp
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="font-lato text-medium-brown text-lg md:text-xl leading-relaxed mb-8 max-w-[560px]"
        >
          Answer 12 questions and let AI uncover the destination you were always meant to visit next.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          variants={itemVariants}
          className="w-24 h-px bg-warm-sand mb-10"
          aria-hidden="true"
        />

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={onStart}
            className="font-lato font-bold text-white bg-dark-brown px-10 py-4 rounded-full text-lg cursor-pointer transition-colors duration-200 hover:bg-medium-brown focus-visible:outline-caramel"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Reveal My Perfect Destination"
          >
            Reveal My Perfect Destination →
          </motion.button>
        </motion.div>

        {/* Trust line below button */}
        <motion.p
          variants={itemVariants}
          className="font-lato text-medium-brown text-sm mt-4 opacity-70"
        >
          Takes 3 minutes · Free · No sign-up required to see results
        </motion.p>

        {/* Icon badges */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 mt-10"
          aria-label="Quiz highlights"
        >
          <div className="flex items-center gap-2 text-caramel font-lato text-sm">
            <Compass size={18} aria-hidden="true" />
            <span>12 Questions</span>
          </div>
          <div className="flex items-center gap-2 text-caramel font-lato text-sm">
            <MapPin size={18} aria-hidden="true" />
            <span>3 Destinations</span>
          </div>
          <div className="flex items-center gap-2 text-caramel font-lato text-sm">
            <Sparkles size={18} aria-hidden="true" />
            <span>AI Powered</span>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mt-6"
          aria-label="Trusted by 5,000 plus travelers worldwide"
        >
          <span className="text-sm" aria-hidden="true">⭐⭐⭐⭐⭐</span>
          <span className="font-lato text-medium-brown text-sm opacity-70">
            Trusted by 5,000+ travelers worldwide
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
