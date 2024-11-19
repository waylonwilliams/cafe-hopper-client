import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUpScreen from '@/app/signUp'; // Update the import path
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('SignUpScreen', () => {
  const mockRouter = { replace: jest.fn() };
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  test('renders correctly with all elements', () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<SignUpScreen />);

    expect(getByText('Create an account')).toBeTruthy();
    expect(getByPlaceholderText('Username or Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Start exploring')).toBeTruthy();
    expect(getByText('Continue as guest')).toBeTruthy();
  });

  test('shows alert when passwords do not match', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password456');
    fireEvent.press(getByText('Start exploring'));

    expect(alertSpy).toHaveBeenCalledWith('Passwords do not match!');
  });

  test('calls signUpWithEmail and navigates to /tabs on successful sign-up', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({ error: null });

    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Start exploring'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('shows alert on sign-up failure', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({ error: { message: 'Sign-up failed' } });

    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    fireEvent.changeText(getByPlaceholderText('Username or Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Start exploring'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Sign-up failed');
    });
  });

  test('navigates to login screen when "Already have an account?" is pressed', () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Already have an account? Login'));

    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  test('navigates to /tabs when "Continue as guest" is pressed', () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Continue as guest'));

    expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
  });
});
