import type { Meta, StoryObj } from '@storybook/react';
import ActivityRankings from './activity-rankings';
import { mockWeatherData } from '@/mocks/weather';

const meta: Meta<typeof ActivityRankings> = {
  title: 'Components/ActivityRankings',
  component: ActivityRankings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityRankings>;

// Mock activity rankings
const mockRankings = [
  {
    activity: "skiing",
    averageScore: 85,
    dailyScores: [90, 85, 88, 70, 65, 75, 80],
    reasoning: "Excellent snow conditions with perfect powder and visibility."
  },
  {
    activity: "surfing",
    averageScore: 65,
    dailyScores: [70, 65, 68, 60, 55, 65, 70],
    reasoning: "Moderate wave conditions with some good days for beginners."
  },
  {
    activity: "hiking",
    averageScore: 35,
    dailyScores: [40, 35, 38, 30, 25, 35, 40],
    reasoning: "Heavy rainfall and muddy trails make hiking difficult this week."
  },
];

// Mock activity details for the API response
const mockActivityDetails = {
  skiing: {
    name: "Skiing",
    description: "Skiing is a recreational activity and competitive winter sport in which the participant uses skis to glide on snow.",
    bestConditions: {
      temperature: "Below freezing to slightly above (25-35°F / -4 to 2°C)",
      precipitation: "Fresh snow, ideally powder",
      wind: "Low to moderate",
      terrain: "Varied terrain with good snow coverage"
    },
    tips: [
      "Check the snow report before heading out",
      "Layer clothing for changing conditions",
      "Stay hydrated even in cold weather",
      "Take lessons if you're a beginner"
    ],
    gear: [
      "Skis and poles",
      "Ski boots",
      "Helmet",
      "Waterproof clothing",
      "Goggles"
    ],
    safety: [
      "Always ski with a partner",
      "Stay on marked trails",
      "Be aware of changing weather conditions",
      "Know your skill level and don't attempt runs beyond your ability"
    ],
    history: "Skiing has been a method of transportation for thousands of years, with the oldest known skis dating back to 6000 BCE in Russia. It evolved into a recreational activity in the mid-1800s and became a competitive sport in the early 20th century."
  },
  surfing: {
    name: "Surfing",
    description: "Surfing is a surface water sport in which an individual uses a board to ride on the forward section, or face, of a moving wave of water.",
    bestConditions: {
      temperature: "60-80°F / 15-27°C water temperature",
      waves: "Clean, consistent waves with good form",
      wind: "Offshore winds (blowing from land to sea)",
      tide: "Depends on the break, but often mid to high tide"
    },
    tips: [
      "Check surf reports before heading out",
      "Start with a larger, more stable board",
      "Practice paddling and pop-ups on land first",
      "Always surf with others nearby"
    ],
    gear: [
      "Surfboard",
      "Leash",
      "Wetsuit (depending on water temperature)",
      "Surf wax",
      "Rash guard"
    ],
    safety: [
      "Learn about rip currents and how to escape them",
      "Always check local conditions and hazards",
      "Respect other surfers and follow surf etiquette",
      "Never surf alone, especially as a beginner"
    ],
    history: "Surfing originated in Polynesia and was first documented by Europeans in 1767 when Captain Samuel Wallis and the crew of the Dolphin witnessed surfing in Tahiti. It was later popularized in Hawaii and has since spread globally as both a recreational activity and competitive sport."
  },
  hiking: {
    name: "Hiking",
    description: "Hiking is a long, vigorous walk, usually on trails or footpaths in the countryside.",
    bestConditions: {
      temperature: "50-70°F / 10-21°C",
      precipitation: "Dry conditions with clear visibility",
      wind: "Light to moderate",
      terrain: "Well-maintained trails with varied scenery"
    },
    tips: [
      "Check weather forecasts before heading out",
      "Tell someone where you're going and when you'll return",
      "Bring more water than you think you'll need",
      "Pack layers for changing conditions"
    ],
    gear: [
      "Hiking boots or sturdy shoes",
      "Backpack",
      "Water bottle or hydration system",
      "Navigation tools (map, compass, GPS)",
      "First aid kit"
    ],
    safety: [
      "Stay on marked trails",
      "Be aware of wildlife and know how to respond to encounters",
      "Learn basic first aid",
      "Carry emergency supplies even on short hikes"
    ],
    history: "Hiking became a popular recreational activity in the 18th century, particularly in Europe with the Romantic appreciation of nature. The first hiking club, the Alpine Club, was founded in the UK in 1857, and hiking has since become one of the most popular outdoor activities worldwide."
  }
};

// Base story with default props
export const Default: Story = {
  args: {
    rankings: mockRankings,
    weatherData: mockWeatherData,
    loading: false,
    error: "",
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: (req: { body: string }) => {
          // Extract the activity from the request body to return the appropriate mock data
          const body = JSON.parse(req.body);
          const activity = body.activity as keyof typeof mockActivityDetails;
          return mockActivityDetails[activity] || mockActivityDetails.skiing;
        },
      },
    ],
  },
};

// With fewer activities
export const FewerActivities: Story = {
  args: {
    ...Default.args,
    rankings: mockRankings.slice(0, 2),
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    ...Default.args,
    error: "Failed to load activity rankings. Please try again later.",
  },
};
