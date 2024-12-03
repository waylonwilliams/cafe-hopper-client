import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/login'; // Adjust the path
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
    },
  },
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
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

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login screen correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Continue exploring')).toBeTruthy();
    expect(getByText("Don't have an account? Sign Up")).toBeTruthy();
  });

  test('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Password');
    const toggleIcon = getByTestId('toggle-password-visibility');

    // Initially, password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Click to toggle visibility
    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    // Click again to hide password
    fireEvent.press(toggleIcon);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  test('calls signInWithEmail and navigates on successful login', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ error: null });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    fireEvent.press(getByText('Continue exploring'));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  test('shows an alert on login error', async () => {
    const mockAlert = jest.spyOn(Alert, 'alert');
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

    fireEvent.press(getByText('Continue exploring'));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(mockAlert).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  test('navigates to the sign-up page', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Don't have an account? Sign Up"));

    expect(router.replace).toHaveBeenCalledWith('/signUp');
  });
});
