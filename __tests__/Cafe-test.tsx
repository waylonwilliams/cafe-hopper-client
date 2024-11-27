import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Cafe from '@/components/CafePage/Cafe'; // Adjust the import path
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/EmojiTag', () => 'EmojiTag');
jest.mock('@/components/Review', () => 'Review');

// So supabase call doesn't fail
jest.mock('@/lib/supabase', () => {
  const supabaseGetSession = jest.fn();
  supabaseGetSession.mockReturnValue({ data: { session: { user: { id: '123' } } } });
  return {
    supabase: {
      auth: {
        getSession: supabaseGetSession,
      },
    },
  };
});

// So database isn't called when interacting with lists and stuff
jest.mock('@/lib/supabase-utils', () => ({
  addCafeToList: jest.fn(),
  checkCafeInList: jest.fn().mockReturnValue(false),
  getOrCreateList: jest.fn(),
  removeCafeFromList: jest.fn(),
}));

describe('Cafe Component', () => {
  const mockLogVisit = jest.fn();

  const cafe: CafeType = {
    id: '1',
    created_at: '2023-10-01T12:00:00Z',
    name: 'The Cozy Corner',
    hours: '8:00 AM - 8:00 PM',
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Main St, San Francisco, CA 94105',
    tags: ['☕ Coffee', '🥐 Pastries', '📶 Free WiFi'],
    image: null,
    summary: 'A cozy cafe with a great selection of coffee and pastries.',
    rating: 8.5,
    num_reviews: 120,
  };

  const reviews: NewReviewType[] = [
    {
      cafe_id: '1',
      created_at: '2023-10-02T14:30:00Z',
      description: 'Great atmosphere and delicious coffee. The pastries are a must-try!',
      id: 101,
      images: [],
      public: true,
      rating: 9,
      tags: ['☕ Coffee', '🥐 Pastries', '📶 Free WiFi'],
      user_id: 'user123',
      likes: 45,
      profiles: {
        name: 'John Doe',
        pfp: null,
      },
      reviewLikes: [{ id: 1 }],
    },
  ];

  test('renders cafe details correctly', () => {
    const { getByText } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={mockLogVisit}
        setViewingImages={jest.fn()}
        userId="111"
        addToList={jest.fn()}
      />,
    );

    expect(getByText('The Cozy Corner')).toBeTruthy();
    expect(getByText('123 Main St, San Francisco, CA 94105')).toBeTruthy();
  });

  it('toggles the like button on click', async () => {
    const { getByText, getByTestId } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={jest.fn()}
        setViewingImages={jest.fn()}
        userId="user123"
        addToList={jest.fn()}
      />,
    );

    const likeButton = getByText('Like');
    // Not liked at first
    expect(getByTestId('heart-outline')).toBeTruthy();

    // Toggle on
    fireEvent.press(likeButton);
    await waitFor(() => {
      expect(getByTestId('heart')).toBeTruthy();
    });

    // Toggle off
    fireEvent.press(likeButton);
    await waitFor(() => {
      expect(getByTestId('heart-outline')).toBeTruthy();
    });
  });

  // test('toggles to-go state', () => {
  //   const { getByText, getByLabelText } = render(
  //     <Cafe
  //       cafe={cafe}
  //       reviews={reviews}
  //       logVisit={mockLogVisit}
  //       setViewingImages={jest.fn()}
  //       userId="111"
  //       addToList={jest.fn()}
  //     />,
  //   );

  //   const toGoButton = getByLabelText('To-go');
  //   fireEvent.press(toGoButton);
  //   expect(getByText('To-go')).toBeTruthy(); // State toggled

  //   fireEvent.press(toGoButton);
  //   expect(getByText('To-go')).toBeTruthy(); // State toggled back
  // });

  // test('calls logVisit when "Log a visit" is pressed', () => {
  //   const { getByText } = render(
  //     <Cafe
  //       cafe={cafe}
  //       reviews={reviews}
  //       logVisit={mockLogVisit}
  //       setViewingImages={jest.fn()}
  //       userId="111"
  //       addToList={jest.fn()}
  //     />,
  //   );

  //   const logVisitButton = getByText('Log a visit');
  //   fireEvent.press(logVisitButton);
  //   expect(mockLogVisit).toHaveBeenCalled();
  // });
});
