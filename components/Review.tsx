import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';
import EmojiTag from './EmojiTag';
import { NewReviewType } from './CafePage/CafeTypes';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface Props {
  review: NewReviewType;
  setViewingImages: (arg: string[]) => void;
}

/**
Example of how to fetch reviews to pass to this component
This fetches review, corresponding profile, and the current user's corresponding like

 const { data, error } = await supabase
 .from('reviews')
 .select('*, profiles (name, pfp), reviewLikes (id)')
 .eq('cafe_id', cafe.id);

 */

export default function ReviewComponent({ review, setViewingImages }: Props) {
  const [liked, setLiked] = useState(review.reviewLikes.length > 0);
  const [numLikes, setNumLikes] = useState(review.likes);

  const numStars = Math.floor(review.rating / 2);
  const halfStar = review.rating % 2 !== 0;

  // Like or unlike a review, store that in the database
  // I wrote a SQL function to handle total likes on the actual review row
  // So all we have to do is add the current user's like and it will be handled
  async function handleLike() {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    if (userError || !userData || !userData.session?.user.id) {
      router.push('/signUp');
    }
    const uid = userData.session?.user.id;

    if (liked) {
      setNumLikes(numLikes - 1);

      const { error } = await supabase
        .from('reviewLikes')
        .delete()
        .eq('review_id', review.id)
        .eq('user_id', uid);
      if (error) console.error('Error unliking review', error);
    } else {
      setNumLikes(numLikes + 1);

      const { error } = await supabase.from('reviewLikes').insert({
        user_id: uid,
        review_id: review.id,
      });
      if (error) console.error('Error liking review', error);
    }

    setLiked(!liked);
  }

  // Make sure the images exist, for typescript
  function handleImagePress() {
    if (review.images) setViewingImages(review.images);
  }

  // Clicking on name / pfp goes to their profile
  async function handleProfileClick() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session', error);
      return;
    }

    if (data && data.session?.user.id === review.user_id) {
      // If its their review go to their profile
      router.replace('/profile');
    } else {
      // if its someone else's review go to their profile
      router.push({
        pathname: '/anotherUserProfile',
        params: {
          uid: review.user_id,
        },
      });
    }
  }

  // Formatted date of review
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View
      style={{
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        paddingBottom: 20,
        flexDirection: 'row',
        gap: 10,
        position: 'relative',
      }}>
      {/* Profile info */}
      <Pressable onPress={handleProfileClick}>
        <Image
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'purple',
            borderRadius: 999,
          }}
          source={
            review.profiles.pfp ? { uri: review.profiles.pfp } : require('../assets/images/cup.png')
          }
        />
      </Pressable>
      <View style={{ flex: 1, gap: 8, position: 'relative' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            maxWidth: '100%',
            overflow: 'hidden',
          }}>
          <View style={{ flexShrink: 1, flexGrow: 1 }}>
            <Text style={{ color: '#808080', fontWeight: 700, paddingRight: 4 }}>
              {review.profiles.name}
            </Text>
          </View>

          {/* Review content */}
          <View style={{ flexDirection: 'row', gap: 5, flexShrink: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[...Array(numStars)].map((_, index) => (
                <Ionicons key={index} name="star" size={11} color="#FFB400" />
              ))}
              {halfStar && <Ionicons key={numStars} name="star-half" size={11} color="#FFB400" />}
            </View>

            <Text style={{ color: '#808080' }}>{date}</Text>
          </View>
        </View>

        <Text style={{ paddingRight: 15 }}>{review.description}</Text>

        {review.images !== null && (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {review.images.slice(0, 2).map((image, index) => (
              <Pressable
                key={index}
                style={{ width: '34%', height: 96, position: 'relative' }}
                onPress={handleImagePress}>
                <Image
                  source={{ uri: image }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                />
              </Pressable>
            ))}
            {review.images.length > 2 && (
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: '#D9D9D9',
                  borderRadius: 10,
                  justifyContent: 'center',
                }}
                onPress={handleImagePress}>
                <Text style={{ textAlign: 'center', fontSize: 24, color: '#808080' }}>
                  +{review.images.length - 2}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            flexWrap: 'wrap',
            paddingTop: 5,
          }}>
          {review.tags.map((tag, index) => (
            <EmojiTag key={index} tag={tag} />
          ))}
        </View>

        {/* Like button */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            onPress={handleLike}>
            <Ionicons name="heart" size={16} color={liked ? 'red' : '#808080'} />
            <Text style={{ color: liked ? 'red' : '#808080' }}>Like review</Text>
          </Pressable>

          <Text>{numLikes} likes</Text>
        </View>
      </View>
    </View>
  );
}
