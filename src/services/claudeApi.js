/**
 * claudeApi.js
 * Calls the secure backend endpoint to get destination recommendations.
 * The actual Claude API call happens server-side — the API key is never exposed to the browser.
 */

/**
 * Fetches 3 personalized destination recommendations from the server.
 *
 * @param {Object} answers - The user's quiz answers { questionId: optionId }
 * @returns {Promise<Object>} - Parsed JSON with travelPersonality + 3 destinations
 */
export async function getDestinationRecommendations(answers) {
  console.log('[claudeApi] Requesting recommendations from server...');

  const API_BASE = import.meta.env.VITE_API_URL ?? '';

  const res = await fetch(`${API_BASE}/api/recommendations`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ answers }),
  });

  if (!res.ok) {
    let errorMessage = 'Server error — please try again.';
    try {
      const data = await res.json();
      errorMessage = data.error ?? errorMessage;
    } catch {
      // Response was HTML (server crashed or not running)
      errorMessage = 'Could not connect to the server. Make sure it is running.';
    }
    throw new Error(errorMessage);
  }

  const data = await res.json();
  console.log('[claudeApi] Recommendations received:', data);
  return data;
}
