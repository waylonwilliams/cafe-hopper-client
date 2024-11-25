import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import GetStartedPage from '@/app/index'; // Adjust path as necessary

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('GetStartedPage', () => {
  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  // test('calls checkLogin and navigates if session exists', async () => {
  //   // Mock session exists
  //   (supabase.auth.getSession as jest.Mock).mockResolvedValue({
  //     data: { session: { user: { id: '123' } } },
  //   });

  //   const { queryByText } = render(<GetStartedPage />);

  //   // Ensure content is not displayed initially
  //   expect(queryByText('your next favorite cafe is just around the corner...')).toBeNull();

  //   // Wait for the component to finish checking login
  //   await waitFor(() => {
  //     expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
  //   });
  // });

  // test('calls checkLogin and sets checked to true if no session exists', async () => {
  //   // Mock no session
  //   (supabase.auth.getSession as jest.Mock).mockResolvedValue({
  //     data: { session: null },
  //   });

  //   const { getByText } = render(<GetStartedPage />);

  //   // Wait for the "checked" state to be true
  //   await waitFor(() => {
  //     expect(getByText('your next favorite cafe is just around the corner...')).toBeTruthy();
  //   });
  // });

  test('renders content and navigates to signUp on button press', async () => {
    // Mock no session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    const { getByText } = render(<GetStartedPage />);

    // Wait for content to render
    // await waitFor(() => {
    //   expect(getByText('your next favorite cafe is just around the corner...')).toBeTruthy();
    // });

    // Simulate button press
    const button = getByText('Get started');
    fireEvent.press(button);

    // Check navigation to signUp
    expect(mockRouter.replace).toHaveBeenCalledWith('/signUp');
  });
});
