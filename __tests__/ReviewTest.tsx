import React from 'react';
import ReviewComponent from '@/components/Review';
import { NewReviewType } from '@/components/CafePage/CafeTypes';
import { render } from '@testing-library/react-native';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/EmojiTag', () => 'EmojiTag');

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

describe('Review Component', () => {
  const review: NewReviewType = {
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
  };

  it('Renders review contents', () => {
    const { getByText } = render(<ReviewComponent review={review} setViewingImages={jest.fn()} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(
      getByText('Great atmosphere and delicious coffee. The pastries are a must-try!'),
    ).toBeTruthy();
    expect(getByText('Like review')).toBeTruthy();
  });
});
