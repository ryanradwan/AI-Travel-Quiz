/**
 * EmailCapture.jsx
 * Shown after the user completes all 12 quiz questions, before results are revealed.
 * Collects their email address, subscribes them to Mailchimp, then triggers the
 * Claude API call and loading screen.
 *
 * Features:
 * - Social proof above the form ("Join 5,000+ travelers")
 * - Real-time inline email validation with green ✓ indicator
 * - Updated CTA: "Unlock My 3 Destinations →"
 * - Delivery expectation copy
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Sparkles, Compass, CheckCircle } from 'lucide-react';

/**
 * EmailCapture component
 * @param {function} onSubmit - Called with the email string when user submits
 */
export default function EmailCapture({ onSubmit }) {
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // Basic email validation
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  // Real-time validation state (only show check after user has typed enough)
  const showValidCheck = email.length > 5 && isValidEmail(email);

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    console.log('[EmailCapture] Submitting email:', email);

    try {
      // Subscribe to Mailchimp via secure backend
      const API_BASE = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Subscription failed');
      }

      console.log('[EmailCapture] Mailchimp subscription result:', data);
      // Pass email up to App — triggers loading + Claude API call
      onSubmit(email);

    } catch (err) {
      console.error('[EmailCapture] Error:', err.message);
      // Don't block the user if Mailchimp fails — still let them see results
      console.warn('[EmailCapture] Mailchimp error — proceeding anyway');
      onSubmit(email);
    }
  }

  return (
    <div className="min-h-screen bg-cream linen-texture flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-warm-sand flex items-center justify-center">
            <Compass size={32} className="text-caramel" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h2
          className="font-playfair text-dark-brown font-bold text-center leading-tight mb-4"
          style={{ fontSize: 'clamp(26px, 4vw, 36px)' }}
        >
          Your results are ready
        </h2>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm" aria-hidden="true">⭐⭐⭐⭐⭐</span>
          <p className="font-lato text-medium-brown text-sm opacity-80">
            Join 5,000+ travelers who've found their next stamp
          </p>
        </div>

        {/* Subheading */}
        <p className="font-lato text-medium-brown text-base text-center leading-relaxed mb-8 max-w-md mx-auto">
          Enter your email to unlock your 3 personalised destinations.
        </p>

        {/* What you'll get */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
          <p className="font-lato text-xs text-caramel uppercase tracking-widest mb-4">What you'll receive</p>
          <div className="flex flex-col gap-3">
            {[
              { icon: <MapPin size={15} />,    text: 'Your Top Pick destination' },
              { icon: <MapPin size={15} />,    text: 'Runner Up destination' },
              { icon: <Sparkles size={15} />,  text: 'Hidden Gem recommendation' },
              { icon: <Mail size={15} />,      text: 'We\'ll also email your results to keep forever' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 font-lato text-sm text-medium-brown">
                <span className="text-caramel flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email-input" className="font-lato text-xs text-caramel uppercase tracking-widest block mb-2">
              Your email address
            </label>
            <div className="relative">
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className="w-full bg-warm-sand text-dark-brown font-lato text-base px-5 py-4 rounded-xl border border-transparent focus:border-caramel focus:outline-none placeholder-medium-brown placeholder-opacity-50 transition-colors duration-200 pr-12"
                aria-describedby={error ? 'email-error' : undefined}
                disabled={loading}
                autoComplete="email"
              />
              {/* Inline validation check */}
              {showValidCheck && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                  aria-label="Valid email address"
                >
                  <CheckCircle size={20} />
                </motion.span>
              )}
            </div>
            {error && (
              <p id="email-error" className="font-lato text-red-500 text-sm mt-2" role="alert">
                {error}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-brown text-white font-lato font-bold py-4 rounded-full text-base hover:bg-medium-brown transition-colors duration-200 focus-visible:outline-caramel disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            aria-label="Unlock my 3 destinations"
          >
            {loading ? 'One moment...' : 'Unlock My 3 Destinations →'}
          </motion.button>
        </form>

        {/* Privacy note */}
        <p className="font-lato text-medium-brown text-xs text-center mt-4 opacity-60">
          No spam, ever. Unsubscribe anytime.
        </p>
      </motion.div>
    </div>
  );
}
