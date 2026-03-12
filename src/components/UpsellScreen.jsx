/**
 * UpsellScreen.jsx
 * The upsell/monetization section that appears below the results.
 * Offers two products: a Destination Report and a Report + AI Itinerary Bundle.
 * Dynamically inserts the user's #1 destination name into product titles and CTAs.
 *
 * Features: scarcity urgency line, savings badges, testimonials, star ratings,
 * Best Value card with gold glow.
 */

import { motion } from 'framer-motion';
import UpsellCard from './UpsellCard.jsx';

/**
 * UpsellScreen component
 * @param {Object} topDestination - The rank-1 destination object from Claude API
 */
export default function UpsellScreen({ topDestination }) {
  // Use the top destination name in the copy, or a fallback
  const destName = topDestination?.destination ?? 'Your Top Destination';

  return (
    <section
      className="bg-dark-brown py-16 md:py-20 px-4"
      aria-labelledby="upsell-heading"
    >
      {/* ── Section Header ── */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-lato text-caramel text-xs uppercase tracking-widest mb-4"
        >
          Take the Next Step
        </motion.p>

        <motion.h2
          id="upsell-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-playfair text-white font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(28px, 4vw, 36px)' }}
        >
          Turn Your Results Into a Real Trip
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-lato text-cream text-lg opacity-80 mb-4"
        >
          Everything you need to go from inspired to booked.
        </motion.p>

        {/* Urgency line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-lato text-caramel text-sm font-semibold"
        >
          ⏳ Limited time offer — price increases Friday
        </motion.p>
      </div>

      {/* ── Product Cards ── */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Product 1: Destination Report */}
        <UpsellCard
          badge="Most Popular"
          badgeColor="bg-caramel text-white"
          bgColor="bg-medium-brown"
          icon="📄"
          title="Full Destination Deep-Dive Report"
          subtitle={`For ${destName}`}
          description="A comprehensive 15–20 page PDF guide covering everything you need: best neighborhoods, where to stay, where to eat, what to do, local tips, visa info, packing list, and a 7-day sample itinerary."
          included={[
            'Neighborhood-by-neighborhood breakdown',
            'Curated restaurant & café guide',
            '7-day sample itinerary',
            'Visa & entry requirements',
            'Packing list by season',
            'Budget breakdown & money tips',
          ]}
          savingsBadge="45% OFF"
          reviewText="⭐⭐⭐⭐⭐ 427 reviews"
          testimonial='"This report saved me hours of research — absolutely worth it!" — Sarah M., London'
          price="$19"
          originalPrice="$35"
          ctaText={`Get My ${destName} Report →`}
          ctaBg="bg-cream"
          ctaTextColor="text-dark-brown"
          checkColor="text-caramel"
          delay={0}
          isBestValue={false}
        />

        {/* Product 2: Report + AI Itinerary Bundle */}
        <UpsellCard
          badge="Best Value"
          badgeColor="bg-dark-brown text-white"
          bgColor="bg-caramel"
          icon="✨"
          title="Report + Custom AI Itinerary Bundle"
          subtitle={`For ${destName}`}
          description={`Everything in the Destination Report PLUS a fully personalized, AI-generated day-by-day itinerary built specifically around your travel style, budget, group size, and timing from your quiz.`}
          included={[
            'Everything in the Destination Report',
            'Custom AI-generated day-by-day itinerary',
            'Personalized to YOUR quiz answers',
            'Restaurant reservations timing guide',
            'Transport between stops mapped out',
            'Morning / afternoon / evening structure',
          ]}
          savingsBadge="45% OFF"
          reviewText="⭐⭐⭐⭐⭐ 312 reviews"
          testimonial='"The custom itinerary was like having a personal travel agent. Incredible value." — James T., New York'
          price="$39"
          originalPrice="$65"
          ctaText="Get the Full Bundle →"
          ctaBg="bg-dark-brown"
          ctaTextColor="text-white"
          checkColor="text-dark-brown"
          delay={0.15}
          isBestValue={true}
        />
      </div>

      {/* ── Trust signals + Decline link ── */}
      <div className="max-w-3xl mx-auto text-center mt-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-lato text-cream text-sm opacity-60 mb-3"
        >
          🔒 Secure checkout · Instant digital delivery · 100% satisfaction guarantee
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="font-lato text-cream text-sm underline opacity-40 hover:opacity-70 transition-opacity duration-200 focus-visible:outline-caramel"
          aria-label="Decline and use free results only"
        >
          No thanks, I'll just use my free results for now
        </motion.button>
      </div>
    </section>
  );
}
