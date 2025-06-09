import type { WeatherData } from '@/types/weather'

export const mockWeatherData: WeatherData = {
  location: "Aspen, Colorado",
  latitude: 39.1911,
  longitude: -106.8175,
  daily: {
    time: [
      "2025-06-05",
      "2025-06-06",
      "2025-06-07",
      "2025-06-08",
      "2025-06-09",
      "2025-06-10",
      "2025-06-11"
    ],
    temperature_2m_max: [22, 24, 25, 21, 19, 20, 23],
    temperature_2m_min: [12, 14, 15, 13, 11, 12, 13],
    precipitation_sum: [0, 0.2, 0, 5, 10, 2, 0],
    weather_code: [0, 1, 0, 61, 63, 80, 1],
    wind_speed_10m_max: [10, 12, 8, 15, 20, 18, 10]
  },
  current_weather: {
    temperature: 21.5,
    wind_speed: 10.2,
    wind_direction: 180,
    weather_code: 1,
    time: "2025-06-05T12:00"
  }
}
