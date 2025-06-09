import type { Meta, StoryObj } from '@storybook/react';
import { ActivityDetailPanel } from './activity-detail-panel';

const meta: Meta<typeof ActivityDetailPanel> = {
  title: 'Components/ActivityDetailPanel',
  component: ActivityDetailPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityDetailPanel>;

// Mock data for our stories
const mockWeatherData = {
  location: "London, United Kingdom",
  latitude: 51.5074,
  longitude: -0.1278,
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
    wind_speed_10m_max: [10, 12, 8, 15, 20, 18, 10],
    weather_code: [0, 1, 0, 61, 63, 80, 1]
  }
};

const mockRankings = {
  skiing: {
    activity: "skiing",
    averageScore: 85,
    dailyScores: [90, 85, 88, 70, 65, 75, 80],
    reasoning: "Excellent snow conditions with cold temperatures and recent snowfall make this week perfect for skiing."
  },
  surfing: {
    activity: "surfing",
    averageScore: 65,
    dailyScores: [70, 65, 68, 60, 55, 65, 70],
    reasoning: "Good wave conditions expected with moderate winds, though some days will have less ideal conditions."
  },
  outdoorSightseeing: {
    activity: "outdoor sightseeing",
    averageScore: 45,
    dailyScores: [50, 45, 48, 40, 35, 45, 50],
    reasoning: "Fair conditions for outdoor activities with some precipitation expected mid-week."
  },
  indoorSightseeing: {
    activity: "indoor sightseeing",
    averageScore: 25,
    dailyScores: [30, 25, 28, 20, 15, 25, 30],
    reasoning: "Poor weather conditions with heavy rain and wind make indoor activities the better choice."
  }
};

const mockActivityDetails = {
  skiing: {
    description: "The skiing conditions in London are surprisingly good this week despite the urban setting. While London itself doesn't have natural ski slopes, there are several indoor ski facilities and nearby artificial slopes that offer excellent skiing experiences.\n\nThe cold temperatures forecasted (lows of 11-15°C) make the artificial snow conditions at these facilities optimal. The best days for skiing would be Thursday and Friday when temperatures are at their lowest, ensuring the snow quality remains excellent.",
    alternatives: [
      {
        name: "Chamonix",
        country: "France",
        region: "Auvergne-Rhône-Alpes",
        reason: "World-class skiing with fresh powder and excellent facilities",
        displayName: "Chamonix, France"
      },
      {
        name: "Zermatt",
        country: "Switzerland",
        region: "Valais",
        reason: "Perfect snow conditions with stunning views of the Matterhorn",
        displayName: "Zermatt, Switzerland"
      },
      {
        name: "Whistler",
        country: "Canada",
        region: "British Columbia",
        reason: "Extensive terrain with reliable snow conditions",
        displayName: "Whistler, Canada"
      }
    ]
  },
  surfing: {
    description: "While London itself doesn't have surfing beaches, the forecast indicates good conditions for surfing at nearby coastal areas like Cornwall and Devon. The moderate winds (10-15 km/h) and relatively warm temperatures make for decent wave conditions.\n\nThe best days for surfing would be Monday and Tuesday when winds are optimal and precipitation is minimal. Later in the week, increased winds might create choppier conditions that are less ideal for beginners.",
    alternatives: [
      {
        name: "Newquay",
        country: "United Kingdom",
        region: "Cornwall",
        reason: "UK's surfing capital with consistent waves",
        displayName: "Newquay, Cornwall, UK"
      },
      {
        name: "Biarritz",
        country: "France",
        region: "Nouvelle-Aquitaine",
        reason: "World-class beach breaks with warmer water temperatures",
        displayName: "Biarritz, France"
      },
      {
        name: "Peniche",
        country: "Portugal",
        region: "Centro",
        reason: "Consistent surf conditions with options for all skill levels",
        displayName: "Peniche, Portugal"
      }
    ]
  }
};

// Base story with default props
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Panel closed'),
    activity: "skiing",
    ranking: mockRankings.skiing,
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: mockActivityDetails.skiing,
      },
    ],
  },
};

// Surfing activity
export const SurfingActivity: Story = {
  args: {
    ...Default.args,
    activity: "surfing",
    ranking: mockRankings.surfing,
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: mockActivityDetails.surfing,
      },
    ],
  },
};

// Outdoor Sightseeing
export const OutdoorSightseeing: Story = {
  args: {
    ...Default.args,
    activity: "outdoor sightseeing",
    ranking: mockRankings.outdoorSightseeing,
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: {
          description: "Outdoor sightseeing in London this week will be challenging due to the variable weather conditions. The forecast shows rain mid-week with temperatures ranging from 11-25°C.\n\nThe best days for outdoor activities would be Monday, Tuesday, and Sunday when precipitation is minimal and temperatures are more comfortable. Popular outdoor attractions like Hyde Park, Buckingham Palace, and the Tower of London are best visited on these days.",
          alternatives: [
            {
              name: "Barcelona",
              country: "Spain",
              region: "Catalonia",
              reason: "Sunny weather perfect for exploring Gaudí architecture",
              displayName: "Barcelona, Spain"
            },
            {
              name: "Rome",
              country: "Italy",
              region: "Lazio",
              reason: "Warm temperatures ideal for exploring ancient ruins",
              displayName: "Rome, Italy"
            }
          ]
        },
      },
    ],
  },
};

// Indoor Sightseeing
export const IndoorSightseeing: Story = {
  args: {
    ...Default.args,
    activity: "indoor sightseeing",
    ranking: mockRankings.indoorSightseeing,
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: {
          description: "With the heavy rain and wind forecasted for London this week, indoor sightseeing is an excellent choice. The British Museum, National Gallery, and Tate Modern offer world-class exhibits in climate-controlled environments.\n\nWednesday and Thursday will have the heaviest rainfall, making these days perfect for exploring London's indoor attractions. The cooler temperatures (11-19°C) also make indoor activities more comfortable.",
          alternatives: [
            {
              name: "Paris",
              country: "France",
              region: "Île-de-France",
              reason: "World-class museums including the Louvre and Musée d'Orsay",
              displayName: "Paris, France"
            },
            {
              name: "Vienna",
              country: "Austria",
              region: "Vienna",
              reason: "Stunning palaces and art museums with baroque architecture",
              displayName: "Vienna, Austria"
            }
          ]
        },
      },
    ],
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        delay: 5000, // Simulate a long loading time
        status: 200,
        response: mockActivityDetails.skiing,
      },
    ],
  },
};

// Error state
export const Error: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 500,
        response: { error: "Failed to fetch activity details" },
      },
    ],
  },
};

// Closed state
export const Closed: Story = {
  args: {
    ...Default.args,
    isOpen: false,
  },
};
