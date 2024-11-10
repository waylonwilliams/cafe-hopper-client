import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import EmojiTag from '@/components/EmojiTag';
import Review from '@/components/Review';
import { CafeType, NewReviewType } from './CafeTypes';
import { supabase } from '@/lib/supabase';

interface Props {
  cafe: CafeType;
  reviews: NewReviewType[];
  logVisit: () => void;
  setViewingImages: (arg: string[]) => void;
  setViewingImageIndex: (arg: number | null) => void;
  userId: string; // Add userId here
}

// Function to get or create a list for "liked" or "to-go"
const getOrCreateList = async (userId: string, listName: string) => {
  try {
    // Check if the list already exists for the user
    const { data: existingList, error } = await supabase
      .from('cafeList')
      .select('id')
      .eq('user_id', userId)
      .eq('list_name', listName)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (existingList) {
      return existingList.id;
    } else {
      // If not exists, create the list
      const { data, error: insertError } = await supabase
        .from('cafeList')
        .insert([{ user_id: userId, list_name: listName }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data.id;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting or creating list:', error.message);
    } else {
      console.error('Error getting or creating list:', error);
    }
    throw error;
  }
};

// Function to check if a cafe is in a specific list
const checkCafeInList = async (cafeId: string, userId: string, listName: string) => {
  const listId = await getOrCreateList(userId, listName);

  const { data, error } = await supabase
    .from('cafeListEntries')
    .select('id')
    .eq('cafe_id', cafeId)
    .eq('list_id', listId)
    .eq('user_id', userId)
    .single();

  return !!data; // Returns true if the entry exists, false otherwise
};

// Function to add a cafe to a specific list
const addCafeToList = async (cafeId: string, userId: string, listName: string) => {
  try {
    const listId = await getOrCreateList(userId, listName);

    // Add the cafe to the list
    const { data, error } = await supabase
      .from('cafeListEntries')
      .insert([{ cafe_id: cafeId, list_id: listId, user_id: userId }]);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding cafe to list:', error.message);
    } else {
      console.error('Error adding cafe to list:', error);
    }
    throw error;
  }
};

// Function to remove a cafe from a specific list 
const removeCafeFromList = async (cafeId: string, userId: string, listName: string) => {
  try {
    const listId = await getOrCreateList(userId, listName);

    const { data, error } = await supabase
      .from('cafeListEntries')
      .delete()
      .eq('cafe_id', cafeId)
      .eq('list_id', listId)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error removing cafe from list:', error.message);
    } else {
      console.error('Error removing cafe from list:', error);
    }
    throw error;
  }
};

export default function Cafe({
  cafe,
  reviews,
  logVisit,
  setViewingImages,
  setViewingImageIndex,
  userId, // Destructure userId here
}: Props) {
  const [liked, setLiked] = useState(false);
  const [togo, setTogo] = useState(false);
  const [showHours, setShowHours] = useState(false);

  // Load initial "liked" and "to-go" states
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const isLiked = await checkCafeInList(cafe.id, userId, 'liked');
        const isTogo = await checkCafeInList(cafe.id, userId, 'to-go');
        setLiked(isLiked);
        setTogo(isTogo);
      } catch (error) {
        console.error('Error loading initial state:', error);
      }
    };

    loadInitialState();
  }, [cafe.id, userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        // If currently liked, remove it from the "liked" list
        await removeCafeFromList(cafe.id, userId, 'liked');
      } else {
        // Otherwise, add it to the "liked" list
        await addCafeToList(cafe.id, userId, 'liked');
      }
      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleTogo = async () => {
    try {
      if (togo) {
        // If currently marked as to-go, remove it from the "to-go" list
        await removeCafeFromList(cafe.id, userId, 'to-go');
      } else {
        // Otherwise, add it to the "to-go" list
        await addCafeToList(cafe.id, userId, 'to-go');
      }
      setTogo(!togo); // Toggle the togo state
    } catch (error) {
      console.error('Error toggling to-go:', error);
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const today = days[new Date().getDay()];
  const entries = cafe.hours.split('\n');
  const scheduleDict: { [key: string]: string } = {};
  entries.forEach((entry) => {
    const [day, ...timeParts] = entry.split(':'); // Split on the first colon
    const time = timeParts.join(':').trim(); // Join the remaining parts and trim
    scheduleDict[day.trim()] = time;
  });

  // How you could calculate width of bar and such
  // const maxReviewValue = Math.max(...Object.values(cafe.reviews));
  // const totalReviews = Object.values(cafe.reviews).reduce(
  //   (acc, review) => acc + review,
  //   0
  // );
  // const averageReview =
  //   totalReviews === 0
  //     ? 0
  //     : Object.entries(cafe.reviews).reduce(
  //         (acc, [key, value]) => acc + keyToNumber[key] * value,
  //         0
  //       ) / totalReviews;

  return (
    <ScrollView
      style={{
        padding: 5,
        paddingHorizontal: 25,
      }}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: 110,
      }}>
      {/* Name of cafe header */}
      <Text style={{ fontSize: 36, fontWeight: 500 }}>{cafe.name}</Text>

      {/* First bar, reviews, quick */}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          <View
            style={{
              borderColor: '#000000',
              borderRadius: 20,
              borderWidth: 2,
              padding: 7,
              paddingHorizontal: 9,
            }}>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>
              ⭐️ {(cafe.rating / 2).toFixed(1)}
            </Text>
          </View>
          <Text style={{ color: '#808080', paddingTop: 4 }}>269 reviews</Text>
        </View>

        <Pressable onPress={handleLike}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={32} color="black" />
            <Text style={{ color: '#808080' }}>Like</Text>
          </View>
        </Pressable>

        <Pressable onPress={handleTogo}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Ionicons name={togo ? 'bookmark' : 'bookmark-outline'} size={32} color="black" />
            <Text style={{ color: '#808080' }}>To-go</Text>
          </View>
        </Pressable>

        <Pressable onPress={logVisit}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#C9C9C9',
              borderRadius: 999,
              padding: 8,
              paddingHorizontal: 10,
            }}>
            <Ionicons name="paper-plane-outline" size={28} color="white" />
            <Text style={{ color: 'white', fontWeight: 600 }}>Log a visit</Text>
          </View>
        </Pressable>
      </View>

      {/* Opening time and address */}
      <View style={{ paddingTop: 5, gap: 5 }}>
        {showHours && (
          <View style={{ gap: 4 }}>
            {days.map((day, index) => (
              <View style={{ width: '100%', flexDirection: 'row' }} key={index}>
                <Text style={{ width: '30%', color: '#808080' }}>{day}</Text>
                <Text style={{ color: '#808080' }}>{scheduleDict[day]}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {!showHours && <Text style={{ color: '#808080' }}>{scheduleDict[today]}</Text>}
          <Pressable onPress={() => setShowHours(!showHours)}>
            <Text style={{ color: '#808080', fontWeight: '700' }}>
              {showHours ? 'Hide' : 'See details'}
            </Text>
          </Pressable>
        </View>

        <Text style={{ color: '#808080' }}>{cafe.address}</Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 5,
          flexWrap: 'wrap',
          paddingTop: 5,
        }}>
        <EmojiTag tag="🍵 Matcha" />
        <EmojiTag tag="🛜 Free Wifi" />
        <EmojiTag tag="🌱 Vegan" />
        <EmojiTag tag="🌳 Outdoor" />
        <EmojiTag tag="🐶 Pet Friendly" />
        <EmojiTag tag="🏠 Indoor" />
        <EmojiTag tag="🚗 Parking" />
        <EmojiTag tag="❄️ Air Conditioned" />
        <EmojiTag tag="♿️ Wheelchair Accessible" />
      </View>

      {/* Reviews scales here */}
      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 600, paddingTop: 5 }}>Reviews</Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '65%', gap: 10, position: 'relative' }}>
            {[5, 4, 3, 2, 1].map((review, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'center',
                }}
                key={index}>
                <Text style={{ color: '#808080' }}>{review}</Text>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#C9C9C9',
                    borderRadius: 3,
                    margin: 2,
                    position: 'relative',
                    height: 7,
                  }}>
                  <View
                    style={{
                      width: `${'80'}%`,
                      backgroundColor: '#FFB400',
                      borderRadius: 3,
                      padding: 2,
                      height: 7,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>

          <View
            style={{
              width: '25%',
              paddingLeft: 10,
              paddingTop: 5,
              gap: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}>
              <Ionicons name="star" size={24} color="#FFB400" />
              <Text style={{ fontSize: 24, fontWeight: 600 }}>{(4.358).toFixed(1)}</Text>
            </View>

            <Text style={{ color: '#808080' }}>{51} reviews</Text>
          </View>
        </View>
      </View>

      {/* Reviews */}
      <Text style={{ paddingTop: 10, fontSize: 18, fontWeight: 600 }}>Popular reviews</Text>

      {/* Should map them */}
      {reviews.map((review, index) => (
        <Review
          review={review}
          key={index}
          setViewingImages={setViewingImages}
          setViewingImageIndex={setViewingImageIndex}
        />
      ))}
    </ScrollView>
  );
}
