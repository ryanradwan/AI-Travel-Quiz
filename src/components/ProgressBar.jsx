/**
 * ProgressBar.jsx
 * Thin progress bar shown at the top of the quiz screen.
 * Fills from 0% to 100% as the user moves through all 12 questions.
 */

/**
 * ProgressBar component
 * @param {number} current - Current question number (1-based)
 * @param {number} total   - Total number of questions
 */
export default function ProgressBar({ current, total }) {
  // Calculate percentage complete
  const percent = ((current - 1) / total) * 100;

  return (
    <div className="w-full" aria-label={`Question ${current} of ${total}`}>
      {/* Label: right-aligned "Question X of Y" */}
      <p className="font-lato text-xs text-caramel text-right mb-1 px-4 md:px-0">
        Question {current} of {total}
      </p>

      {/* Progress track */}
      <div
        className="w-full h-1 bg-warm-sand"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {/* Filled portion — caramel color */}
        <div
          className="h-full bg-caramel progress-bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
