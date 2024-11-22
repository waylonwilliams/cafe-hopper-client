import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CafeType } from '@/components/CafePage/CafeTypes';
//import EmojiTag from '@/components/EmojiTag';

interface CardProps {
  cafe: CafeType;
}

export default function CardComponent({ cafe }: CardProps) {
  const mockImageUrl =
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/mockCafe.jpg';

  return (
    <View style={styles.card}>
      {/*TESTING ONLY, FETCH CAFE IMAGE */}
      <Image source={{ uri: mockImageUrl }} style={styles.image}></Image>

      <View style={styles.content}>
        {/* Cafe Name */}
        <Text style={styles.name}>{cafe.title}</Text>
        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={11} color="gold"></Icon>
          <Text style={styles.rating}>{cafe.rating}</Text>
        </View>
      </View>

      {/* Tags */}
      {cafe.tags !== null && (
        <View style={styles.tagContainer}>
          {cafe.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag.split(' ')[0]} {/* Extract only the emoji */}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 200,
    margin: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    fontSize: 11,
    fontFamily: 'SF-Pro-Display-Regular',
    margin: 7,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },

  rating: {
    fontSize: 9,
    marginLeft: 5,
  },

  tagContainer: {
    marginLeft: 9,
    marginBottom: 5,
    flexDirection: 'row',
  },

  tag: {
    fontSize: 11,
    padding: 1,
  },
});
