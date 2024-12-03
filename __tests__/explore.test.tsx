import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Explore from '../app/(tabs)/explore';

// Mocking @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => 'Mocked MaterialIcon',
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 37.7749, longitude: -122.4194 },
    })
  ),
  Accuracy: {
    High: 'High',
    Balanced: 'Balanced',
    Low: 'Low',
  },
}));

describe('Explore Screen', () => {
  test('renders the map view correctly', () => {
    const { getByText, getByTestId } = render(<Explore />);
    
    // Switch to 'map' view
    const mapButton = getByText('Map');
    fireEvent.press(mapButton);

    // Check if the MapView is rendered
    const mapView = getByTestId('map-view');
    expect(mapView).toBeTruthy();
  });

  test('renders the search bar correctly', () => {
    const { getByTestId } = render(<Explore />);
    const searchBar = getByTestId('search-bar');
    expect(searchBar).toBeTruthy();
  });

  test('renders the toggle buttons for view modes', () => {
    const { getByText } = render(<Explore />);
    expect(getByText('List')).toBeTruthy();
    expect(getByText('Map')).toBeTruthy();
  });

  test('renders the filter dropdown when search is focused', () => {
    const { getByPlaceholderText, getByText } = render(<Explore />);
    const searchBar = getByPlaceholderText('Search a cafe, characteristic, etc.');

    // Simulate focus on the search bar
    fireEvent(searchBar, 'focus');

    // Use a regex to match the text containing "Hours"
    const filterTitle = getByText(/Hours/i);
    expect(filterTitle).toBeTruthy();
  });

 test('updates selected hour filter when clicked', async () => {
   const { getByPlaceholderText, getByText } = render(<Explore />);

   // Focus the search bar to make the dropdown visible
   const searchBar = getByPlaceholderText('Search a cafe, characteristic, etc.');
   fireEvent(searchBar, 'focus');

   // Wait for the dropdown to render
   const openNowFilter = await waitFor(() => getByText('Open now'));
   fireEvent.press(openNowFilter);

   // Add assertions for filter state updates
   expect(openNowFilter).toBeTruthy();
 });


  

});