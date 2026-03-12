/**
 * server/index.js
 * Express backend for The Next Stamp Quiz.
 * Handles three secure API endpoints:
 *   POST /api/recommendations → calls Claude API and returns destination recommendations
 *   POST /api/subscribe       → adds email to Mailchimp audience
 *   POST /api/send-results    → emails the quiz results to the user via Resend
 *
 * API keys are loaded from .env and never exposed to the browser.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import { questions } from '../src/data/questions.js';

// Load .env from the project root (one level up from /server)
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// Use createRequire to import the CommonJS Mailchimp package
const require = createRequire(import.meta.url);
const mailchimp = require('@mailchimp/mailchimp_marketing');

// ── Setup ──────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Configure Mailchimp
mailchimp.setConfig({
  apiKey:  process.env.MAILCHIMP_API_KEY,
  server:  process.env.MAILCHIMP_SERVER_PREFIX,
});

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Configure Anthropic — key stays server-side, never sent to browser
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? process.env.VITE_ANTHROPIC_API_KEY,
});

console.log('[Server] Starting The Next Stamp backend...');
console.log('[Server] Mailchimp list ID:', process.env.MAILCHIMP_LIST_ID);
console.log('[Server] Email from:', process.env.EMAIL_FROM);
console.log('[Server] Anthropic key loaded:', !!(process.env.ANTHROPIC_API_KEY ?? process.env.VITE_ANTHROPIC_API_KEY));

// ── POST /api/recommendations ──────────────────────────────
// Calls Claude API server-side and returns destination recommendations
app.post('/api/recommendations', async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: 'Missing answers' });
  }

  console.log('[Claude] Generating recommendations...');

  // Map answer IDs back to readable question + answer text for the prompt
  const formattedAnswers = questions
    .map((q) => {
      const selectedOptionId = answers[q.id];
      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      if (!selectedOption) return null;
      const optionText = selectedOption.emoji
        ? `${selectedOption.emoji} ${selectedOption.text}`
        : selectedOption.text;
      return `${q.category} — "${q.question}"\nAnswer: ${optionText}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const systemPrompt = `You are a premium travel editor at The Next Stamp — think Condé Nast Traveler meets a personal concierge who knows every corner of the globe. You write directly to the reader in a warm, authoritative, and inspiring voice. You don't just recommend destinations — you paint a picture of why this place was made for them specifically.

Your job is to analyze a traveler's quiz responses and recommend 3 perfect destination matches.

When writing the "whyThisMatch" field, always reference the traveler's specific quiz choices by name — mention their budget level, travel pace, group type, preferred vibe, and climate preference. Make it feel like the recommendation was crafted personally for them, not generated for everyone.

You must respond ONLY with a valid JSON object — no preamble, no markdown, no explanation outside the JSON.`;

  const userPrompt = `Based on these quiz answers, recommend exactly 3 travel destinations.

Quiz Answers:
${formattedAnswers}

Respond with ONLY this exact JSON structure (no markdown, no code blocks, just raw JSON):
{
  "travelPersonality": "A 2-3 word label for their travel style (e.g. 'The Adventure Seeker', 'The Culture Lover')",
  "personalityDescription": "One sentence describing their travel personality in an inspiring, editorial tone",
  "destinations": [
    {
      "rank": 1,
      "rankLabel": "Top Pick",
      "destination": "A specific city name only — never a country (e.g. 'Kyoto', 'Lisbon', 'Medellín', 'Cape Town')",
      "country": "Country Name",
      "countryEmoji": "🇯🇵",
      "bestFor": "Short phrase (e.g. Culture & Food Lovers)",
      "whyThisMatch": "3-4 sentences explaining specifically why this destination matches their exact quiz answers. Reference their specific budget level, travel pace, group type, and vibe by name. Write in a warm, editorial second-person voice — 'you' not 'they'. Make it feel personal and exciting.",
      "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
      "bestTimeToVisit": "e.g. March to May",
      "estimatedDailyBudget": "e.g. $80–$120/day",
      "topActivities": ["activity 1", "activity 2", "activity 3"]
    },
    {
      "rank": 2,
      "rankLabel": "Runner Up",
      "destination": "A specific city name only — never a country (e.g. 'Barcelona', 'Chiang Mai', 'Porto')",
      "country": "Country Name",
      "countryEmoji": "🇮🇹",
      "bestFor": "Short phrase",
      "whyThisMatch": "3-4 sentences explaining specifically why this destination matches their exact quiz answers. Reference their budget level, travel pace, group type, and vibe by name. Write in warm, editorial second-person voice.",
      "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
      "bestTimeToVisit": "e.g. April to June",
      "estimatedDailyBudget": "e.g. $100–$150/day",
      "topActivities": ["activity 1", "activity 2", "activity 3"]
    },
    {
      "rank": 3,
      "rankLabel": "Hidden Gem Pick",
      "destination": "A specific city name only — never a country (e.g. 'Tbilisi', 'Kotor', 'Oaxaca')",
      "country": "Country Name",
      "countryEmoji": "🇵🇹",
      "bestFor": "Short phrase",
      "whyThisMatch": "3-4 sentences explaining specifically why this destination matches their exact quiz answers. Reference their budget level, travel pace, group type, and vibe by name. Write in warm, editorial second-person voice.",
      "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
      "bestTimeToVisit": "e.g. May to September",
      "estimatedDailyBudget": "e.g. $60–$90/day",
      "topActivities": ["activity 1", "activity 2", "activity 3"]
    }
  ]
}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[Claude] Attempt ${attempt}...`);
      const response = await anthropic.messages.create({
        model:      'claude-sonnet-4-5',
        max_tokens: 2500,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: userPrompt }],
      });

      const rawText = response.content[0]?.text ?? '';
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      console.log('[Claude] Successfully generated recommendations');
      return res.json(parsed);

    } catch (err) {
      console.error(`[Claude] Attempt ${attempt} failed:`, err.message);
      if (attempt === 2) {
        return res.status(500).json({ error: 'Failed to generate recommendations. Please try again.' });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});

// ── POST /api/subscribe ────────────────────────────────────
// Adds the user's email to the Mailchimp audience/mailing list
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  console.log(`[Mailchimp] Subscribing: ${email}`);

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'subscribed',
    });

    console.log(`[Mailchimp] Successfully subscribed: ${email}`);
    res.json({ success: true });

  } catch (err) {
    // If member already exists, treat as success (not an error)
    if (err?.response?.body?.title === 'Member Exists') {
      console.log(`[Mailchimp] Member already exists: ${email} — continuing`);
      return res.json({ success: true, note: 'already_subscribed' });
    }

    console.error('[Mailchimp] Error:', err?.response?.body || err.message);
    res.status(500).json({ error: 'Failed to subscribe to mailing list' });
  }
});

// ── POST /api/send-results ─────────────────────────────────
// Sends the quiz results to the user's email via Resend
app.post('/api/send-results', async (req, res) => {
  const { email, results } = req.body;

  if (!email || !results) {
    return res.status(400).json({ error: 'Missing email or results' });
  }

  console.log(`[Resend] ── send-results called ──────────────────`);
  console.log(`[Resend] Recipient email  : "${email}"`);
  console.log(`[Resend] EMAIL_FROM env   : "${process.env.EMAIL_FROM}"`);
  console.log(`[Resend] API key prefix   : ${process.env.RESEND_API_KEY?.slice(0, 8)}...`);

  const destinations = results.destinations?.sort((a, b) => a.rank - b.rank) ?? [];
  const top = destinations[0];

  try {
    const fromAddress = `The Next Stamp <${process.env.EMAIL_FROM}>`;
    const subject     = `✈️ Your Next 3 Stamps — ${top?.destination ?? 'Results'}`;

    const payload = {
      from:    fromAddress,
      to:      email,
      subject: subject,
      html:    buildEmailHtml(results, destinations),
    };

    console.log(`[Resend] Payload to Resend:`);
    console.log(`[Resend]   from    : "${payload.from}"`);
    console.log(`[Resend]   to      : "${payload.to}"`);
    console.log(`[Resend]   subject : "${payload.subject}"`);
    console.log(`[Resend]   html    : ${payload.html.length} chars`);

    const response = await resend.emails.send(payload);

    console.log(`[Resend] Full API response:`, JSON.stringify(response, null, 2));

    if (response?.error) {
      console.error(`[Resend] API returned error object:`, JSON.stringify(response.error, null, 2));
      return res.status(500).json({ error: response.error.message });
    }

    console.log(`[Resend] ✅ Accepted by Resend. Email ID: ${response?.data?.id}`);
    console.log(`[Resend] NOTE: "accepted" ≠ delivered. Check spam folder or Resend dashboard for delivery status.`);
    res.json({ success: true, emailId: response?.data?.id });

  } catch (err) {
    console.error('[Resend] Exception caught:', err?.message);
    console.error('[Resend] Full error:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Failed to send results email' });
  }
});

// ── Email HTML Builder ─────────────────────────────────────
function buildEmailHtml(results, destinations) {
  const rankEmoji = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const rankLabel = { 1: 'Top Pick', 2: 'Runner Up', 3: 'Hidden Gem Pick' };

  const destCards = destinations.map((d) => `
    <tr>
      <td style="padding: 0 0 24px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; border:1px solid #ddccb8; overflow:hidden;">
          <tr>
            <td style="padding: 24px 28px 8px 28px;">
              <p style="margin:0 0 6px 0; font-size:12px; color:#a1775c; font-family:Georgia,serif; letter-spacing:1px; text-transform:uppercase;">
                ${rankEmoji[d.rank]} ${rankLabel[d.rank]}
              </p>
              <h2 style="margin:0 0 4px 0; font-size:24px; color:#5d4430; font-family:Georgia,serif; font-weight:700;">
                ${d.destination}
              </h2>
              <p style="margin:0 0 12px 0; font-size:14px; color:#a1775c; font-family:Arial,sans-serif;">
                ${d.countryEmoji} ${d.country}
              </p>
              <span style="display:inline-block; background:#ddccb8; color:#7b5e42; font-size:12px; font-family:Arial,sans-serif; font-weight:600; padding:4px 14px; border-radius:20px; margin-bottom:14px;">
                Best for: ${d.bestFor}
              </span>
              <p style="margin:0 0 16px 0; font-size:15px; color:#7b5e42; font-family:Arial,sans-serif; line-height:1.6;">
                ${d.whyThisMatch}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 16px 28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:24px;">
                    <p style="margin:0; font-size:11px; color:#a1775c; font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:1px;">Best Time</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#5d4430; font-family:Arial,sans-serif; font-weight:600;">${d.bestTimeToVisit}</p>
                  </td>
                  <td>
                    <p style="margin:0; font-size:11px; color:#a1775c; font-family:Arial,sans-serif; text-transform:uppercase; letter-spacing:1px;">Daily Budget</p>
                    <p style="margin:4px 0 0 0; font-size:14px; color:#5d4430; font-family:Arial,sans-serif; font-weight:600;">${d.estimatedDailyBudget}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 28px 20px 28px; border-top: 1px solid #ddccb8; text-align:center;">
              <p style="margin: 16px 0 12px 0; font-size:13px; color:#7b5e42; font-family:Arial,sans-serif;">
                Ready to start planning your trip to ${d.destination}?
              </p>
              <a href="https://www.getyourguide.com/s/?q=${encodeURIComponent(d.destination)}&partner_id=66EZOEX" style="display:inline-block; background:#5d4430; color:#ffffff; font-family:Arial,sans-serif; font-size:14px; font-weight:700; padding:12px 28px; border-radius:50px; text-decoration:none;">
                Find Experiences in ${d.destination} →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f2e9da; font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2e9da; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#5d4430; border-radius:16px 16px 0 0; padding: 36px 40px; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:11px; color:#a1775c; font-family:Arial,sans-serif; letter-spacing:2px; text-transform:uppercase;">The Next Stamp</p>
              <h1 style="margin:0 0 8px 0; font-size:32px; color:#ffffff; font-family:Georgia,serif; font-weight:700;">Your Next 3 Stamps</h1>
              ${results.travelPersonality ? `
              <span style="display:inline-block; background:#a1775c; color:#ffffff; font-size:13px; font-family:Arial,sans-serif; font-weight:600; padding:6px 18px; border-radius:20px; margin-top:10px;">
                ✨ ${results.travelPersonality}
              </span>` : ''}
            </td>
          </tr>

          <!-- Subheading -->
          <tr>
            <td style="background:#ddccb8; padding: 20px 40px; text-align:center;">
              <p style="margin:0; font-size:15px; color:#7b5e42; font-family:Arial,sans-serif; font-style:italic; line-height:1.5;">
                ${results.personalityDescription ?? 'Based on your travel personality, our AI has handpicked these destinations just for you.'}
              </p>
            </td>
          </tr>

          <!-- Destination cards -->
          <tr>
            <td style="background:#ede8e3; padding: 32px 24px 8px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${destCards}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#5d4430; border-radius:0 0 16px 16px; padding: 28px 40px; text-align:center;">
              <p style="margin:0 0 6px 0; font-size:13px; color:#f2e9da; font-family:Arial,sans-serif; opacity:0.8;">
                Discover where you were always meant to go.
              </p>
              <p style="margin:0; font-size:12px; color:#a1775c; font-family:Arial,sans-serif;">
                © The Next Stamp Travel Co.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Start server ───────────────────────────────────────────
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
