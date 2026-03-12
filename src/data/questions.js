/**
 * questions.js
 * All 12 quiz questions and their answer options for The Next Stamp AI Travel Quiz.
 * Each question has: id, category, question text, and an array of answer options.
 */

export const questions = [
  {
    id: 1,
    category: "Travel Vibe",
    question: "What kind of trip are you dreaming of right now?",
    options: [
      { id: "1a", text: "Sun, sea, and total relaxation", emoji: "🌊" },
      { id: "1b", text: "A buzzing city with culture and food", emoji: "🏙️" },
      { id: "1c", text: "Nature, hiking, and the great outdoors", emoji: "🌿" },
      { id: "1d", text: "History, art, and ancient civilizations", emoji: "🏛️" },
    ],
  },
  {
    id: 2,
    category: "Travel Pace",
    question: "How do you like to travel?",
    options: [
      { id: "2a", text: "Slow and immersive — I stay in one place for a while", emoji: "" },
      { id: "2b", text: "A balanced mix — a few places, not too rushed", emoji: "" },
      { id: "2c", text: "Fast-paced — I want to see as much as possible", emoji: "" },
      { id: "2d", text: "Spontaneous — I decide as I go", emoji: "" },
    ],
  },
  {
    id: 3,
    category: "Budget",
    question: "What's your rough daily travel budget per person?",
    options: [
      { id: "3a", text: "Budget explorer — Under $75/day", emoji: "" },
      { id: "3b", text: "Comfortable traveler — $75–$150/day", emoji: "" },
      { id: "3c", text: "Splurge-worthy — $150–$300/day", emoji: "" },
      { id: "3d", text: "No limits — Money is no object", emoji: "" },
    ],
  },
  {
    id: 4,
    category: "Climate Preference",
    question: "What's your ideal travel weather?",
    options: [
      { id: "4a", text: "Hot and sunny, tropical vibes", emoji: "🌞" },
      { id: "4b", text: "Mild and temperate, four seasons", emoji: "🍂" },
      { id: "4c", text: "Cool or cold — I love cozy destinations", emoji: "❄️" },
      { id: "4d", text: "I don't mind — weather doesn't bother me", emoji: "🌦️" },
    ],
  },
  {
    id: 5,
    category: "Travel Group",
    question: "Who are you traveling with?",
    options: [
      { id: "5a", text: "Solo — just me", emoji: "" },
      { id: "5b", text: "My partner or spouse", emoji: "" },
      { id: "5c", text: "A group of friends", emoji: "" },
      { id: "5d", text: "My family with kids", emoji: "" },
    ],
  },
  {
    id: 6,
    category: "Accommodation Style",
    question: "Where do you prefer to stay?",
    options: [
      { id: "6a", text: "Luxury hotels and resorts", emoji: "🏨" },
      { id: "6b", text: "Boutique guesthouses and local stays", emoji: "🛖" },
      { id: "6c", text: "Hostels, camping, or budget stays", emoji: "🏕️" },
      { id: "6d", text: "Airbnb or home rentals", emoji: "🏡" },
    ],
  },
  {
    id: 7,
    category: "Food Priorities",
    question: "How important is food to your travel experience?",
    options: [
      { id: "7a", text: "It's the #1 reason I travel — food is everything", emoji: "" },
      { id: "7b", text: "Very important — I always seek out the best local spots", emoji: "" },
      { id: "7c", text: "Somewhat important — I enjoy good food but it's not the focus", emoji: "" },
      { id: "7d", text: "Not very important — I just need fuel to keep exploring", emoji: "" },
    ],
  },
  {
    id: 8,
    category: "Activity Level",
    question: "How active do you like your trips to be?",
    options: [
      { id: "8a", text: "Very active — hiking, sports, adventure activities daily", emoji: "" },
      { id: "8b", text: "Moderately active — some walks and activities, some downtime", emoji: "" },
      { id: "8c", text: "Low-key — I prefer strolling, cafés, and slow exploration", emoji: "" },
      { id: "8d", text: "Completely relaxed — beaches, pools, and total rest", emoji: "" },
    ],
  },
  {
    id: 9,
    category: "Travel Distance",
    question: "How far are you willing to fly from home?",
    options: [
      { id: "9a", text: "I prefer staying regional — under 3 hours flight", emoji: "" },
      { id: "9b", text: "Medium haul — up to 6–8 hours is fine", emoji: "" },
      { id: "9c", text: "Long haul — I'll fly 10–14 hours for the right place", emoji: "" },
      { id: "9d", text: "Distance doesn't matter — the destination is all that counts", emoji: "" },
    ],
  },
  {
    id: 10,
    category: "Travel Motivation",
    question: "What do you most want to get out of this trip?",
    options: [
      { id: "10a", text: "To completely switch off and recharge", emoji: "" },
      { id: "10b", text: "To learn something new about culture or history", emoji: "" },
      { id: "10c", text: "To challenge myself and have adventures", emoji: "" },
      { id: "10d", text: "To connect with people and make memories", emoji: "" },
    ],
  },
  {
    id: 11,
    category: "Crowds",
    question: "How do you feel about popular tourist destinations?",
    options: [
      { id: "11a", text: "I love them — the buzz and infrastructure is worth it", emoji: "" },
      { id: "11b", text: "I don't mind some crowds if the destination is worth it", emoji: "" },
      { id: "11c", text: "I prefer quieter, less-visited places", emoji: "" },
      { id: "11d", text: "I actively seek off-the-beaten-path hidden gems only", emoji: "" },
    ],
  },
  {
    id: 12,
    category: "Travel Timing",
    question: "When are you planning to travel?",
    options: [
      { id: "12a", text: "Within the next 1–3 months", emoji: "" },
      { id: "12b", text: "In 3–6 months", emoji: "" },
      { id: "12c", text: "In 6–12 months", emoji: "" },
      { id: "12d", text: "I'm just exploring ideas for now", emoji: "" },
    ],
  },
  {
    id: 13,
    category: "Trip Length",
    question: "How long is your trip likely to be?",
    options: [
      { id: "13a", text: "A long weekend — 3 to 4 days", emoji: "⚡" },
      { id: "13b", text: "One week", emoji: "📅" },
      { id: "13c", text: "Two weeks", emoji: "✈️" },
      { id: "13d", text: "Three weeks or more", emoji: "🌍" },
    ],
  },
  {
    id: 14,
    category: "Language Comfort",
    question: "How do you feel about language barriers?",
    options: [
      { id: "14a", text: "I prefer destinations where English is widely spoken", emoji: "🗣️" },
      { id: "14b", text: "A little language barrier is fine — I'll manage", emoji: "😊" },
      { id: "14c", text: "I enjoy the challenge — I love immersing in local language", emoji: "📖" },
      { id: "14d", text: "Doesn't matter at all to me", emoji: "🤷" },
    ],
  },
  {
    id: 15,
    category: "Must-Have Experience",
    question: "What's the one thing your trip absolutely must have?",
    options: [
      { id: "15a", text: "Stunning natural scenery I can't find at home", emoji: "🏔️" },
      { id: "15b", text: "Incredible food and a vibrant local dining scene", emoji: "🍽️" },
      { id: "15c", text: "Rich history, architecture, and cultural depth", emoji: "🏛️" },
      { id: "15d", text: "Nightlife, energy, and a city that never sleeps", emoji: "🌃" },
    ],
  },
];
