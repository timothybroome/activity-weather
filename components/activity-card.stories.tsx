import type { Meta, StoryObj } from '@storybook/react';
import { ActivityCard } from './activity-card';

const meta: Meta<typeof ActivityCard> = {
  title: 'Components/ActivityCard',
  component: ActivityCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityCard>;

// Mock data for our stories
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

// Base story with default props
export const Default: Story = {
  args: {
    ranking: {
      activity: "skiing",
      averageScore: 85,
      dailyScores: [90, 85, 88, 70, 65, 75, 80],
      reasoning: "Good snow conditions and clear visibility for most of the week."
    },
    index: 0,
    delay: 0,
    weatherData: mockWeatherData,
  },
};

// Excellent ranking
export const ExcellentRanking: Story = {
  args: {
    ...Default.args,
    ranking: {
      activity: "skiing",
      averageScore: 85,
      dailyScores: [90, 85, 88, 70, 65, 75, 80],
      reasoning: "Excellent snow conditions with perfect powder and visibility."
    },
  },
};

// Good ranking
export const GoodRanking: Story = {
  args: {
    ...Default.args,
    ranking: {
      activity: "surfing",
      averageScore: 65,
      dailyScores: [70, 65, 68, 60, 55, 65, 70],
      reasoning: "Moderate wave conditions with some good days for beginners."
    },
  },
};

// Poor ranking
export const PoorRanking: Story = {
  args: {
    ...Default.args,
    ranking: {
      activity: "hiking",
      averageScore: 35,
      dailyScores: [40, 35, 38, 30, 25, 35, 40],
      reasoning: "Heavy rainfall and muddy trails make hiking difficult this week."
    },
  },
};
