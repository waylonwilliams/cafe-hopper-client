import React from 'react';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import { NewReviewType } from './CafePage/CafeTypes';
import EmojiTag from './EmojiTag';
import Ionicons from '@expo/vector-icons/Ionicons';

export type Feed = {
  id: number;
  name?: string;
  pfp?: string;
  action: 'rated' | 'reviewed' | string;
  cafe?: string;
  location?: string;
  date: string;
  review: Partial<NewReviewType>;
  user_id?: string;
};

interface FeedProps {
  feed: Feed;
  setViewingImages: (arg: string[]) => void;
}

export default function FeedComponent({ feed, setViewingImages }: FeedProps) {
  const renderStars = (rating: number) => {
    const numStars = Math.floor(rating / 2);
    const halfStar = rating % 2 !== 0;

    return (
      <>
        {Array.from({ length: numStars }).map((_, index) => (
          <Ionicons key={index} name="star" size={11} color="#FFB400" />
        ))}
        {halfStar && <Ionicons name="star-half" size={11} color="#FFB400" />}
      </>
    );
  };

  function handleImagePress() {
    if (feed.review.images) setViewingImages(feed.review.images);
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {feed.pfp ? (
          <Image source={{ uri: feed.pfp }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
        <View style={styles.headerInfo}>
          <View style={styles.topRow}>
            <View style={styles.actionWrapper}>
              <Text style={styles.userName}>{feed.name}</Text>
              <Text style={styles.action}>{feed.action}</Text>
            </View>

            {/* Rating */}
            {feed.review.rating && (
              <View style={styles.rating}>{renderStars(feed.review.rating)}</View>
            )}
          </View>
          <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">
            {feed.cafe}
          </Text>
        </View>
      </View>

      {/* Review Content */}
      <View style={styles.content}>
        {/* Description */}
        {feed.review.description && (
          <Text style={styles.reviewText}>{feed.review.description}</Text>
        )}

        {/* Images */}
        {feed.review.images && feed.review.images.length > 0 && (
          <View style={{ flexDirection: 'row' }}>
            {feed.review.images.map((imageUri, index) => (
              <Pressable key={index} onPress={handleImagePress}>
                <Image key={index} source={{ uri: imageUri }} style={styles.postImage} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Tags */}
        {feed.review.tags && (
          <View style={styles.tagContainer}>
            {feed.review.tags.map((tag, index) => (
              <EmojiTag key={index} tag={tag} />
            ))}
          </View>
        )}
      </View>

      {/* Date and location */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={styles.location} numberOfLines={1} ellipsizeMode="tail">
          {feed.location}
        </Text>
        <Text style={styles.date}>{feed.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 5,
    overflow: 'hidden',
    borderRadius: 15,
    flexShrink: 1,
  },

  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  avatar: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 999,
    marginRight: 8,
  },

  headerInfo: {
    flexDirection: 'column',
    padding: 2,
  },

  actionWrapper: {
    marginTop: 5,
    flexDirection: 'row',
    width: '70%',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },

  action: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  placeName: {
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },

  location: {
    fontSize: 12,
    color: '#999',
    width: '85%',
  },

  ratingBox: {
    flexShrink: 0,
    position: 'absolute',
    right: -50,
  },

  rating: {
    marginTop: 5,
    flexDirection: 'row',
    fontSize: 12,
    color: '#999',
  },

  content: {},
  reviewText: {
    fontSize: 14,
  },

  postImage: {
    marginTop: 10,
    width: 126,
    height: 103,
    borderRadius: 10,
    margin: 5,
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 5,
  },

  date: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
  },
});
