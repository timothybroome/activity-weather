import fetch from 'node-fetch';
import { WEATHER_API_BASE_URL, GEOCODING_API_BASE_URL } from '../utils/constants';
import { getFieldSelections, formatPastDays } from '../utils/helpers';

export const queryResolvers = {
  forecast: async (_: any, args: any, context: any, info: any) => {
    const {
      latitude,
      longitude,
      hourly,
      daily,
      current_weather,
      temperature_unit,
      wind_speed_unit,
      precipitation_unit,
      timeformat,
      timezone,
      past_days,
      forecast_days
    } = args;

    let url = `${WEATHER_API_BASE_URL}?latitude=${latitude}&longitude=${longitude}`;
    
    const hourlySelections = getFieldSelections(info, 'hourly');
    const dailySelections = getFieldSelections(info, 'daily');
    const hasCurrentWeatherSelection = info && 
      info.fieldNodes && 
      info.fieldNodes[0]?.selectionSet?.selections?.some((selection: any) => 
        selection.name && selection.name.value === 'current_weather'
      );
    
    const hourlyParams = hourly || [];
    const dailyParams = daily || [];
    
    hourlySelections.forEach((field: string) => {
      if (!hourlyParams.includes(field as any) && field !== '__typename') {
        hourlyParams.push(field as any);
      }
    });
    
    dailySelections.forEach((field: string) => {
      if (!dailyParams.includes(field as any) && field !== '__typename' && field !== 'time') {
        dailyParams.push(field as any);
      }
    });
    
    if (hourlyParams.length > 0) {
      url += `&hourly=${hourlyParams.join(',')}`;
    }
    
    if (dailyParams.length > 0) {
      url += `&daily=${dailyParams.join(',')}`;
    }
    
    if (current_weather === true || hasCurrentWeatherSelection) {
      url += `&current_weather=true`;
    } else if (current_weather === false) {
      url += `&current_weather=false`;
    }
    
    if (temperature_unit) {
      url += `&temperature_unit=${temperature_unit.toLowerCase()}`;
    }
    
    if (wind_speed_unit) {
      url += `&wind_speed_unit=${wind_speed_unit.toLowerCase()}`;
    }
    
    if (precipitation_unit) {
      url += `&precipitation_unit=${precipitation_unit.toLowerCase()}`;
    }
    
    if (timeformat) {
      url += `&timeformat=${timeformat.toLowerCase()}`;
    }
    
    if (timezone) {
      url += `&timezone=${encodeURIComponent(timezone)}`;
    }
    
    if (forecast_days !== undefined) {
      url += `&forecast_days=${forecast_days}`;
    }
    
    if (past_days) {
      url += formatPastDays(past_days);
    }
    
    try {
      console.log('Fetching weather data from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as {
        daily?: {
          time?: string[] | string;
          [key: string]: any;
        };
        [key: string]: any;
      };
      
      if (data.daily) {
        if (!data.daily.time) {
          data.daily.time = [];
        } else if (!Array.isArray(data.daily.time)) {
          data.daily.time = [data.daily.time as string];
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },
  
  geocode: async (_: any, args: any, context: any, info: any) => {
    const { name, count, language, countryCode } = args;
    
    let url = `${GEOCODING_API_BASE_URL}/search?name=${encodeURIComponent(name)}`;
    
    if (count !== undefined) {
      url += `&count=${count}`;
    }
    
    if (language) {
      url += `&language=${language.toLowerCase()}`;
    }
    
    if (countryCode) {
      url += `&countryCode=${countryCode}`;
    }
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json() as { reason?: string };
        throw new Error(errorData.reason || 'Failed to fetch geocoding data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      throw error;
    }
  }
};
