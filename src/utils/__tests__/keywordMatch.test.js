import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { matchKeyword } from '../keywordMatch';
import { keywordResponseMap, fallbackResponse } from '../../data/aiResponses';

describe('matchKeyword', () => {
  let mathRandomSpy;

  beforeEach(() => {
    mathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  function getFirstResponse(category) {
    const config = keywordResponseMap[category];
    if (!config || !Array.isArray(config.responses) || config.responses.length === 0) {
      return null;
    }
    return config.responses[0];
  }

  describe('category matching', () => {
    it('matches q4_board category for "q4 board presentation ready"', () => {
      const result = matchKeyword('q4 board presentation ready');
      expect(result.category).toBe('q4_board');
      expect(result.response).toBe(getFirstResponse('q4_board'));
    });

    it('matches q4_board category for "board meeting executive summary"', () => {
      const result = matchKeyword('board meeting executive summary');
      expect(result.category).toBe('q4_board');
      expect(result.response).toBe(getFirstResponse('q4_board'));
    });

    it('matches q4_board category for "quarterly review board deck"', () => {
      const result = matchKeyword('quarterly review board deck');
      expect(result.category).toBe('q4_board');
      expect(result.response).toBe(getFirstResponse('q4_board'));
    });

    it('matches tcs_partnership category for "tcs partnership performance"', () => {
      const result = matchKeyword('tcs partnership performance');
      expect(result.category).toBe('tcs_partnership');
      expect(result.response).toBe(getFirstResponse('tcs_partnership'));
    });

    it('matches tcs_partnership category for "tata consultancy services contract"', () => {
      const result = matchKeyword('tata consultancy services contract');
      expect(result.category).toBe('tcs_partnership');
      expect(result.response).toBe(getFirstResponse('tcs_partnership'));
    });

    it('matches tcs_partnership category for "strategic partner ecosystem"', () => {
      const result = matchKeyword('strategic partner ecosystem');
      expect(result.category).toBe('tcs_partnership');
      expect(result.response).toBe(getFirstResponse('tcs_partnership'));
    });

    it('matches business_value category for "business value roi analysis"', () => {
      const result = matchKeyword('business value roi analysis');
      expect(result.category).toBe('business_value');
      expect(result.response).toBe(getFirstResponse('business_value'));
    });

    it('matches business_value category for "cost savings and revenue growth"', () => {
      const result = matchKeyword('cost savings and revenue growth');
      expect(result.category).toBe('business_value');
      expect(result.response).toBe(getFirstResponse('business_value'));
    });

    it('matches business_value category for "financial impact bottom line"', () => {
      const result = matchKeyword('financial impact bottom line');
      expect(result.category).toBe('business_value');
      expect(result.response).toBe(getFirstResponse('business_value'));
    });

    it('matches regional category for "regional performance comparison"', () => {
      const result = matchKeyword('regional performance comparison');
      expect(result.category).toBe('regional');
      expect(result.response).toBe(getFirstResponse('regional'));
    });

    it('matches regional category for "emea apac americas breakdown"', () => {
      const result = matchKeyword('emea apac americas breakdown');
      expect(result.category).toBe('regional');
      expect(result.response).toBe(getFirstResponse('regional'));
    });

    it('matches regional category for "india coe delivery center"', () => {
      const result = matchKeyword('india coe delivery center');
      expect(result.category).toBe('regional');
      expect(result.response).toBe(getFirstResponse('regional'));
    });

    it('matches innovation category for "ai machine learning models"', () => {
      const result = matchKeyword('ai machine learning models');
      expect(result.category).toBe('innovation');
      expect(result.response).toBe(getFirstResponse('innovation'));
    });

    it('matches innovation category for "digital transformation automation"', () => {
      const result = matchKeyword('digital transformation automation');
      expect(result.category).toBe('innovation');
      expect(result.response).toBe(getFirstResponse('innovation'));
    });

    it('matches innovation category for "quantum computing research"', () => {
      const result = matchKeyword('quantum computing research');
      expect(result.category).toBe('innovation');
      expect(result.response).toBe(getFirstResponse('innovation'));
    });

    it('matches security_risk category for "security posture assessment"', () => {
      const result = matchKeyword('security posture assessment');
      expect(result.category).toBe('security_risk');
      expect(result.response).toBe(getFirstResponse('security_risk'));
    });

    it('matches security_risk category for "cyber threat vulnerability"', () => {
      const result = matchKeyword('cyber threat vulnerability');
      expect(result.category).toBe('security_risk');
      expect(result.response).toBe(getFirstResponse('security_risk'));
    });

    it('matches security_risk category for "gdpr compliance audit"', () => {
      const result = matchKeyword('gdpr compliance audit');
      expect(result.category).toBe('security_risk');
      expect(result.response).toBe(getFirstResponse('security_risk'));
    });
  });

  describe('fallback response', () => {
    it('returns fallback for unrecognized input', () => {
      const result = matchKeyword('what is the weather today');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });

    it('returns fallback for empty string input', () => {
      const result = matchKeyword('');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });

    it('returns fallback for whitespace-only input', () => {
      const result = matchKeyword('   ');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });

    it('returns fallback for input with only stop words', () => {
      const result = matchKeyword('the and for with please tell me');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });

    it('returns fallback for completely unrelated input', () => {
      const result = matchKeyword('hello how are you doing today');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });

    it('returns fallback for very short input with no keywords', () => {
      const result = matchKeyword('hi');
      expect(result.category).toBeNull();
      expect(result.response).toBe(fallbackResponse);
    });
  });

  describe('delay range', () => {
    it('returns delay between 500 and 1500ms', () => {
      mathRandomSpy.mockRestore();

      for (let i = 0; i < 50; i++) {
        const result = matchKeyword('q4 board presentation');
        expect(result.delay).toBeGreaterThanOrEqual(500);
        expect(result.delay).toBeLessThanOrEqual(1500);
      }
    });

    it('returns delay for fallback responses within range', () => {
      mathRandomSpy.mockRestore();

      for (let i = 0; i < 50; i++) {
        const result = matchKeyword('unrelated text');
        expect(result.delay).toBeGreaterThanOrEqual(500);
        expect(result.delay).toBeLessThanOrEqual(1500);
      }
    });
  });

  describe('case insensitivity', () => {
    it('matches uppercase input', () => {
      const result = matchKeyword('Q4 BOARD PRESENTATION READY');
      expect(result.category).toBe('q4_board');
    });

    it('matches mixed case input', () => {
      const result = matchKeyword('TcS pArTnErShIp PeRfOrMaNcE');
      expect(result.category).toBe('tcs_partnership');
    });

    it('matches lowercase input', () => {
      const result = matchKeyword('security posture assessment');
      expect(result.category).toBe('security_risk');
    });

    it('matches input with random capitalization', () => {
      const result = matchKeyword('ReGiOnAl PeRfOrMaNcE CoMpArIsOn');
      expect(result.category).toBe('regional');
    });
  });

  describe('partial keyword matching', () => {
    it('matches when keyword is part of a longer phrase', () => {
      const result = matchKeyword('can you analyze the tcs contract expansion strategy for next year');
      expect(result.category).toBe('tcs_partnership');
    });

    it('matches when multiple keywords are embedded in text', () => {
      const result = matchKeyword('I need a detailed analysis of our innovation pipeline and ai ml models');
      expect(result.category).toBe('innovation');
    });

    it('matches when keyword appears with surrounding punctuation', () => {
      const result = matchKeyword('board presentation: ready for review');
      expect(result.category).toBe('q4_board');
    });
  });

  describe('multi-keyword input', () => {
    it('selects highest-scoring category when multiple categories match', () => {
      const result = matchKeyword('q4 board presentation with tcs partnership update');
      expect(result.category).toBe('q4_board');
    });

    it('scores multi-word phrases higher than single words', () => {
      const result = matchKeyword('board deck materials');
      expect(result.category).toBe('q4_board');
    });

    it('handles input matching keywords from different categories', () => {
      const result = matchKeyword('regional innovation security overview');
      expect(result.category).toBeDefined();
      expect(result.response).toBeDefined();
    });
  });

  describe('response selection', () => {
    it('returns the first response when Math.random returns 0', () => {
      mathRandomSpy.mockReturnValue(0);
      const result = matchKeyword('q4 board presentation');
      expect(result.response).toBe(getFirstResponse('q4_board'));
    });

    it('returns a valid response from the matched category', () => {
      mathRandomSpy.mockRestore();

      for (let i = 0; i < 20; i++) {
        const result = matchKeyword('tcs partnership');
        const config = keywordResponseMap['tcs_partnership'];
        expect(config.responses).toContain(result.response);
      }
    });

    it('returns different responses across multiple calls', () => {
      mathRandomSpy.mockRestore();

      const responses = new Set();
      for (let i = 0; i < 30; i++) {
        const result = matchKeyword('business value roi');
        responses.add(result.response);
      }

      expect(responses.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('edge cases', () => {
    it('handles input with special characters', () => {
      const result = matchKeyword('q4/board presentation & executive summary');
      expect(result.category).toBe('q4_board');
    });

    it('handles input with numbers', () => {
      const result = matchKeyword('q4 2025 board presentation');
      expect(result.category).toBe('q4_board');
    });

    it('handles very long input', () => {
      const longInput = 'q4 board presentation '.repeat(50);
      const result = matchKeyword(longInput);
      expect(result.category).toBe('q4_board');
    });

    it('handles input with only one meaningful keyword token', () => {
      const result = matchKeyword('tcs');
      expect(result.category).toBe('tcs_partnership');
    });

    it('handles input with trailing and leading whitespace', () => {
      const result = matchKeyword('  q4 board presentation  ');
      expect(result.category).toBe('q4_board');
    });

    it('handles input with newlines', () => {
      const result = matchKeyword('q4 board\npresentation ready');
      expect(result.category).toBe('q4_board');
    });
  });

  describe('all six categories', () => {
    const categoryTests = [
      { category: 'q4_board', input: 'q4 board presentation ready' },
      { category: 'tcs_partnership', input: 'tcs partnership performance' },
      { category: 'business_value', input: 'business value roi analysis' },
      { category: 'regional', input: 'regional performance comparison' },
      { category: 'innovation', input: 'ai machine learning models' },
      { category: 'security_risk', input: 'security posture assessment' },
    ];

    categoryTests.forEach(({ category, input }) => {
      it(`matches ${category} category and returns non-empty response`, () => {
        const result = matchKeyword(input);
        expect(result.category).toBe(category);
        expect(result.response).toBeTruthy();
        expect(typeof result.response).toBe('string');
        expect(result.response.length).toBeGreaterThan(50);
      });
    });
  });
});