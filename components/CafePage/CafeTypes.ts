export type CafeType = {
  id: string;
  name: string;
  address: string;
  hours: string;
  latitude: number;
  longitude: number;
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
  rating: number;
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
