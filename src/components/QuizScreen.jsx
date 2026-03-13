/**
 * QuizScreen.jsx
 * The main quiz interface. Shows one question at a time with:
 * - Progress bar at top
 * - Back button to return to previous question
 * - Animated question card transitions (slide left/right)
 * - Stores all answers in state and calls parent when quiz is complete
 * - Saves progress to localStorage on each answer
 * - Shows encouragement toasts at Q6 and Q11
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ProgressBar from './ProgressBar.jsx';
import QuestionCard from './QuestionCard.jsx';
import { questions } from '../data/questions.js';

const STORAGE_KEY = 'next_stamp_quiz_progress';

/**
 * QuizScreen component
 * @param {function} onComplete     - Called with the answers object when all 12 questions answered
 * @param {Object}   savedProgress  - Optional saved progress { answers, currentIndex } from localStorage
 */
export default function QuizScreen({ onComplete, savedProgress }) {
  // Index of the current question (0-based) — restore from saved progress if available
  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex ?? 0);

  // All answers stored as { questionId: selectedOptionId } — restore from saved progress
  const [answers, setAnswers] = useState(savedProgress?.answers ?? {});

  // Slide direction: 1 = forward (right→left), -1 = backward (left→right)
  const [direction, setDirection] = useState(1);

  // Encouragement toast message (null when hidden)
  const [toast, setToast] = useState(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions  = questions.length;
  const isFirstQuestion = currentIndex === 0;

  /**
   * Called by QuestionCard when user selects an answer.
   * Saves the answer and advances to the next question (or completes the quiz).
   */
  function handleAnswer(questionId, optionId) {
    const updatedAnswers = { ...answers, [questionId]: optionId };
    setAnswers(updatedAnswers);
    console.log(`[QuizScreen] Q${questionId} answered: ${optionId}`);

    const nextIndex = currentIndex + 1;

    // Save progress to localStorage (before completing quiz)
    if (currentIndex < totalQuestions - 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          answers:      updatedAnswers,
          currentIndex: nextIndex,
        }));
      } catch (e) {}
    }

    // Show encouragement toast at Q8 (halfway) and Q14 (last question)
    if (currentIndex === 7) {
      setToast('Halfway there — your profile is taking shape ✨');
      setTimeout(() => setToast(null), 2000);
    } else if (currentIndex === 13) {
      setToast('Last question! Your results are almost ready');
      setTimeout(() => setToast(null), 2000);
    }

    // If this was the last question, complete the quiz
    if (currentIndex === totalQuestions - 1) {
      console.log('[QuizScreen] All questions answered. Submitting quiz...');
      onComplete(updatedAnswers);
    } else {
      // Advance to next question
      setDirection(1);
      setCurrentIndex(nextIndex);
    }
  }

  /**
   * Go back to the previous question.
   */
  function handleBack() {
    if (isFirstQuestion) return;
    console.log(`[QuizScreen] Going back from Q${currentIndex + 1} to Q${currentIndex}`);
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col" aria-label="Travel quiz">
      {/* ── Encouragement toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-dark-brown text-white font-lato text-sm px-5 py-3 rounded-full shadow-lg whitespace-nowrap"
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed header: progress bar + back button ── */}
      <div className="w-full bg-cream border-b border-warm-sand sticky top-0 z-10">
        {/* Back button row */}
        <div className="max-w-[680px] mx-auto px-4 pt-4 pb-1 flex items-center">
          {!isFirstQuestion ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-caramel font-lato text-sm hover:text-medium-brown transition-colors duration-200 focus-visible:outline-caramel min-h-[44px] px-1"
              aria-label="Go back to previous question"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back</span>
            </button>
          ) : (
            /* Placeholder to keep layout consistent when no back button */
            <div className="h-[44px]" aria-hidden="true" />
          )}
        </div>

        {/* Progress bar */}
        <div className="max-w-[680px] mx-auto px-4 pb-3">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* ── Question card area ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-hidden">
        <motion.div
          className="w-full max-w-[680px]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) {
              // Only advance if there's an answer for the current question
              if (answers[currentQuestion.id]) {
                setDirection(1);
                const nextIndex = currentIndex + 1;
                if (nextIndex < totalQuestions) setCurrentIndex(nextIndex);
              }
            } else if (info.offset.x > 50) {
              handleBack();
            }
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] ?? null}
              onAnswer={handleAnswer}
              direction={direction}
            />
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
