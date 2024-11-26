import { CafeType } from '@/components/CafePage/CafeTypes';

/**
 * @name CafeSearchRequest
 * @description
 * The CafeSearchRequest type.
 *
 * @example
 * import { CafeSearchRequest } from "@/utils/types";
 */
export type CafeSearchRequest = {
  query?: string;
  radius?: number | 1000;
  geolocation?: {
    lat: number;
    lng: number;
  };
  openNow?: boolean | undefined;
  customTime?: {
    day?: number;
    time?: string;
  };
  tags?: string[];
  sortBy?: string;
  rating?: number;
};

/**
 * @name CafeSearchResponse
 * @description
 * The CafeSearchResponse type.
 *
 * @example
 * import { CafeSearchResponse } from "@/utils/types";
 */
export type CafeSearchResponse = {
  cafes: CafeType[];
  error: string;
};
