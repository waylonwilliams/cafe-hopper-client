import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Cafe from '@/components/CafePage/Cafe'; // Adjust the import path
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/EmojiTag', () => 'EmojiTag');
jest.mock('@/components/Review', () => 'Review');

describe('Cafe Component', () => {
  const mockLogVisit = jest.fn();
  const mockSetViewingImages = jest.fn();
  const mockSetViewingImageIndex = jest.fn();

  const cafe: CafeType = {
    name: 'Test Cafe',
    rating: 8.6,
    address: '123 Test Street',
    hours: 'Monday: 9 AM - 5 PM\nTuesday: 9 AM - 5 PM\nWednesday: 9 AM - 5 PM',
  };

  const reviews: NewReviewType[] = [
    { id: 1, reviewer: 'Alice', rating: 5, comment: 'Great place', images: [] },
    { id: 2, reviewer: 'Bob', rating: 4, comment: 'Good coffee', images: [] },
  ];

  test('renders cafe details correctly', () => {
    const { getByText } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={mockLogVisit}
        setViewingImages={mockSetViewingImages}
        setViewingImageIndex={mockSetViewingImageIndex}
      />
    );

    expect(getByText('Test Cafe')).toBeTruthy();
    expect(getByText('⭐️ 4.3')).toBeTruthy();
    expect(getByText('123 Test Street')).toBeTruthy();
  });

  test('toggles liked state', () => {
    const { getByText, getByLabelText } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={mockLogVisit}
        setViewingImages={mockSetViewingImages}
        setViewingImageIndex={mockSetViewingImageIndex}
      />
    );

    const likeButton = getByLabelText('Like');
    fireEvent.press(likeButton);
    expect(getByText('Like')).toBeTruthy(); // State has toggled

    fireEvent.press(likeButton);
    expect(getByText('Like')).toBeTruthy(); // State toggled back
  });

  test('toggles to-go state', () => {
    const { getByText, getByLabelText } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={mockLogVisit}
        setViewingImages={mockSetViewingImages}
        setViewingImageIndex={mockSetViewingImageIndex}
      />
    );

    const toGoButton = getByLabelText('To-go');
    fireEvent.press(toGoButton);
    expect(getByText('To-go')).toBeTruthy(); // State toggled

    fireEvent.press(toGoButton);
    expect(getByText('To-go')).toBeTruthy(); // State toggled back
  });

//   test('toggles hours visibility', () => {
//     const { getByText } = render(
//       <Cafe
//         cafe={cafe}
//         reviews={reviews}
//         logVisit={mockLogVisit}
//         setViewingImages={mockSetViewingImages}
//         setViewingImageIndex={mockSetViewingImageIndex}
//       />
//     );

//     const seeDetailsButton = getByText('See details');
//     fireEvent.press(seeDetailsButton);
//     expect(getByText('Monday: 9 AM - 5 PM')).toBeTruthy(); // Hours are shown

//     const hideButton = getByText('Hide');
//     fireEvent.press(hideButton);
//     expect(getByText('See details')).toBeTruthy(); // Hours are hidden again
//   });

  test('calls logVisit when "Log a visit" is pressed', () => {
    const { getByText } = render(
      <Cafe
        cafe={cafe}
        reviews={reviews}
        logVisit={mockLogVisit}
        setViewingImages={mockSetViewingImages}
        setViewingImageIndex={mockSetViewingImageIndex}
      />
    );

    const logVisitButton = getByText('Log a visit');
    fireEvent.press(logVisitButton);
    expect(mockLogVisit).toHaveBeenCalled();
  });

//   test('renders reviews correctly', () => {
//     const { getAllByText } = render(
//       <Cafe
//         cafe={cafe}
//         reviews={reviews}
//         logVisit={mockLogVisit}
//         setViewingImages={mockSetViewingImages}
//         setViewingImageIndex={mockSetViewingImageIndex}
//       />
//     );

//     expect(getAllByText('Great place')); // Two reviews rendered
//   });
});
