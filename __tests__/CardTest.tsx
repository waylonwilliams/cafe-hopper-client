import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import CardComponent from '@/components/Card';
import { useRouter } from 'expo-router';
import { CafeType } from '@/components/CafePage/CafeTypes';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Card Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCafe: CafeType = {
    id: '1',
    created_at: '2024-10-01T12:00:00Z',
    name: 'Test Cafe',
    hours: 'Monday: 8:00 AM - 8:00 PM\nTuesday: 8:00 AM - 8:00 PM\nWednesday: 8:00 AM - 8:00 PM',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Main St, San Francisco, CA 94105',
    tags: ['☕ Coffee', '📶 Free WiFi'],
    image: '',
    summary: 'A cozy cafe with a great selection of coffee and pastries.',
    rating: 7,
    num_reviews: 30,
  };

  test('renders Card Component correctly', () => {
    const { getByText } = render(<CardComponent cafe={mockCafe} />);

    // Check for name
    expect(getByText('Test Cafe')).toBeTruthy();

    // Check for rating
    expect(getByText('3.5')).toBeTruthy();

    // Check for tags (no text)
    expect(getByText('☕')).toBeTruthy();
    expect(getByText('📶')).toBeTruthy();
  });

  test('renders default image when cafe image is null', () => {
    const { getByTestId } = render(<CardComponent cafe={mockCafe} />);

    // Check for default image
    const image = getByTestId('card-image');
    expect(image.props.source.uri).toBe(
      'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/defaultOshima.png',
    );
  });

  test('navigates to cafe on press', async () => {
    const { getByTestId } = render(<CardComponent cafe={mockCafe} />);
    const pressable = getByTestId('cafe-pressable');

    await act(async () => {
      fireEvent.press(pressable);
    });

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: '/cafe',
      params: {
        id: mockCafe.id,
        created_at: mockCafe.created_at,
        name: mockCafe.name,
        address: mockCafe.address,
        hours: mockCafe.hours,
        latitude: mockCafe.latitude,
        longitude: mockCafe.longitude,
        tags: mockCafe.tags,
        image: mockCafe.image,
        summary: mockCafe.summary,
        rating: mockCafe.rating,
        num_reviews: mockCafe.num_reviews,
      },
    });
  });

  test('handle no rating', () => {
    const cafeNoRating = { ...mockCafe, rating: 0 };
    const { queryByTestId } = render(<CardComponent cafe={cafeNoRating} />);

    expect(queryByTestId('card-rating')).toBeNull();
  });
});
