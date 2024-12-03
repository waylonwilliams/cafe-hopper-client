import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import GetStartedPage from '@/app/index'; // Adjust the path to the file

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('GetStartedPage', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  test('redirects to tabs page if user is logged in', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'mock-user-id' } },
    });

    render(<GetStartedPage />);

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('renders the "Get started" page if no user is logged in', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

    const { getByText, getByTestId } = render(<GetStartedPage />);

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    expect(getByText('your next favorite cafe is just around the corner...')).toBeTruthy();
    expect(getByText('Get started')).toBeTruthy();

    // Simulate button press
    fireEvent.press(getByTestId('button'));
    expect(mockReplace).toHaveBeenCalledWith('/signUp');
  });
});
