/**
 * LoadingScreen.jsx
 * Shown while the Claude API is processing the quiz answers.
 * Features a rotating compass icon and personalised rotating status messages
 * based on the user's quiz answers (travel vibe, group type, budget).
 * Displays for a minimum of 3 seconds even if the API responds faster.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';

/**
 * Builds a personalised set of loading messages from the user's quiz answers.
 * Falls back to generic messages if answers aren't available.
 *
 * @param {Object} answers - { questionId: optionId } from the quiz
 * @returns {string[]} - Array of 4 messages to cycle through
 */
function getPersonalisedMessages(answers) {
  const vibe   = answers?.[1];
  const budget = answers?.[3];
  const group  = answers?.[5];

  const vibeMsg = {
    '1a': 'Searching for sun-soaked coastal paradises...',
    '1b': 'Exploring vibrant cities with world-class food scenes...',
    '1c': 'Scouting breathtaking natural landscapes and trails...',
    '1d': 'Uncovering ancient history and cultural wonders...',
  }[vibe] ?? 'Analyzing your travel personality...';

  const groupMsg = {
    '5a': 'Curating solo adventures for the independent traveler...',
    '5b': 'Finding romantic escapes perfect for two...',
    '5c': 'Discovering group-friendly destinations and nightlife...',
    '5d': 'Mapping family-friendly experiences for all ages...',
  }[group] ?? 'Matching your vibe to hidden gems...';

  const budgetMsg = {
    '3a': 'Finding incredible experiences under $75/day...',
    '3b': 'Balancing comfort and value across the globe...',
    '3c': 'Curating premium experiences worth every cent...',
    '3d': 'Selecting world-class luxury destinations...',
  }[budget] ?? 'Calculating the perfect value for your trip...';

  return [
    vibeMsg,
    groupMsg,
    budgetMsg,
    'Almost ready — your perfect stamps are coming...',
  ];
}

/**
 * LoadingScreen component
 * @param {Object} answers - The user's quiz answers (passed from App)
 */
export default function LoadingScreen({ answers }) {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = getPersonalisedMessages(answers);

  // Cycle through personalised messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className="min-h-screen bg-cream flex flex-col items-center justify-center px-4"
      aria-live="polite"
      aria-label="Loading your personalized destination recommendations"
    >
      {/* Rotating compass icon */}
      <div className="mb-8" aria-hidden="true">
        <Compass
          size={64}
          className="text-caramel animate-spin-slow"
          strokeWidth={1.5}
        />
      </div>

      {/* Main heading */}
      <h2
        className="font-playfair text-dark-brown font-semibold text-center mb-6"
        style={{ fontSize: 'clamp(24px, 4vw, 32px)' }}
      >
        Finding your perfect destinations...
      </h2>

      {/* Rotating personalised status messages with fade in/out */}
      <div className="h-8 flex items-center justify-center" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
            className="font-lato text-caramel text-base italic text-center"
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Sub-label */}
      <p className="font-lato text-medium-brown text-sm mt-6 opacity-60">
        Your AI-powered results are being crafted
      </p>

      {/* Subtle animated dots indicator */}
      <div className="flex gap-2 mt-8" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-caramel"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
