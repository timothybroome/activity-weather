import { calculateActivityRankings } from '@/utils/activity-rankings';
import type { WeatherData } from '@/types/weather';

export const forecastResolvers = {
  hourly: (parent: any) => {
    if (!parent.hourly) return null;
    return parent.hourly;
  },
  
  daily: (parent: any) => {
    if (!parent.daily) return null;
    
    const dailyData = { ...parent.daily };
    
    if (!dailyData.time || !Array.isArray(dailyData.time)) {
      dailyData.time = [];
    }

    return {
      ...dailyData,
      temperature_2m_max: dailyData.temperature_2m_max || [],
      temperature_2m_min: dailyData.temperature_2m_min || [],
      precipitation_sum: dailyData.precipitation_sum || [],
      wind_speed_10m_max: dailyData.wind_speed_10m_max || [],
      weather_code: dailyData.weather_code || []
    };
  },
  
  current_weather: (parent: any) => {
    if (!parent.current_weather) return null;
    
    return {
      time: parent.current_weather.time || null,
      temperature: parent.current_weather.temperature || null,
      wind_speed: parent.current_weather.wind_speed || null,
      wind_direction: parent.current_weather.wind_direction || null,
      weather_code: parent.current_weather.weather_code || null
    };
  },
  
  activityRankings: async (parent: any, args: any, context: any, info: any) => {
    try {
      const { latitude, longitude } = parent;
      
      if (!parent.daily) {
        throw new Error('Daily forecast data is required for activity rankings');
      }
      
      const weatherData: WeatherData = {
        latitude,
        longitude,
        location: '',
        daily: parent.daily
      };
      
      return calculateActivityRankings(weatherData);
    } catch (error) {
      console.error('Error calculating activity rankings:', error);
      return [];
    }
  }
};
