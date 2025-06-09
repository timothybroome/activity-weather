import type { Meta, StoryObj } from '@storybook/react';
import WeatherChart from './weather-chart';

const meta: Meta<typeof WeatherChart> = {
  title: 'Components/WeatherChart',
  component: WeatherChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WeatherChart>;

// Mock weather data for our stories
const mockWeatherData = {
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
};

// Default story with standard weather data
export const Default: Story = {
  args: {
    weatherData: mockWeatherData,
  },
};

// Rainy weather scenario
export const RainyWeather: Story = {
  args: {
    weatherData: {
      ...mockWeatherData,
      daily: {
        ...mockWeatherData.daily,
        precipitation_sum: [5, 8, 12, 15, 10, 7, 3],
        weather_code: [61, 63, 65, 80, 81, 63, 61]
      }
    }
  },
};

// Hot weather scenario
export const HotWeather: Story = {
  args: {
    weatherData: {
      ...mockWeatherData,
      daily: {
        ...mockWeatherData.daily,
        temperature_2m_max: [30, 32, 33, 31, 30, 29, 28],
        temperature_2m_min: [20, 22, 23, 21, 20, 19, 18],
        precipitation_sum: [0, 0, 0, 0.1, 0, 0, 0],
        weather_code: [0, 1, 0, 1, 0, 1, 0]
      }
    }
  },
};

// Cold weather scenario
export const ColdWeather: Story = {
  args: {
    weatherData: {
      ...mockWeatherData,
      daily: {
        ...mockWeatherData.daily,
        temperature_2m_max: [5, 4, 3, 2, 1, 0, -1],
        temperature_2m_min: [-5, -6, -7, -8, -9, -10, -11],
        precipitation_sum: [0.5, 1, 2, 0, 0.5, 1, 0],
        weather_code: [71, 73, 75, 71, 77, 71, 3]
      }
    }
  },
};

// Windy weather scenario
export const WindyWeather: Story = {
  args: {
    weatherData: {
      ...mockWeatherData,
      daily: {
        ...mockWeatherData.daily,
        wind_speed_10m_max: [25, 30, 35, 40, 38, 32, 28]
      }
    }
  },
};
