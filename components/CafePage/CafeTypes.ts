export type CafeType = {
  id: string;
  name: string;
  address: string;
  hours: string;
  topTags: string[]; // hopefully we can store as "<emoji> <tag>" all in one string
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
