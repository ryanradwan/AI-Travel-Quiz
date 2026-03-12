/**
 * App.jsx
 * Root component. Manages the 6-screen application flow:
 *   1. Landing Page
 *   2. Quiz Screen (12 questions)
 *   3. Email Capture (gate before results)
 *   4. Loading Screen (Claude API processing)
 *   5. Results Screen + Upsell
 *   6. Error Screen
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage    from './components/LandingPage.jsx';
import QuizScreen     from './components/QuizScreen.jsx';
import EmailCapture   from './components/EmailCapture.jsx';
import LoadingScreen  from './components/LoadingScreen.jsx';
import ResultsScreen  from './components/ResultsScreen.jsx';
import { getDestinationRecommendations } from './services/claudeApi.js';

const SCREENS = {
  LANDING:  'landing',
  QUIZ:     'quiz',
  EMAIL:    'email',
  LOADING:  'loading',
  RESULTS:  'results',
  ERROR:    'error',
};

const STORAGE_KEY = 'next_stamp_quiz_progress';

const pageTransition = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.4 } },
  exit:     { opacity: 0, transition: { duration: 0.3 } },
};

export default function App() {
  const [screen,         setScreen]         = useState(SCREENS.LANDING);
  const [answers,        setAnswers]         = useState({});
  const [email,          setEmail]           = useState('');
  const [results,        setResults]         = useState(null);
  const [errorMsg,       setErrorMsg]        = useState('');
  const [savedProgress,  setSavedProgress]   = useState(null);
  const [showResume,     setShowResume]      = useState(false);

  // On mount: check for saved quiz progress in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.answers && typeof parsed.currentIndex === 'number') {
          setSavedProgress(parsed);
          setShowResume(true);
        }
      }
    } catch (e) {
      // Ignore corrupt storage
    }
  }, []);

  function handleResumeYes() {
    setShowResume(false);
    setScreen(SCREENS.QUIZ);
  }

  function handleResumeNo() {
    localStorage.removeItem(STORAGE_KEY);
    setSavedProgress(null);
    setShowResume(false);
  }

  // Step 1: Start quiz (fresh start)
  function handleStartQuiz() {
    console.log('[App] Starting quiz...');
    setSavedProgress(null);
    setScreen(SCREENS.QUIZ);
  }

  // Step 2: Quiz complete — store answers, show email gate
  function handleQuizComplete(quizAnswers) {
    console.log('[App] Quiz complete. Moving to email capture.');
    setAnswers(quizAnswers);
    setScreen(SCREENS.EMAIL);
  }

  // Step 3: Email submitted — show loading, run Claude API, send email in background
  async function handleEmailSubmit(userEmail) {
    console.log('[App] Email captured:', userEmail);
    setEmail(userEmail);
    setScreen(SCREENS.LOADING);

    // Clear saved quiz progress now that we're past the quiz
    localStorage.removeItem(STORAGE_KEY);

    const minDisplayTime = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const [apiResult] = await Promise.all([
        getDestinationRecommendations(answers),
        minDisplayTime,
      ]);

      console.log('[App] Results received:', apiResult);
      setResults(apiResult);
      setScreen(SCREENS.RESULTS);

      // Send results email in the background — don't block the UI
      sendResultsEmail(userEmail, apiResult);

    } catch (error) {
      console.error('[App] API call failed:', error);
      await minDisplayTime;
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
      setScreen(SCREENS.ERROR);
    }
  }

  // Background: email the results to the user via Resend
  async function sendResultsEmail(userEmail, apiResults) {
    try {
      console.log('[App] Sending results email to:', userEmail);
      const API_BASE = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${API_BASE}/api/send-results`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: userEmail, results: apiResults }),
      });
      const data = await res.json();
      console.log('[App] Results email status:', data);
    } catch (err) {
      // Email failure is non-critical — results are already on screen
      console.error('[App] Failed to send results email:', err.message);
    }
  }

  // Retake quiz — reset state and go back to quiz
  function handleRetake() {
    setResults(null);
    setAnswers({});
    setEmail('');
    setSavedProgress(null);
    setScreen(SCREENS.QUIZ);
  }

  // Try again — go back to email capture (answers are preserved)
  function handleTryAgain() {
    setResults(null);
    setErrorMsg('');
    setScreen(SCREENS.EMAIL);
  }

  return (
    <div className="font-lato">
      {/* ── Resume prompt overlay ── */}
      <AnimatePresence>
        {showResume && screen === SCREENS.LANDING && (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-x-4 top-4 z-50 max-w-md mx-auto bg-white rounded-2xl shadow-xl p-5 border border-warm-sand"
          >
            <p className="font-lato text-dark-brown font-semibold text-sm mb-1">
              Welcome back! 👋
            </p>
            <p className="font-lato text-medium-brown text-sm mb-4">
              You have a quiz in progress. Continue where you left off?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResumeYes}
                className="flex-1 bg-dark-brown text-white font-lato font-bold text-sm py-2.5 rounded-full hover:bg-medium-brown transition-colors duration-200"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleResumeNo}
                className="flex-1 border border-warm-sand text-medium-brown font-lato text-sm py-2.5 rounded-full hover:border-caramel transition-colors duration-200"
              >
                Start Fresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {screen === SCREENS.LANDING && (
          <motion.div key="landing" {...pageTransition}>
            <LandingPage onStart={handleStartQuiz} />
          </motion.div>
        )}

        {screen === SCREENS.QUIZ && (
          <motion.div key="quiz" {...pageTransition}>
            <QuizScreen
              onComplete={handleQuizComplete}
              savedProgress={savedProgress}
            />
          </motion.div>
        )}

        {screen === SCREENS.EMAIL && (
          <motion.div key="email" {...pageTransition}>
            <EmailCapture onSubmit={handleEmailSubmit} />
          </motion.div>
        )}

        {screen === SCREENS.LOADING && (
          <motion.div key="loading" {...pageTransition}>
            <LoadingScreen answers={answers} />
          </motion.div>
        )}

        {screen === SCREENS.RESULTS && (
          <motion.div key="results" {...pageTransition}>
            <ResultsScreen results={results} email={email} onRetake={handleRetake} />
          </motion.div>
        )}

        {screen === SCREENS.ERROR && (
          <motion.div key="error" {...pageTransition}>
            <ErrorScreen message={errorMsg} onTryAgain={handleTryAgain} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function ErrorScreen({ message, onTryAgain }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl mb-6" aria-hidden="true">🗺️</p>
      <h2 className="font-playfair text-dark-brown font-bold text-2xl mb-4">
        Something went wrong
      </h2>
      <p className="font-lato text-medium-brown text-base max-w-md mb-2 leading-relaxed">
        We couldn't generate your destinations right now. This is usually a temporary issue.
      </p>
      {message && (
        <p className="font-lato text-caramel text-sm max-w-md mb-8 opacity-70">{message}</p>
      )}
      <button
        onClick={onTryAgain}
        className="font-lato font-bold bg-dark-brown text-white px-8 py-3.5 rounded-full hover:bg-medium-brown transition-colors duration-200 focus-visible:outline-caramel"
      >
        Try Again
      </button>
    </div>
  );
}
