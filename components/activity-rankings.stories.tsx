import type { Meta, StoryObj } from '@storybook/react';
import ActivityRankings from './activity-rankings';

const meta: Meta<typeof ActivityRankings> = {
  title: 'Compositions/ActivityRankings',
  component: ActivityRankings,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActivityRankings>;

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

const mockRankings = [
  {
    activity: "skiing",
    averageScore: 85,
    dailyScores: [90, 85, 88, 70, 65, 75, 80],
    reasoning: "Excellent snow conditions with cold temperatures and recent snowfall make this week perfect for skiing."
  },
  {
    activity: "surfing",
    averageScore: 65,
    dailyScores: [70, 65, 68, 60, 55, 65, 70],
    reasoning: "Good wave conditions expected with moderate winds, though some days will have less ideal conditions."
  },
  {
    activity: "outdoor sightseeing",
    averageScore: 45,
    dailyScores: [50, 45, 48, 40, 35, 45, 50],
    reasoning: "Fair conditions for outdoor activities with some precipitation expected mid-week."
  },
  {
    activity: "indoor sightseeing",
    averageScore: 25,
    dailyScores: [30, 25, 28, 20, 15, 25, 30],
    reasoning: "Poor weather conditions with heavy rain and wind make indoor activities the better choice."
  }
];

// Mock activity details responses for different activities
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
  },
  "outdoor sightseeing": {
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
  "indoor sightseeing": {
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
  }
};

// Base story with default props
export const Default: Story = {
  args: {
    rankings: mockRankings,
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: (req) => {
          // Extract the activity from the request body to return the appropriate mock data
          const body = JSON.parse(req.body);
          const activity = body.activity;
          return mockActivityDetails[activity] || mockActivityDetails.skiing;
        },
      },
    ],
  },
};

// With fewer activities
export const FewerActivities: Story = {
  args: {
    rankings: mockRankings.slice(0, 2), // Only skiing and surfing
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: (req) => {
          const body = JSON.parse(req.body);
          const activity = body.activity;
          return mockActivityDetails[activity] || mockActivityDetails.skiing;
        },
      },
    ],
  },
};

// With more activities
export const MoreActivities: Story = {
  args: {
    rankings: [
      ...mockRankings,
      {
        activity: "hiking",
        averageScore: 72,
        dailyScores: [75, 70, 73, 65, 60, 70, 75],
        reasoning: "Good conditions for hiking with moderate temperatures and only occasional light rain."
      },
      {
        activity: "cycling",
        averageScore: 68,
        dailyScores: [72, 68, 70, 62, 58, 68, 72],
        reasoning: "Decent cycling weather with some challenging wind conditions mid-week."
      }
    ],
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        status: 200,
        response: (req) => {
          const body = JSON.parse(req.body);
          const activity = body.activity;
          
          // Additional mock data for the new activities
          const additionalMockData = {
            hiking: {
              description: "London offers several excellent hiking opportunities in and around the city. The weather this week is generally favorable for hiking, with moderate temperatures and only occasional light rain.\n\nThe best days for hiking would be Monday, Tuesday, and Sunday when conditions are driest. Richmond Park, Hampstead Heath, and the Thames Path offer beautiful urban hiking experiences.",
              alternatives: [
                {
                  name: "Lake District",
                  country: "United Kingdom",
                  region: "Cumbria",
                  reason: "England's premier hiking destination with stunning lakes and mountains",
                  displayName: "Lake District, UK"
                },
                {
                  name: "Snowdonia",
                  country: "United Kingdom",
                  region: "Wales",
                  reason: "Dramatic mountain scenery with well-maintained trails",
                  displayName: "Snowdonia, Wales"
                }
              ]
            },
            cycling: {
              description: "Cycling in London this week will offer decent conditions with some challenging days. The forecast shows moderate temperatures and variable winds, with some rain mid-week.\n\nThe best cycling days would be Monday, Tuesday, and Sunday when winds are lighter and there's minimal precipitation. The city's numerous cycling paths, including those in Hyde Park and along the Thames, provide good urban cycling options.",
              alternatives: [
                {
                  name: "Amsterdam",
                  country: "Netherlands",
                  region: "North Holland",
                  reason: "World's most bike-friendly city with dedicated cycling infrastructure",
                  displayName: "Amsterdam, Netherlands"
                },
                {
                  name: "Copenhagen",
                  country: "Denmark",
                  region: "Capital Region",
                  reason: "Excellent cycling conditions with dedicated lanes throughout the city",
                  displayName: "Copenhagen, Denmark"
                }
              ]
            }
          };
          
          return activity in additionalMockData 
            ? additionalMockData[activity] 
            : (mockActivityDetails[activity] || mockActivityDetails.skiing);
        },
      },
    ],
  },
};

// With API error
export const WithAPIError: Story = {
  args: {
    rankings: mockRankings,
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
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

// With loading delay
export const WithLoadingDelay: Story = {
  args: {
    rankings: mockRankings,
    weatherData: mockWeatherData,
    onCitySelect: (city) => console.log('Selected city:', city),
  },
  parameters: {
    mockData: [
      {
        url: '/api/activity-details',
        method: 'POST',
        delay: 3000, // 3 second delay to show loading state
        status: 200,
        response: (req) => {
          const body = JSON.parse(req.body);
          const activity = body.activity;
          return mockActivityDetails[activity] || mockActivityDetails.skiing;
        },
      },
    ],
  },
};
