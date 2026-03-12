/**
 * AnswerOption.jsx
 * A single clickable answer card in the quiz.
 * Shows hover state (caramel), selected state (dark brown + checkmark), and idle state (warm sand).
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * AnswerOption component
 * @param {Object}   option     - The option object { id, text, emoji }
 * @param {boolean}  isSelected - Whether this option is currently selected
 * @param {function} onSelect   - Callback fired when user clicks this option
 */
export default function AnswerOption({ option, isSelected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(option.id)}
      className={`
        w-full text-left px-6 py-[18px] rounded-xl font-lato text-base leading-snug
        flex items-center justify-between gap-3
        transition-colors duration-200 cursor-pointer
        min-h-[44px]
        focus-visible:outline-caramel
        ${isSelected
          ? 'bg-dark-brown text-white'
          : 'bg-warm-sand text-dark-brown hover:bg-caramel hover:text-white'
        }
      `}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isSelected}
      aria-label={`${option.emoji ? option.emoji + ' ' : ''}${option.text}`}
    >
      {/* Option text with optional emoji */}
      <span className="flex items-center gap-2">
        {option.emoji && (
          <span aria-hidden="true" className="text-lg leading-none">
            {option.emoji}
          </span>
        )}
        <span>{option.text}</span>
      </span>

      {/* Checkmark — only visible when selected */}
      {isSelected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
          className="flex-shrink-0"
        >
          <Check size={18} className="text-white" />
        </motion.span>
      )}
    </motion.button>
  );
}
