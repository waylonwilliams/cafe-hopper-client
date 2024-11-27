import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Cafe from '@/components/CafePage/Cafe'; // Adjust the import path
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/EmojiTag', () => 'EmojiTag');
jest.mock('@/components/Review', () => 'Review');

jest.mock('@/lib/supabase', () => {
  const supabaseGetSession = jest.fn();
  supabaseGetSession.mockReturnValue({ data: { session: { user: { id: null } } } });
  return {
    supabase: {
      auth: {
        getSession: supabaseGetSession,
      },
    },
  };
});

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

  // test('toggles liked state', () => {
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

  //   const likeButton = getByLabelText('Like');
  //   fireEvent.press(likeButton);
  //   expect(getByText('Like')).toBeTruthy(); // State has toggled

  //   fireEvent.press(likeButton);
  //   expect(getByText('Like')).toBeTruthy(); // State toggled back
  // });

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
