/**
 * Helper functions for GraphQL resolvers
 */

/**
 * Formats array parameters for API URLs
 */
export const formatArrayParam = (paramName: string, values: string[] | undefined): string => {
  if (!values || values.length === 0) return '';
  return `&${paramName}=${values.join(',')}`;
};

/**
 * Formats past_days parameter for weather API
 */
export const formatPastDays = (pastDays: string | undefined): string => {
  if (!pastDays) return '';
  const days = pastDays === 'ONE' ? 1 : pastDays === 'TWO' ? 2 : 0;
  return days > 0 ? `&past_days=${days}` : '';
};

/**
 * Extracts field selections from GraphQL info object
 */
export const getFieldSelections = (info: any, typeName: string) => {
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

/**
 * Helper function to get forecast data with caching to avoid duplicate API calls
 */
export const getForecastData = async (
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
