import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import SignUpScreen from '@/app/signUp'; // Adjust path as needed

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      upsert: jest.fn(),
    }),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true), // Mock that fonts are loaded
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    ...jest.requireActual('@expo/vector-icons'),
    Ionicons: Text, // Replace icons with plain Text for tests
  };
});

jest.spyOn(Alert, 'alert');

describe('SignUpScreen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  test('renders all fields and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Start exploring')).toBeTruthy();
    expect(getByText('Continue as guest')).toBeTruthy();
    expect(getByText('Already have an account? Login')).toBeTruthy();
  });

  test('navigates to login screen', () => {
    const { getByText } = render(<SignUpScreen />);
    fireEvent.press(getByText('Already have an account? Login'));

    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  test('shows an alert if passwords do not match', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password321');
    fireEvent.press(getByText('Start exploring'));

    expect(Alert.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  test('signs up user and navigates to tabs if successful', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: 'mock-user-id' } },
      error: null,
    });
    (supabase.from().upsert as jest.Mock).mockResolvedValue({ error: null });

    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Start exploring'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(supabase.from).toHaveBeenCalledWith('cafeList');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('shows alerts for errors during signup or profile creation', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'mock-user-id' } },
      error: null,
    });
    (supabase.from().upsert as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Signup error' },
    });
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
    fireEvent.press(getByText('Start exploring'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Signup error');
    });
  });

  test('allows toggling password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<SignUpScreen />);

    const passwordInput = getByPlaceholderText('Password');
    const toggleIcon = getByTestId('toggle-password-visibility');
    const toggleConfirmIcon = getByTestId('toggle-confirm-password-visibility');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });
});
