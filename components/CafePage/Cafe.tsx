import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import EmojiTag from '@/components/EmojiTag';
import Review from '@/components/Review';
import { CafeType, NewReviewType } from './CafeTypes';
import {
  addCafeToList,
  checkCafeInList,
  getOrCreateList,
  removeCafeFromList,
} from '@/lib/supabase-utils';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface Props {
  cafe: CafeType;
  reviews: NewReviewType[];
  logVisit: () => void;
  setViewingImages: (arg: string[]) => void;
  userId: string;
  addToList: () => void;
}

export default function Cafe({
  cafe,
  reviews,
  logVisit,
  setViewingImages,
  userId,
  addToList,
}: Props) {
  const [liked, setLiked] = useState(false);
  const [togo, setTogo] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewScales, setReviewScales] = useState([0, 0, 0, 0, 0]);
  const [noReviews, setNoReviews] = useState(true);

  // Load initial "liked" and "to-go" states
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const uid = (await supabase.auth.getSession()).data.session?.user.id;
        if (!uid) return;
        const isLiked = await checkCafeInList(cafe.id, 'liked');
        const isTogo = await checkCafeInList(cafe.id, 'to-go');
        setLiked(isLiked);
        setTogo(isTogo);
      } catch (error) {
        console.error('Error loading initial state:', error);
      }
    };

    loadInitialState();
  }, [cafe.id, userId]);

  // Shortcut to add to liked list
  const handleLike = async () => {
    try {
      const uid = (await supabase.auth.getSession()).data.session?.user.id;
      if (!uid) {
        router.push('/login');
      } else {
        const likedId = await getOrCreateList('liked');

        if (liked) {
          // If currently liked, remove it from the "liked" list
          await removeCafeFromList(cafe.id, likedId);
        } else {
          // Otherwise, add it to the "liked" list
          await addCafeToList(cafe.id, likedId);
        }
        setLiked(!liked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Shortcut to add to to-go list
  const handleTogo = async () => {
    try {
      const uid = (await supabase.auth.getSession()).data.session?.user.id;
      if (!uid) {
        router.push('/login');
      } else {
        const togoId = await getOrCreateList('to-go');

        if (togo) {
          // If currently marked as to-go, remove it from the "to-go" list
          await removeCafeFromList(cafe.id, togoId);
        } else {
          // Otherwise, add it to the "to-go" list
          await addCafeToList(cafe.id, togoId);
        }
        setTogo(!togo);
      }
    } catch (error) {
      console.error('Error toggling to-go:', error);
    }
  };

  const handleAddToList = async () => {
    const uid = (await supabase.auth.getSession()).data.session?.user.id;
    if (!uid) {
      router.push('/login');
    } else {
      addToList();
    }
  };

  const handleLogVisit = async () => {
    const uid = (await supabase.auth.getSession()).data.session?.user.id;
    if (!uid) {
      router.push('/login');
    } else {
      logVisit();
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Parses the hours string from the database
  const today = days[new Date().getDay()];
  const entries = cafe.hours.split('\n');
  const scheduleDict: { [key: string]: string } = {};
  entries.forEach((entry) => {
    const [day, ...timeParts] = entry.split(':');
    const time = timeParts.join(':').trim();
    scheduleDict[day.trim()] = time;
  });

  // When the reviews are fetched, calculate the total rating and scale and things like that
  useEffect(() => {
    const numReviews = reviews.length;
    setLoadingReviews(true);

    setTotalReviews(numReviews);
    if (numReviews > 0) setNoReviews(false);
    else setNoReviews(true);

    setAverageRating(reviews.reduce((acc, review) => acc + review.rating, 0) / numReviews / 2);

    const counts = [5, 4, 3, 2, 1].map(
      (rating) => reviews.filter((review) => Math.ceil(review.rating / 2) === rating).length,
    );
    setReviewScales(counts.map((count) => (count / numReviews) * 100));

    setLoadingReviews(false);
  }, [reviews]);

  return (
    <ScrollView
      style={{
        padding: 5,
        paddingHorizontal: 25,
      }}
      contentContainerStyle={{
        gap: 10,
        paddingBottom: 50,
      }}>
      {/* Main cafe info */}
      <Text style={{ fontSize: 36, fontWeight: 500 }}>{cafe.name}</Text>

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Pressable onPress={handleLike}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={32} color="black" />
            <Text style={{ color: '#808080' }}>Like</Text>
          </View>
        </Pressable>

        <Pressable onPress={handleTogo}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Ionicons name={togo ? 'bookmark' : 'bookmark-outline'} size={30} color="black" />
            <Text style={{ color: '#808080' }}>To-go</Text>
          </View>
        </Pressable>

        <Pressable onPress={handleAddToList}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <Ionicons name="add-circle-outline" size={32} color="black" />
            <Text style={{ color: '#808080' }}>Add to List</Text>
          </View>
        </Pressable>

        <Pressable onPress={handleLogVisit}>
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

      {cafe.tags !== null && (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            flexWrap: 'wrap',
            paddingTop: 5,
          }}>
          {cafe.tags.map((tag, index) => (
            <EmojiTag key={index} tag={tag} />
          ))}
        </View>
      )}

      {/* Reviews */}
      {!loadingReviews &&
        (noReviews ? (
          <View style={{ width: '100%', alignItems: 'center', gap: 4 }}>
            <Text style={{ color: '#808080' }}>No reviews yet</Text>
            <Pressable onPress={handleLogVisit}>
              <Text style={{ color: '#808080', fontWeight: 600, textDecorationLine: 'underline' }}>
                Be the first to log a visit!
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 24, fontWeight: 600, paddingTop: 5 }}>Reviews</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ width: '65%', gap: 10, position: 'relative' }}>
                  {[5, 4, 3, 2, 1].map((rating, index) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 4,
                        alignItems: 'center',
                      }}
                      key={index}>
                      <Text style={{ color: '#808080' }}>{rating}</Text>
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
                            width: `${reviewScales[5 - rating]}%`,
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
                    <Text style={{ fontSize: 24, fontWeight: 600 }}>
                      {averageRating.toFixed(1)}
                    </Text>
                  </View>

                  <Text style={{ color: '#808080' }}>{totalReviews} reviews</Text>
                </View>
              </View>
            </View>

            {cafe.summary && (
              <View
                style={{
                  width: '100%',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 10,
                  gap: 4,
                  marginTop: 5,
                  backgroundColor: '#F5F5F5',
                }}>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>People are saying</Text>

                <Text style={{ padding: 3 }}>{cafe.summary}</Text>
              </View>
            )}

            <Text style={{ paddingTop: 10, fontSize: 18, fontWeight: 600 }}>Popular reviews</Text>

            {reviews.map((review, index) => (
              <Review review={review} key={index} setViewingImages={setViewingImages} />
            ))}
          </>
        ))}
    </ScrollView>
  );
}
