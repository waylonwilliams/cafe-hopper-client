import React from 'react';
import { render } from '@testing-library/react-native';
import ListCard from '@/components/ListCard';
import { CafeType } from '@/components/CafePage/CafeTypes';

describe('ListCard Component', () => {
  const mockCafe: CafeType = {
    id: '1',
    created_at: '2023-10-01T12:00:00Z',
    name: 'The Cozy Corner',
    hours: 'Monday: 8:00 AM - 8:00 PM\nTuesday: 8:00 AM - 8:00 PM\nWednesday: 8:00 AM - 8:00 PM',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Main St, San Francisco, CA 94105',
    tags: ['☕ Coffee', '🥐 Pastries', '📶 Free WiFi'],
    image: null,
    summary: 'A cozy cafe with a great selection of coffee and pastries.',
    rating: 4.5,
    num_reviews: 120,
  };

  test('renders the ListCard component correctly', () => {
    const { getByText, getByTestId } = render(<ListCard cafe={mockCafe} />);

    // Check for the name
    expect(getByText('The Cozy Corner')).toBeTruthy();

    // Check for the rating
    expect(getByText('⭐️4.5')).toBeTruthy();

    // Check for the address
    expect(getByText('123 Main St, San Francisco, CA 94105')).toBeTruthy();

    // Check for tags
    expect(getByText('☕ Coffee')).toBeTruthy();
    expect(getByText('🥐 Pastries')).toBeTruthy();
    expect(getByText('📶 Free WiFi')).toBeTruthy();
  });

  test('renders a default image when cafe image is not provided', () => {
    const { getByTestId } = render(<ListCard cafe={mockCafe} />);

    // Check that the Image component renders
    const image = getByTestId('list-card-image');
    expect(image).toBeTruthy();
  });

  test('renders all tags if provided', () => {
    const { getByText } = render(<ListCard cafe={mockCafe} />);

    // Check for each tag
    expect(getByText('☕ Coffee')).toBeTruthy();
    expect(getByText('🥐 Pastries')).toBeTruthy();
    expect(getByText('📶 Free WiFi')).toBeTruthy();
  });

  test('handles missing tags gracefully', () => {
    const cafeWithoutTags = { ...mockCafe, tags: [] };
    const { queryByText } = render(<ListCard cafe={cafeWithoutTags} />);

    // Verify that no tags are rendered
    expect(queryByText('☕ Coffee')).toBeNull();
    expect(queryByText('🥐 Pastries')).toBeNull();
    expect(queryByText('📶 Free WiFi')).toBeNull();
  });

  test('displays a placeholder rating when no rating is provided', () => {
    const cafeWithoutRating = { ...mockCafe, rating: null };
    const { getByText } = render(<ListCard cafe={cafeWithoutRating} />);

    // Check for default rating
    expect(getByText('⭐️4.2')).toBeTruthy();
  });
});
