/**
 * UpsellCard.jsx
 * A single product offer card in the upsell section.
 * Used for both Product 1 (Destination Report) and Product 2 (Report + AI Bundle).
 *
 * Features: savings badge, star rating, testimonial, and optional Best Value gold glow.
 */

import { motion } from 'framer-motion';

/**
 * UpsellCard component
 * @param {string}   badge           - Badge text e.g. "MOST POPULAR"
 * @param {string}   badgeColor      - Tailwind classes for badge color
 * @param {string}   bgColor         - Tailwind bg class for the card
 * @param {string}   icon            - Emoji icon for the product
 * @param {string}   title           - Product title
 * @param {string}   subtitle        - Subtitle (dynamic destination name)
 * @param {string}   description     - Product description paragraph
 * @param {Array}    included        - List of included items (strings)
 * @param {string}   savingsBadge    - Savings label e.g. "45% OFF"
 * @param {string}   reviewText      - Star rating + review count
 * @param {string}   testimonial     - Short customer testimonial quote
 * @param {string}   price           - Current price e.g. "$19"
 * @param {string}   originalPrice   - Original/crossed-out price e.g. "$35"
 * @param {string}   ctaText         - Button label
 * @param {string}   ctaBg           - Tailwind bg class for CTA button
 * @param {string}   ctaTextColor    - Tailwind text color class for CTA button
 * @param {string}   checkColor      - Tailwind text color for check marks
 * @param {number}   delay           - Animation delay (seconds)
 * @param {boolean}  isBestValue     - Applies gold glow border and extra padding
 */
export default function UpsellCard({
  badge,
  badgeColor,
  bgColor,
  icon,
  title,
  subtitle,
  description,
  included,
  savingsBadge,
  reviewText,
  testimonial,
  price,
  originalPrice,
  ctaText,
  ctaBg,
  ctaTextColor,
  checkColor,
  delay = 0,
  isBestValue = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={`${bgColor} rounded-2xl flex flex-col ${isBestValue ? 'p-7 md:p-9' : 'p-6 md:p-8'}`}
      style={isBestValue ? {
        boxShadow: '0 0 28px rgba(212, 175, 55, 0.35), 0 4px 24px rgba(0,0,0,0.15)',
      } : {}}
      aria-label={`Product: ${title}`}
    >
      {/* Badge row: product badge + savings badge */}
      <div className="flex items-center justify-between mb-5">
        <span
          className={`${badgeColor} font-lato text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full`}
        >
          {badge}
        </span>
        {savingsBadge && (
          <span className="font-lato text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-green-500 text-white">
            {savingsBadge}
          </span>
        )}
      </div>

      {/* Star rating */}
      {reviewText && (
        <p className="font-lato text-cream text-xs mb-4 opacity-80">{reviewText}</p>
      )}

      {/* Icon + Title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl mt-0.5" aria-hidden="true">{icon}</span>
        <h3
          className="font-playfair text-white font-bold leading-tight"
          style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
        >
          {title}
        </h3>
      </div>

      {/* Dynamic subtitle */}
      {subtitle && (
        <p className="font-lato text-cream text-sm italic mb-4 opacity-80">{subtitle}</p>
      )}

      {/* Description */}
      <p className="font-lato text-cream text-sm leading-relaxed mb-6 opacity-90">
        {description}
      </p>

      {/* What's included list */}
      <ul className="flex flex-col gap-2 mb-6" aria-label="What's included">
        {included.map((item, i) => (
          <li key={i} className="flex items-start gap-2 font-lato text-sm text-cream">
            <span className={`${checkColor} font-bold flex-shrink-0 mt-0.5`} aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Testimonial */}
      {testimonial && (
        <p className="font-lato text-cream text-xs italic leading-relaxed mb-6 opacity-75 border-l-2 border-white border-opacity-30 pl-3">
          {testimonial}
        </p>
      )}

      {/* Pricing */}
      <div className="flex items-baseline gap-3 mb-6 mt-auto">
        <span className="font-lato text-white font-bold text-3xl">{price}</span>
        <span className="font-lato text-caramel text-base line-through opacity-70">
          {originalPrice}
        </span>
      </div>

      {/* CTA Button */}
      <button
        className={`
          w-full ${ctaBg} ${ctaTextColor}
          font-lato font-bold py-4 rounded-full text-base
          hover:opacity-90 transition-opacity duration-200
          focus-visible:outline-caramel min-h-[44px]
        `}
        aria-label={ctaText}
      >
        {ctaText}
      </button>
    </motion.div>
  );
}
