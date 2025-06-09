export interface WeatherData {
  location: string
  latitude: number
  longitude: number
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
    weather_code: number[]
  }
  current_weather?: {
    temperature: number
    wind_speed: number
    wind_direction: number
    weather_code: number
    time: string
  }
}

export interface ActivityRanking {
  activity: string
  averageScore: number
  dailyScores: number[]
  reasoning: string
}

export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}
