import fetch from 'node-fetch';
import { calculateActivityRankings } from '@/utils/activity-rankings';
import type { WeatherData } from '@/types/weather';


const formatArrayParam = (paramName: string, values: string[] | undefined): string => {
  if (!values || values.length === 0) return '';
  return `&${paramName}=${values.join(',')}`;
};


const formatPastDays = (pastDays: string | undefined): string => {
  if (!pastDays) return '';
  const days = pastDays === 'ONE' ? 1 : pastDays === 'TWO' ? 2 : 0;
  return days > 0 ? `&past_days=${days}` : '';
};


const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';


const getFieldSelections = (info: any, typeName: string) => {

  if (!info || !info.fieldNodes || !info.fieldNodes[0] || !info.fieldNodes[0].selectionSet) {
    return [];
  }
  

  const selections = info.fieldNodes[0].selectionSet.selections;
  const fieldNode = selections.find((selection: any) => 
    selection.name && selection.name.value === typeName && selection.selectionSet
  );
  
  if (!fieldNode) return [];
  

  return fieldNode.selectionSet.selections
    .filter((selection: any) => selection.name)
    .map((selection: any) => selection.name.value);
};

export const resolvers = {
  Query: {

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
    },
    
  },
  

  // to provide a more complete GraphQL API allow forecast to be nested within Geolocation/Location in the schema
  Forecast: {

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
  },
  

  Location: {
    
    activityRankings: async (parent: any, args: any, context: any, info: any) => {
      try {
        const forecast = await getForecastData(parent, args, context, info, resolvers.Query.forecast);
        
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
        return await getForecastData(parent, args, context, info, resolvers.Query.forecast);
      } catch (error) {
        console.error('Error in Location.forecast resolver:', error);
        return null;
      }
    }
  }
};


// Helper function to get forecast data with caching to avoid duplicate API calls
const getForecastData = async (
  parent: any, 
  args: any, 
  context: any, 
  info: any,
  forecastResolver: any
) => {
  const { latitude, longitude } = parent;
  
  if (!latitude || !longitude) {
    throw new Error('Location does not have valid coordinates');
  }
  
  if (!context.forecastCache) {
    context.forecastCache = {};
  }
  
  const cacheKey = `${latitude},${longitude}`;
  
  if (context.forecastCache[cacheKey]) {
    return context.forecastCache[cacheKey];
  }
  
  try {
    const dailyVariables = [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'wind_speed_10m_max',
      'weather_code'
    ];
    
    const forecastArgs = {
      latitude,
      longitude,
      daily: dailyVariables,
      current_weather: args.current_weather !== false ? true : false,
      timezone: 'auto',
      forecast_days: 7
    };
    
    const forecast = await forecastResolver(null, forecastArgs, context, info);
    
    context.forecastCache[cacheKey] = forecast;
    
    return forecast;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};
