import { getActivityReasoning } from '../activity-rankings';

// Since getActivityReasoning is not exported, we need to modify the activity-rankings.ts file
// to export it for testing purposes. This test assumes that modification has been made.

describe('getActivityReasoning', () => {
  describe('skiing activity', () => {
    it('should return excellent reasoning for high scores', () => {
      const reasoning = getActivityReasoning('skiing', 85);
      expect(reasoning).toContain('Perfect skiing conditions');
    });

    it('should return poor reasoning for low scores', () => {
      const reasoning = getActivityReasoning('skiing', 30);
      expect(reasoning).toContain('Poor skiing conditions');
    });
  });

  describe('surfing activity', () => {
    it('should return excellent reasoning for high scores', () => {
      const reasoning = getActivityReasoning('surfing', 90);
      expect(reasoning).toContain('Ideal surfing conditions');
    });

    it('should return fair reasoning for medium scores', () => {
      const reasoning = getActivityReasoning('surfing', 50);
      expect(reasoning).toContain('Decent surfing conditions');
    });
  });

  describe('outdoor sightseeing activity', () => {
    it('should return good reasoning for good scores', () => {
      const reasoning = getActivityReasoning('outdoor sightseeing', 70);
      expect(reasoning).toContain('Great conditions for outdoor activities');
    });

    it('should return poor reasoning for low scores', () => {
      const reasoning = getActivityReasoning('outdoor sightseeing', 20);
      expect(reasoning).toContain('Poor outdoor conditions');
    });
  });

  describe('indoor sightseeing activity', () => {
    it('should return excellent reasoning for high scores', () => {
      const reasoning = getActivityReasoning('indoor sightseeing', 85);
      expect(reasoning).toContain('Perfect time for museums');
    });

    it('should return poor reasoning for low scores', () => {
      const reasoning = getActivityReasoning('indoor sightseeing', 25);
      expect(reasoning).toContain('Weather is actually quite nice for outdoor activities');
    });
  });

  it('should handle score thresholds correctly', () => {
    // Instead of checking for the level words, check for the actual reasoning content
    expect(getActivityReasoning('skiing', 80)).toBe('Perfect skiing conditions with cold temperatures and good snow prospects');
    expect(getActivityReasoning('skiing', 79)).toBe('Good skiing weather with suitable temperatures and conditions');
    expect(getActivityReasoning('skiing', 60)).toBe('Good skiing weather with suitable temperatures and conditions');
    expect(getActivityReasoning('skiing', 59)).toBe('Acceptable skiing conditions, though not ideal');
    expect(getActivityReasoning('skiing', 40)).toBe('Acceptable skiing conditions, though not ideal');
    expect(getActivityReasoning('skiing', 39)).toBe('Poor skiing conditions due to warm temperatures or unfavorable weather');
  });
});
