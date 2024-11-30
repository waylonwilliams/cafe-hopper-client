import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AddToList from '@/components/CafePage/AddToList';
import { CafeType } from '@/components/CafePage/CafeTypes';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock supabase and related utilities
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    getSession: jest.fn().mockReturnValue({ data: { session: { user: { id: '123' } } } }),
  },
}));

jest.mock('@/lib/supabase-utils', () => ({
  addCafeToList: jest.fn(),
  removeCafeFromList: jest.fn(),
  checkCafeInList: jest.fn().mockResolvedValue(false),
}));

jest.mock('@/components/CafePage/NewList', () => 'NewList');

describe('AddToList Component', () => {
  const mockSetAddingToList = jest.fn();
  const mockUpdateCafeView = jest.fn();

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

  test('renders component with loading spinner initially', async () => {
    const { getByTestId } = render(
      <AddToList setAddingToList={jest.fn()} cafe={cafe} userId="123" updateCafeView={jest.fn()} />,
    );

    // Verify the loading spinner is shown initially
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  test('calls handleAddToList when "Done" is pressed', async () => {
    const { getByTestId } = render(
      <AddToList
        setAddingToList={mockSetAddingToList}
        cafe={cafe}
        userId="123"
        updateCafeView={jest.fn()}
      />,
    );

    // Wait for the "Done" button to render
    const doneButton = await waitFor(() => getByTestId('done-button'));

    // Simulate button press
    await act(async () => {
      fireEvent.press(doneButton);
    });

    // Check that the function is called
    expect(mockSetAddingToList).toHaveBeenCalledWith(false);
  });

  test('opens and closes the NewList component', async () => {
    const { getByTestId, queryByTestId } = render(
      <AddToList
        setAddingToList={jest.fn()}
        cafe={{
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
        }}
        userId="123"
        updateCafeView={jest.fn()}
      />,
    );

    // Wait for loading spinner to disappear
    await waitFor(() => expect(queryByTestId('activity-indicator')).toBeFalsy());

    // Find and press the "New List" button
    const newListButton = getByTestId('new-list-button');
    await act(async () => {
      fireEvent.press(newListButton);
    });

    // Verify that the "New List" component opens
    await waitFor(() => {
      expect(queryByTestId('new-list')).toBeTruthy();
    });
  });
});
