export type CafeType = {
  name: string;
  address: string;
  reviews: {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
  };
};

export type ReviewType = {
  name: string;
  description: string;
  tags: string[]; // hopefully we can store as "<emoji> <tag>" all in one string
  numLikes: number;
  datePosted: string; // supabase timestamp string
  score: number;
  images: string[]; // urls
};
