import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, Text, View } from 'react-native';
import EmojiTag from './EmojiTag';
import { NewReviewType } from './CafePage/CafeTypes';

interface Props {
  review: NewReviewType;
}

export default function ReviewComponent({ review }: Props) {
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(5);

  async function handleLike() {
    if (liked) {
      setNumLikes(numLikes - 1);
    } else {
      setNumLikes(numLikes + 1);
    }

    setLiked(!liked);
  }

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
        gap: 15,
        position: 'relative',
      }}>
      {/* Pfp */}
      <View
        style={{
          width: 35,
          height: 35,
          backgroundColor: 'purple',
          borderRadius: 999,
        }}></View>

      <View style={{ flex: 1, gap: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#808080', fontWeight: 700, paddingRight: 4 }}>
              {review.user_id}
            </Text>
            {[...Array(review.rating)].map((_, index) => (
              <Ionicons key={index} name="star" size={11} color="#FFB400" />
            ))}
          </View>

          <Text style={{ color: '#808080' }}>{date}</Text>
        </View>

        <Text style={{ paddingRight: 15 }}>{review.description}</Text>

        {review.images !== null && (
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {review.images.slice(0, 2).map((image, index) => (
              <Image
                source={{ uri: image }}
                key={index}
                style={{
                  width: '38%',
                  height: 96,
                  borderRadius: 10,
                }}
              />
            ))}
            {/* Clicking this would hopefully open full view images */}
            {review.images.length > 2 && (
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: '#D9D9D9',
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
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
