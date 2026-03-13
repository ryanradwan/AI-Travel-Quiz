/**
 * ResultsScreen.jsx
 * Displays the 3 AI-generated destination recommendations.
 * Shows the user's travel personality as a passport-stamp style badge,
 * then 3 destination cards with staggered reveal.
 * Below results is the upsell section (scrolled to automatically when user clicks a card CTA).
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Check } from 'lucide-react';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    try {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      // fallback: select and copy
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Fire confetti once on mount
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.4 },
      colors: BRAND_COLORS,
    });
  }, []);

  const topDestination = results?.destinations?.find(d => d.rank === 1)?.destination ?? 'an amazing destination';
  const shareText = `I just discovered I'm a "${results?.travelPersonality}" traveler! My top destination is ${topDestination}. Find yours → thenextstamptravelco.com/ai-travel-quiz/`;
  const shareUrl = `https://thenextstamptravelco.com/ai-travel-quiz/`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

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
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 bg-dark-brown text-cream font-lato font-bold text-sm px-5 py-2.5 rounded-full hover:bg-medium-brown transition-colors duration-200 focus-visible:outline-caramel"
              aria-label="Share your results"
            >
              <Share2 size={15} />
              Share My Results
            </button>
          </motion.div>

          {/* Share modal */}
          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setShowShareModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-playfair text-dark-brown font-bold text-lg">Share Your Results</h3>
                    <button onClick={() => setShowShareModal(false)} className="text-medium-brown hover:text-dark-brown">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => window.open(twitterUrl, '_blank', 'noopener,noreferrer')}
                      className="flex items-center gap-3 bg-[#1DA1F2] text-white font-lato font-bold px-4 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      𝕏 Share on X / Twitter
                    </button>
                    <button
                      onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                      className="flex items-center gap-3 bg-[#25D366] text-white font-lato font-bold px-4 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      💬 Share on WhatsApp
                    </button>
                    <button
                      onClick={() => window.open(facebookUrl, '_blank', 'noopener,noreferrer')}
                      className="flex items-center gap-3 bg-[#1877F2] text-white font-lato font-bold px-4 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      📘 Share on Facebook
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-3 bg-light-linen text-dark-brown font-lato font-bold px-4 py-3 rounded-xl hover:bg-warm-sand transition-colors border border-warm-sand"
                    >
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
