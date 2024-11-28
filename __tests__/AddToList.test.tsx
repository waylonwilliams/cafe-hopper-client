import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddToList from '@/components/CafePage/AddToList';
import { supabase } from '@/lib/supabase';
import { addCafeToList, removeCafeFromList, checkCafeInList } from '@/lib/supabase-utils';

// Mock external dependencies
jest.mock('@/lib/supabase-utils', () => ({
  addCafeToList: jest.fn(),
  removeCafeFromList: jest.fn(),
  checkCafeInList: jest.fn(),
}));
jest.mock('@/lib/supabase', () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  })),
}));

describe('AddToList Component', () => {
  const mockProps = {
    setAddingToList: jest.fn(),
    cafe: {
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
    },
    userId: 'user123',
    updateCafeView: jest.fn(),
  };

  it('renders correctly with initial loading state', () => {
    const { getByText, getByTestId } = render(<AddToList {...mockProps} />);
    expect(getByText('Save to List')).toBeTruthy();
    expect(getByTestId('activity-indicator')).toBeTruthy(); // Assuming ActivityIndicator has a testID
  });

  it('displays lists after fetching data', async () => {
    (supabase.from('cafeList').select as jest.Mock).mockResolvedValue({
      data: [
        { id: 'list1', list_name: 'Liked', public: true },
        { id: 'list2', list_name: 'To-Go', public: false },
      ],
      error: null,
    });
    (checkCafeInList as jest.Mock).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const { getByText } = render(<AddToList {...mockProps} />);
    await waitFor(() => expect(getByText('Liked')).toBeTruthy());
    expect(getByText('To-Go')).toBeTruthy();
  });

  it('allows toggling list selection', async () => {
    const { getByText } = render(<AddToList {...mockProps} />);
    const likedListToggle = getByText('Liked');

    fireEvent.press(likedListToggle);
    expect(mockProps.updateCafeView).toHaveBeenCalledWith('Liked', true);
  });

  it('calls addCafeToList and removeCafeFromList on submission', async () => {
    const { getByText } = render(<AddToList {...mockProps} />);
    const doneButton = getByText('Done');

    fireEvent.press(doneButton);

    await waitFor(() => {
      expect(addCafeToList).toHaveBeenCalled();
      expect(removeCafeFromList).toHaveBeenCalled();
    });
  });

  it('displays an alert on success', async () => {
    const { getByText } = render(<AddToList {...mockProps} />);
    const doneButton = getByText('Done');

    fireEvent.press(doneButton);

    await waitFor(() => expect(mockProps.setAddingToList).toHaveBeenCalledWith(false));
  });

  it('handles errors gracefully', async () => {
    (addCafeToList as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    const { getByText } = render(<AddToList {...mockProps} />);
    const doneButton = getByText('Done');

    fireEvent.press(doneButton);

    await waitFor(() => {
      expect(mockProps.setAddingToList).not.toHaveBeenCalled();
    });
  });
});
