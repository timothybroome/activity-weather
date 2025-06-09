import type { Meta, StoryObj } from '@storybook/react';
import { AutocompleteSearch } from './autocomplete-search';
import { cities } from '@/data/cities';

const meta: Meta<typeof AutocompleteSearch> = {
  title: 'Components/AutocompleteSearch',
  component: AutocompleteSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AutocompleteSearch>;

// Mock handler for the onSearch prop
const mockOnSearch = async (city: { name: string, latitude: number, longitude: number, country: string, region?: string }) => {
  console.log(`Searching for city: ${city.name}, ${city.country}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
};

// Base story with default props
export const Default: Story = {
  args: {
    onSearch: mockOnSearch,
    loading: false,
    error: '',
  },
};

// Loading state
export const Loading: Story = {
  args: {
    onSearch: mockOnSearch,
    loading: true,
    error: '',
  },
};

// Error state
export const WithError: Story = {
  args: {
    onSearch: mockOnSearch,
    loading: false,
    error: 'Could not find weather data for this location.',
  },
};

// With pre-populated localStorage (for recent searches)
export const WithRecentSearches: Story = {
  args: {
    onSearch: mockOnSearch,
    loading: false,
    error: '',
  },
  play: async ({ canvasElement }) => {
    // Set up recent searches in localStorage for this story
    localStorage.setItem('recent-searches', JSON.stringify([
      'New York, United States',
      'Tokyo, Japan',
      'London, United Kingdom',
      'Paris, France',
      'Sydney, Australia'
    ]));
  },
};

// Clear localStorage after the story to avoid affecting other stories
WithRecentSearches.parameters = {
  nextjs: {
    appDirectory: true,
  },
  docs: {
    source: {
      code: `
// This story sets up recent searches in localStorage
export const WithRecentSearches: Story = {
  args: {
    onSearch: mockOnSearch,
    loading: false,
    error: '',
  },
  play: async ({ canvasElement }) => {
    // Set up recent searches in localStorage for this story
    localStorage.setItem('recent-searches', JSON.stringify([
      'New York, United States',
      'Tokyo, Japan',
      'London, United Kingdom',
      'Paris, France',
      'Sydney, Australia'
    ]));
  },
};
      `,
    },
  },
};
