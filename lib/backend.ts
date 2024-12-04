import { CafeSearchRequest, CafeSearchResponse } from './backend-types';
import Constants from 'expo-constants';

export const searchCafesFromBackend = async (
  request: CafeSearchRequest,
): Promise<CafeSearchResponse> => {
  const API_URL = `http://${Constants.expoConfig?.hostUri!.split(':').shift()}:3000`;
  const response = await fetch(`${API_URL}/cafes/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to search cafes: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
