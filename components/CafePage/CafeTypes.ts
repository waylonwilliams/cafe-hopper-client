// update cafe type to include top tags, and include all new database stuff while at it
// tags should be an empty array by default?
// images shouldn't be an array, just the top image
// lets add summary

export type CafeType = {
  id: string;
  created_at: string;
  title: string;
  hours: string;
  latitude: number;
  longitude: number;
  address: string;
  tags: string[] | null;
  image: string | null;
  summary: string | null;
  rating: number; // reviews are on a scale of 1-10 for db, but div 2 for displaying
  num_reviews: number;
};

type ProfileJoinReview = {
  bio: string;
  id: number;
};

export type NewReviewType = {
  cafe_id: string;
  created_at: string;
  description: string;
  id: number;
  images: string[] | null;
  profile_id: number;
  profiles: ProfileJoinReview;
  public: boolean;
  rating: number; // reviews are on a scale of 1-10 for db, but div 2 for displaying
  tags: string[];
  user_id: string;
};

export const cafeTags = [
  '🛜 Free wifi',
  '☕ Excellent coffee',
  '🥐 Good pastries',
  '🍵 Matcha',
  '🍵 Tea',
  '🪴 Ambiance',
  '🎶 Good music',
  '🔌 Plugs',
  '🐶 Pet friendly',
  '🏠 Indoor',
  '🌳 Outdoor',
  '❄️ Air conditioning',
  '📚 Workable',
  '🚗 Parking',
  '♿ Accessible',
  '🪑 Plenty of seating',
  '🤫 Quiet',
  '🎉 Bustling',
  '☕ Chai',
  '🍫 Mocha',
  '🍹 Specialty drinks',
  '🌱 Vegan options',
  '🥖 Gluten free options',
  '☕ Espresso',
  '☕ Latte',
  '☕ Cold brew',
];
