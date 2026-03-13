/**
 * ResultsScreen.jsx
 * Displays the 3 AI-generated destination recommendations.
 * Shows the user's travel personality as a passport-stamp style badge,
 * then 3 destination cards with staggered reveal.
 * Below results is the upsell section (scrolled to automatically when user clicks a card CTA).
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import DestinationCard from './DestinationCard.jsx';

const BRAND_COLORS = ['#D4AF37', '#8B6347', '#F5F0E8', '#C4956A', '#4A3728'];

/**
 * ResultsScreen component
 * @param {Object}   results   - The parsed Claude API response with destinations + personality
 * @param {string}   email     - The user's email address (shown as confirmation)
 * @param {function} onRetake  - Called when user clicks "Retake the quiz"
 */
export default function ResultsScreen({ results, email, onRetake }) {
  const [copied, setCopied] = useState(false);

  // Fire confetti once on mount
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: BRAND_COLORS,
    });
  }, []);

  async function handleShare() {
    const topDestination = results.destinations?.find(d => d.rank === 1)?.destination ?? 'an amazing destination';
    const shareText = `I just discovered I'm a "${results.travelPersonality}" traveler! My top destination is ${topDestination}. Find yours → thenextstamptravelco.com/ai-travel-quiz/`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User dismissed share sheet — do nothing
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!results || !results.destinations) {
    return (
      <div className="min-h-screen bg-light-linen flex items-center justify-center">
        <p className="font-lato text-medium-brown">No results available.</p>
      </div>
    );
  }

  return (
    <div className="bg-light-linen min-h-screen" aria-label="Your destination recommendations">
      {/* ── Results Header ── */}
      <div className="bg-warm-sand py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-lato text-xs text-caramel uppercase tracking-widest mb-4"
          >
            Your Personalized Results
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-playfair text-dark-brown font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 42px)' }}
          >
            Your Next 3 Stamps
          </motion.h1>

          {/* Passport-stamp style personality badge */}
          {results.travelPersonality && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-5"
            >
              <div
                className="relative inline-flex items-center justify-center w-36 h-36"
                aria-label={`Your travel personality: ${results.travelPersonality}`}
              >
                {/* Outer dashed ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-dark-brown opacity-60" />
                {/* Inner solid ring */}
                <div className="absolute inset-[10px] rounded-full border border-dark-brown opacity-30" />
                {/* Stamp content */}
                <div className="relative text-center px-3">
                  <p className="font-lato text-caramel text-[10px] uppercase tracking-widest mb-1">
                    The Next Stamp
                  </p>
                  <p className="font-playfair text-dark-brown font-bold text-sm leading-tight uppercase tracking-wide">
                    {results.travelPersonality}
                  </p>
                  <p className="font-lato text-caramel text-[9px] uppercase tracking-widest mt-1 opacity-70">
                    ✦ ✦ ✦
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Personality description */}
          {results.personalityDescription && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="font-lato text-medium-brown text-base italic mb-4 max-w-lg mx-auto"
            >
              {results.personalityDescription}
            </motion.p>
          )}

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex justify-center mb-4"
          >
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-dark-brown text-cream font-lato font-bold text-sm px-5 py-2.5 rounded-full hover:bg-medium-brown transition-colors duration-200 focus-visible:outline-caramel"
              aria-label="Share your results"
            >
              <Share2 size={15} />
              {copied ? '✓ Copied to clipboard!' : 'Share My Results'}
            </button>
          </motion.div>

          {/* Email confirmation */}
          {email && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-lato text-sm text-medium-brown mb-4"
            >
              ✅ Results sent to <span className="font-semibold text-dark-brown">{email}</span>
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-lato text-medium-brown text-base max-w-xl mx-auto"
          >
            Based on your travel personality, our AI has handpicked these destinations just for you.
          </motion.p>
        </div>
      </div>

      {/* ── Destination Cards ── */}
      <div className="max-w-3xl mx-auto px-4 py-12 grid grid-cols-1 gap-8">
        {results.destinations
          .sort((a, b) => a.rank - b.rank)
          .map((destination, index) => (
            <DestinationCard
              key={destination.rank}
              destination={destination}
              index={index}
            />
          ))}
      </div>

      {/* ── Retake link ── */}
      <div className="text-center pb-8">
        <button
          onClick={onRetake}
          className="font-lato text-medium-brown text-sm underline opacity-60 hover:opacity-100 transition-opacity duration-200 focus-visible:outline-caramel"
          aria-label="Retake the quiz"
        >
          Not quite right? Retake the quiz →
        </button>
      </div>
    </div>
  );
}
