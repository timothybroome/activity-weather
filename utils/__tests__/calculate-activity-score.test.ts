import { calculateActivityScore } from '../activity-rankings';

describe('calculateActivityScore', () => {
  describe('skiing activity', () => {
    it('should give high score for cold temperatures and snowy conditions', () => {
      const score = calculateActivityScore('skiing', -2, 5, 15, 75); // Cold, some precipitation, moderate wind, snowy
      expect(score).toBeGreaterThanOrEqual(70);
    });

    it('should give low score for warm temperatures', () => {
      const score = calculateActivityScore('skiing', 20, 0, 10, 1); // Warm, no precipitation, low wind, clear
      expect(score).toBeLessThanOrEqual(30);
    });
  });

  describe('surfing activity', () => {
    it('should give high score for moderate temperatures and wind', () => {
      const score = calculateActivityScore('surfing', 22, 0, 15, 1); // Good temp, no precipitation, ideal wind, clear
      expect(score).toBeGreaterThanOrEqual(70);
    });

    it('should give low score for cold temperatures and high wind', () => {
      const score = calculateActivityScore('surfing', 2, 0, 45, 1); // Cold, no precipitation, high wind, clear
      expect(score).toBeLessThanOrEqual(50);
    });
  });

  describe('outdoor sightseeing activity', () => {
    it('should give high score for pleasant temperatures and clear skies', () => {
      const score = calculateActivityScore('outdoor sightseeing', 22, 0, 10, 1); // Pleasant temp, no precipitation, low wind, clear
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should give low score for rainy conditions', () => {
      const score = calculateActivityScore('outdoor sightseeing', 22, 12, 20, 61); // Pleasant temp, heavy rain, moderate wind, rainy
      expect(score).toBeLessThanOrEqual(45);
    });
  });

  describe('indoor sightseeing activity', () => {
    it('should give high score for poor outdoor conditions', () => {
      const score = calculateActivityScore('indoor sightseeing', 2, 15, 45, 75); // Cold, heavy precipitation, high wind, snowy
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should give lower score for ideal outdoor conditions', () => {
      const score = calculateActivityScore('indoor sightseeing', 22, 0, 10, 1); // Pleasant temp, no precipitation, low wind, clear
      expect(score).toBeLessThanOrEqual(50);
    });
  });

  it('should handle unknown activities by returning a score of 0', () => {
    const score = calculateActivityScore('unknown-activity', 22, 0, 10, 1);
    expect(score).toBe(0);
  });

  it('should never return a score below 0', () => {
    // Try extreme values that might result in negative scores
    const score = calculateActivityScore('skiing', 40, 0, 100, 1); // Very hot, no snow, extreme wind, clear
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('should never return a score above 100', () => {
    // Try extreme values that might result in scores over 100
    const score = calculateActivityScore('skiing', -20, 30, 5, 75); // Extremely cold, heavy snow, low wind, snowy
    expect(score).toBeLessThanOrEqual(100);
  });
});
