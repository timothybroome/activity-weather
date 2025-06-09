import { calculateActivityRankings } from '@/utils/activity-rankings';
import type { WeatherData } from '@/types/weather';
import { getForecastData } from '../utils/helpers';

export const locationResolvers = {
  activityRankings: async (parent: any, args: any, context: any, info: any) => {
    try {
      const forecastResolver = context.resolvers?.Query?.forecast || null;
      if (!forecastResolver) {
        throw new Error('Forecast resolver not found in context');
      }
      const forecast = await getForecastData(parent, args, context, info, forecastResolver);
      
      if (!forecast || !forecast.daily || !forecast.daily.time) return null;
      
      const { daily } = forecast;
      if (!Array.isArray(daily.time) || 
          !Array.isArray(daily.temperature_2m_max) || 
          !Array.isArray(daily.temperature_2m_min) || 
          !Array.isArray(daily.precipitation_sum) || 
          !Array.isArray(daily.wind_speed_10m_max) || 
          !Array.isArray(daily.weather_code)) {
        console.error('Missing required daily forecast data for activity rankings');
        return null;
      }
      
      const weatherData: WeatherData = {
        location: `${parent.name}${parent.admin1 ? `, ${parent.admin1}` : ""}, ${parent.country}`,
        latitude: parent.latitude,
        longitude: parent.longitude,
        daily: {
          time: daily.time,
          temperature_2m_max: daily.temperature_2m_max,
          temperature_2m_min: daily.temperature_2m_min,
          precipitation_sum: daily.precipitation_sum,
          wind_speed_10m_max: daily.wind_speed_10m_max,
          weather_code: daily.weather_code
        }
      };
      
      return calculateActivityRankings(weatherData);
    } catch (error) {
      console.error('Error in activityRankings resolver:', error);
      return null;
    }
  },
  
  forecast: async (parent: any, args: any, context: any, info: any) => {
    try {
      const forecastResolver = context.resolvers?.Query?.forecast || null;
      if (!forecastResolver) {
        throw new Error('Forecast resolver not found in context');
      }
      return await getForecastData(parent, args, context, info, forecastResolver);
    } catch (error) {
      console.error('Error in Location.forecast resolver:', error);
      return null;
    }
  }
};
