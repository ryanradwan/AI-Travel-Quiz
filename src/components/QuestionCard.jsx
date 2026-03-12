/**
 * QuestionCard.jsx
 * Displays a single quiz question with its answer options.
 * Wrapped in Framer Motion for slide-in/slide-out transitions.
 * Auto-advances to the next question 400ms after an answer is selected.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnswerOption from './AnswerOption.jsx';

// Slide-in animation: new question comes from right, exits to left
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

/**
 * QuestionCard component
 * @param {Object}   question          - The question object { id, category, question, options }
 * @param {string}   selectedAnswer    - The currently selected option ID (or null)
 * @param {function} onAnswer          - Callback: onAnswer(questionId, optionId)
 * @param {number}   direction         - Slide direction: 1 = forward, -1 = backward
 */
export default function QuestionCard({ question, selectedAnswer, onAnswer, direction }) {
  // Track local selection for instant visual feedback before the auto-advance fires
  const [localSelected, setLocalSelected] = useState(selectedAnswer);

  // Sync local selection when question changes (e.g. going back)
  useEffect(() => {
    setLocalSelected(selectedAnswer);
  }, [question.id, selectedAnswer]);

  /**
   * Handles clicking an answer option.
   * Sets local state for visual feedback — user must click Next to advance.
   */
  function handleSelect(optionId) {
    setLocalSelected(optionId);
    console.log(`[QuestionCard] Q${question.id}: selected "${optionId}"`);
  }

  function handleNext() {
    if (!localSelected) return;
    onAnswer(question.id, localSelected);
  }

  // Decorative question number — padded to 2 digits, e.g. "03"
  const questionNumber = String(question.id).padStart(2, '0');

  return (
    <motion.div
      key={question.id}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
    >
      {/* Question Card — white, rounded, shadowed */}
      <div
        className="bg-white rounded-2xl shadow-card p-8 md:p-12 w-full max-w-[680px] mx-auto"
        role="group"
        aria-labelledby={`question-${question.id}`}
      >
        {/* Decorative question number */}
        <p
          className="font-playfair text-5xl text-warm-sand font-bold leading-none mb-4 select-none"
          aria-hidden="true"
        >
          {questionNumber}
        </p>

        {/* Category label */}
        <p className="font-lato text-xs text-caramel uppercase tracking-widest mb-2">
          {question.category}
        </p>

        {/* Question text */}
        <h2
          id={`question-${question.id}`}
          className="font-playfair text-dark-brown font-semibold leading-snug mb-8"
          style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}
        >
          {question.question}
        </h2>

        {/* Answer options — 12px gap between each */}
        <div className="flex flex-col gap-3" role="list" aria-label="Answer options">
          {question.options.map((option) => (
            <div key={option.id} role="listitem">
              <AnswerOption
                option={option}
                isSelected={localSelected === option.id}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        {/* Next button — appears once an answer is selected */}
        {localSelected && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleNext}
            className="mt-6 w-full bg-dark-brown text-white font-lato font-bold py-4 rounded-full text-base hover:bg-medium-brown transition-colors duration-200 focus-visible:outline-caramel"
          >
            Next →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
