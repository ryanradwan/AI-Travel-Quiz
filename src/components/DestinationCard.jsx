/**
 * DestinationCard.jsx
 * A single destination recommendation card shown on the results screen.
 * Features:
 * - Colored top-border strip by rank (gold / silver / bronze)
 * - Match Score badge in the top-right corner
 * - "Why This Match" in a highlighted callout box
 * - Top Activities styled as rounded tags
 */

import { motion } from 'framer-motion';
import { Calendar, Wallet } from 'lucide-react';

// Medal labels, emojis, rank top-border colors, and match scores
const rankConfig = {
  1: {
    emoji:       '🥇',
    label:       'Top Pick',
    featured:    true,
    borderColor: '#D4AF37',  // gold
    matchScore:  '98% Match',
  },
  2: {
    emoji:       '🥈',
    label:       'Runner Up',
    featured:    false,
    borderColor: '#9CA3AF',  // silver
    matchScore:  '94% Match',
  },
  3: {
    emoji:       '🥉',
    label:       'Hidden Gem Pick',
    featured:    false,
    borderColor: '#CD7F32',  // bronze
    matchScore:  '89% Match',
  },
};

/**
 * DestinationCard component
 * @param {Object}   destination - The destination data object from Claude API
 * @param {number}   index       - Card index for staggered animation delay
 * @param {function} onGetReport - Callback when user clicks the CTA button
 */
export default function DestinationCard({ destination, index }) {
  const rank = rankConfig[destination.rank] ?? rankConfig[2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
      className={`
        bg-white rounded-[20px] shadow-card overflow-hidden
        ${rank.featured ? 'ring-2 ring-warm-sand shadow-card-lg' : ''}
      `}
      style={{ borderTop: `4px solid ${rank.borderColor}` }}
      aria-label={`Destination recommendation ${destination.rank}: ${destination.destination}`}
    >
      {/* ── Card Header ── */}
      <div className="p-6 md:p-8 pb-0">
        {/* Rank badge + Match Score */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`
              inline-flex items-center gap-1 px-3 py-1 rounded-full font-lato text-xs font-bold uppercase tracking-wide
              ${rank.featured
                ? 'bg-warm-sand text-dark-brown'
                : 'bg-light-linen text-medium-brown'
              }
            `}
            aria-label={`Ranked: ${rank.label}`}
          >
            <span aria-hidden="true">{rank.emoji}</span>
            {rank.label}
          </span>

          {/* Match Score badge */}
          <span
            className="inline-block font-lato text-xs font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${rank.borderColor}22`,
              color: rank.borderColor,
              border: `1px solid ${rank.borderColor}44`,
            }}
            aria-label={rank.matchScore}
          >
            {rank.matchScore}
          </span>
        </div>

        {/* Destination name */}
        <h3
          className="font-playfair text-dark-brown font-bold leading-tight mb-1"
          style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}
        >
          {destination.destination}
        </h3>

        {/* Country with flag emoji */}
        <p className="font-lato text-caramel text-sm mb-4 flex items-center gap-1">
          <span aria-hidden="true">{destination.countryEmoji}</span>
          <span>{destination.country}</span>
        </p>

        {/* "Best For" pill badge */}
        <span
          className="inline-block bg-warm-sand text-medium-brown font-lato text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
          aria-label={`Best for: ${destination.bestFor}`}
        >
          Best for: {destination.bestFor}
        </span>

        {/* "Why This Match" — highlighted callout box */}
        <div
          className="bg-light-linen rounded-xl p-4 mb-6 border-l-4"
          style={{ borderLeftColor: '#a1775c' }}
          aria-label="Why this destination matches you"
        >
          <p className="font-lato text-xs text-caramel uppercase tracking-widest mb-2">
            Why This Match
          </p>
          <p className="font-lato text-medium-brown text-sm leading-relaxed">
            {destination.whyThisMatch}
          </p>
        </div>
      </div>

      {/* ── Highlights tags ── */}
      <div className="px-6 md:px-8 pb-5">
        <div className="flex flex-wrap gap-2" aria-label="Destination highlights">
          {destination.highlights?.map((highlight, i) => (
            <span
              key={i}
              className="bg-light-linen text-medium-brown font-lato text-xs px-3 py-1.5 rounded-full"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>

      {/* ── Best Time + Budget ── */}
      <div className="px-6 md:px-8 pb-5 grid grid-cols-2 gap-4">
        {/* Best Time to Visit */}
        <div className="flex items-start gap-2">
          <Calendar size={15} className="text-caramel mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-lato text-xs text-caramel uppercase tracking-wide mb-0.5">
              Best Time
            </p>
            <p className="font-lato text-dark-brown text-sm font-semibold">
              {destination.bestTimeToVisit}
            </p>
          </div>
        </div>

        {/* Estimated Daily Budget */}
        <div className="flex items-start gap-2">
          <Wallet size={15} className="text-caramel mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="font-lato text-xs text-caramel uppercase tracking-wide mb-0.5">
              Daily Budget
            </p>
            <p className="font-lato text-dark-brown text-sm font-semibold">
              {destination.estimatedDailyBudget}
            </p>
          </div>
        </div>
      </div>

      {/* ── Top Activities — rounded tags ── */}
      {destination.topActivities && destination.topActivities.length > 0 && (
        <div className="px-6 md:px-8 pb-5">
          <p className="font-lato text-xs text-caramel uppercase tracking-wide mb-3">
            Top Activities
          </p>
          <div className="flex flex-wrap gap-2">
            {destination.topActivities.map((activity, i) => (
              <span
                key={i}
                className="bg-dark-brown text-cream font-lato text-xs px-3 py-1.5 rounded-full"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Affiliate Links ── */}
      {/* TODO: Replace placeholder IDs with your real affiliate IDs when approved */}
      <div className="px-6 md:px-8 pb-5">
        <div className="border-t border-warm-sand pt-5">
          <p className="font-lato text-xs text-caramel uppercase tracking-wide mb-3">
            Ready to book {destination.destination}?
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://www.booking.com/search.html?ss=${encodeURIComponent(destination.destination)}&aid=YOUR_BOOKING_ID`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-light-linen hover:bg-warm-sand text-dark-brown font-lato text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200"
              aria-label={`Browse hotels in ${destination.destination} on Booking.com`}
            >
              <span>🏨 Browse hotels in {destination.destination}</span>
              <span className="text-caramel text-xs">→</span>
            </a>
            <a
              href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(destination.destination)}&partner_id=66EZOEX`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-light-linen hover:bg-warm-sand text-dark-brown font-lato text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200"
              aria-label={`Top experiences in ${destination.destination} on GetYourGuide`}
            >
              <span>🎟️ Top experiences in {destination.destination}</span>
              <span className="text-caramel text-xs">→</span>
            </a>
            <a
              href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination.destination)}&pid=P00122757&mcid=42383&medium=link`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-light-linen hover:bg-warm-sand text-dark-brown font-lato text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200"
              aria-label={`Find trips in ${destination.destination} on Viator`}
            >
              <span>🎭 Find trips in {destination.destination}</span>
              <span className="text-caramel text-xs">→</span>
            </a>
            <a
              href="https://safetywing.com/?referenceID=26491680&utm_source=26491680&utm_medium=Ambassador"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-light-linen hover:bg-warm-sand text-dark-brown font-lato text-sm font-semibold px-4 py-3 rounded-xl transition-colors duration-200"
              aria-label="Get travel insurance with SafetyWing"
            >
              <span>🛡️ Get travel insurance</span>
              <span className="text-caramel text-xs">→</span>
            </a>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
