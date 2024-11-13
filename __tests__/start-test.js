import React from 'react';
import { render } from '@testing-library/react-native';
import GetStartedPage from '@/app/index';

test('should render the image', () => {
  const { getByRole } = render(<GetStartedPage />);

  const image = getByRole('image');
  expect(image).toBeTruthy();
});
