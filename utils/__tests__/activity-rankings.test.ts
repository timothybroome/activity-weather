import { calculateActivityRankings } from '../activity-rankings';
import type { WeatherData } from '@/types/weather';

describe('Activity Rankings', () => {
  // Mock weather data for testing
  const mockWeatherData: WeatherData = {
    location: 'Test Location',
    latitude: 40.7128,
    longitude: -74.0060,
    daily: {
      time: ['2025-06-09', '2025-06-10', '2025-06-11'],
      temperature_2m_max: [22, 5, 15],
      temperature_2m_min: [15, 0, 10],
      precipitation_sum: [0, 15, 3],
      wind_speed_10m_max: [12, 30, 20],
      weather_code: [1, 75, 61] // 1: Clear, 75: Snow, 61: Rain
    }
  };

  describe('calculateActivityRankings', () => {
    it('should return rankings for all activities', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      
      expect(rankings).toHaveLength(4);
      expect(rankings.map(r => r.activity)).toEqual([
        'skiing', 'surfing', 'outdoor sightseeing', 'indoor sightseeing'
      ]);
    });

    it('should calculate correct average scores', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      
      // Each activity should have an average score between 0 and 100
      rankings.forEach(ranking => {
        expect(ranking.averageScore).toBeGreaterThanOrEqual(0);
        expect(ranking.averageScore).toBeLessThanOrEqual(100);
      });
    });

    it('should include daily scores for each day', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      
      rankings.forEach(ranking => {
        expect(ranking.dailyScores).toHaveLength(mockWeatherData.daily.time.length);
      });
    });

    it('should provide reasoning for each activity', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      
      rankings.forEach(ranking => {
        expect(ranking.reasoning).toBeDefined();
        expect(typeof ranking.reasoning).toBe('string');
        expect(ranking.reasoning.length).toBeGreaterThan(0);
      });
    });

    it('should rank skiing higher on snowy days', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      const skiingRanking = rankings.find(r => r.activity === 'skiing');
      
      // Day 2 has snow (weather code 75) and cold temperature (5°C)
      expect(skiingRanking!.dailyScores[1]).toBeGreaterThan(skiingRanking!.dailyScores[0]);
    });

    it('should rank outdoor sightseeing higher on clear days with moderate temperature', () => {
      const rankings = calculateActivityRankings(mockWeatherData);
      const outdoorRanking = rankings.find(r => r.activity === 'outdoor sightseeing');
      
      // Day 1 is clear (weather code 1) with good temperature (22°C)
      expect(outdoorRanking!.dailyScores[0]).toBeGreaterThan(outdoorRanking!.dailyScores[1]);
    });
  });
});
