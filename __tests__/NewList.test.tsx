import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewList from '@/components/CafePage/NewList';
import { Alert } from 'react-native';

// Mock Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({}),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  },
}));

describe('NewList Component', () => {
  const mockOnClose = jest.fn();
  const mockOnListCreated = jest.fn();

  it('renders the NewList component correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <NewList
        visible={true}
        onClose={mockOnClose}
        userId="123"
        onListCreated={mockOnListCreated}
      />,
    );

    // Check if modal elements are rendered
    expect(getByText('New List')).toBeTruthy();
    expect(getByText('Name this List')).toBeTruthy();
    expect(getByPlaceholderText('Enter list name')).toBeTruthy();
    expect(getByPlaceholderText('Enter description')).toBeTruthy();
    expect(getByText('Public')).toBeTruthy();
    expect(getByText('Private')).toBeTruthy();
    expect(getByText('Create')).toBeTruthy();
    expect(getByTestId('close-new-list')).toBeTruthy();
  });

  it('closes the modal when close button is pressed', () => {
    const { getByTestId } = render(
      <NewList
        visible={true}
        onClose={mockOnClose}
        userId="123"
        onListCreated={mockOnListCreated}
      />,
    );

    // Simulate pressing the close button
    fireEvent.press(getByTestId('close-new-list'));

    // Verify the onClose function is called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles input changes correctly', () => {
    const { getByPlaceholderText } = render(
      <NewList
        visible={true}
        onClose={mockOnClose}
        userId="123"
        onListCreated={mockOnListCreated}
      />,
    );

    const nameInput = getByPlaceholderText('Enter list name');
    const descriptionInput = getByPlaceholderText('Enter description');

    fireEvent.changeText(nameInput, 'My New List');
    fireEvent.changeText(descriptionInput, 'This is a test description.');

    expect(nameInput.props.value).toBe('My New List');
    expect(descriptionInput.props.value).toBe('This is a test description.');
  });

  it('toggles privacy settings correctly', () => {
    const { getByText } = render(
      <NewList
        visible={true}
        onClose={mockOnClose}
        userId="123"
        onListCreated={mockOnListCreated}
      />,
    );

    const publicOption = getByText('Public');
    const privateOption = getByText('Private');

    // Default isPublic state should be true
    expect(publicOption.props.style).toContainEqual({ color: 'black' });

    // Simulate toggling to private
    fireEvent.press(privateOption);

    expect(privateOption.props.style).toContainEqual({ color: 'black' });
  });

  it('displays an alert if the list name is empty on create', async () => {
    const alertMock = jest.spyOn(Alert, 'alert');
    const { getByText } = render(
      <NewList
        visible={true}
        onClose={mockOnClose}
        userId="123"
        onListCreated={mockOnListCreated}
      />,
    );

    const createButton = getByText('Create');
    fireEvent.press(createButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Please enter a list name.');
    });

    alertMock.mockRestore();
  });
});
