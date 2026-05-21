import { keywordResponseMap, fallbackResponse } from '../data/aiResponses';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'about', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'and',
  'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither',
  'each', 'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some',
  'such', 'only', 'own', 'same', 'than', 'too', 'very', 'just',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
  'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'how', 'when', 'where', 'why',
  'please', 'tell', 'show', 'give', 'need', 'want', 'help', 'analyze',
  'analysis', 'provide', 'explain', 'describe',
]);

const MINIMUM_SCORE_THRESHOLD = 5;

let _invertedIndex = null;

function _buildInvertedIndex() {
  if (_invertedIndex) {
    return _invertedIndex;
  }

  const index = new Map();

  for (const [category, config] of Object.entries(keywordResponseMap)) {
    if (!config || !Array.isArray(config.keywords)) {
      continue;
    }

    for (const keyword of config.keywords) {
      const normalized = keyword.toLowerCase().trim();
      if (normalized.length === 0) {
        continue;
      }

      if (!index.has(normalized)) {
        index.set(normalized, []);
      }
      index.get(normalized).push(category);
    }
  }

  _invertedIndex = index;
  return _invertedIndex;
}

function _tokenize(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return [];
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function _scoreCategories(tokens) {
  const index = _buildInvertedIndex();
  const scores = new Map();

  for (const category of Object.keys(keywordResponseMap)) {
    scores.set(category, 0);
  }

  for (const token of tokens) {
    if (index.has(token)) {
      for (const category of index.get(token)) {
        scores.set(category, scores.get(category) + 10);
      }
    }

    for (const [keyword, categories] of index.entries()) {
      if (keyword !== token && keyword.includes(token)) {
        for (const category of categories) {
          scores.set(category, scores.get(category) + 3);
        }
      }
    }
  }

  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (index.has(bigram)) {
      for (const category of index.get(bigram)) {
        scores.set(category, scores.get(category) + 15);
      }
    }
  }

  for (let i = 0; i < tokens.length - 2; i++) {
    const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
    if (index.has(trigram)) {
      for (const category of index.get(trigram)) {
        scores.set(category, scores.get(category) + 20);
      }
    }
  }

  return scores;
}

function _selectResponse(category) {
  const config = keywordResponseMap[category];
  if (!config || !Array.isArray(config.responses) || config.responses.length === 0) {
    return fallbackResponse;
  }

  const responses = config.responses;
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

/**
 * Match user input against keyword categories and return an appropriate response.
 *
 * Algorithm:
 * 1. Tokenize input text (lowercase, remove stop words, split on whitespace)
 * 2. Score each category against tokens using an inverted index
 * 3. Select the highest-scoring category (must exceed minimum threshold)
 * 4. If no category meets the threshold, return the fallback response
 * 5. Select a random response from the matched category
 *
 * @param {string} inputText - Raw user input from chat
 * @returns {{ response: string, category: string | null, delay: number }}
 *   - response: The matched response text or fallback
 *   - category: The matched category key or null if fallback
 *   - delay: Simulated response delay in milliseconds (500-1500)
 *
 * @example
 *   const result = matchKeyword('q4 board presentation ready');
 *   // result.category === 'q4_board'
 *   // result.response === 'Your Q4 board presentation is ready...'
 *   // result.delay >= 500 && result.delay <= 1500
 */
export function matchKeyword(inputText) {
  const delay = 500 + Math.floor(Math.random() * 1001);

  if (typeof inputText !== 'string' || inputText.trim().length === 0) {
    return {
      response: fallbackResponse,
      category: null,
      delay,
    };
  }

  const tokens = _tokenize(inputText);

  if (tokens.length === 0) {
    return {
      response: fallbackResponse,
      category: null,
      delay,
    };
  }

  const scores = _scoreCategories(tokens);

  let bestCategory = null;
  let bestScore = 0;

  for (const [category, score] of scores.entries()) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  if (bestScore < MINIMUM_SCORE_THRESHOLD || bestCategory === null) {
    return {
      response: fallbackResponse,
      category: null,
      delay,
    };
  }

  return {
    response: _selectResponse(bestCategory),
    category: bestCategory,
    delay,
  };
}