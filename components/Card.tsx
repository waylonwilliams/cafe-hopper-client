import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CafeType } from '@/components/CafePage/CafeTypes';
import { useRouter } from 'expo-router';

interface CardProps {
  cafe: CafeType;
}

export default function CardComponent({ cafe }: CardProps) {
  const router = useRouter();
  const defaultImage =
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/defaultOshima.png';
  const displayRating = cafe.rating ? cafe.rating / 2 : 0;

  return (
    <View style={styles.card}>
      {/* Open cafe on press */}
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/cafe',
            params: {
              id: cafe.id,
              created_at: cafe.created_at ? cafe.created_at : '',
              name: cafe.name,
              address: cafe.address,
              hours: cafe.hours ? cafe.hours : '',
              latitude: cafe.latitude,
              longitude: cafe.longitude,
              tags: cafe.tags ? cafe.tags : [],
              image: cafe.image ? cafe.image : '',
              summary: cafe.summary ? cafe.summary : '',
              rating: cafe.rating,
              num_reviews: cafe.num_reviews,
            },
          });
        }}
        testID="cafe-pressable">
        {/* Cafe Image */}
        <Image
          source={{ uri: cafe.image ? cafe.image : defaultImage }}
          style={styles.image}
          testID="card-image"
        />

        <View style={styles.content}>
          {/* Cafe Name */}
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {cafe.name}
          </Text>

          {/* Rating */}
          {displayRating !== 0 && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={11} color="gold"></Icon>
              <Text testID="card-rating" style={styles.rating}>
                {displayRating.toFixed(1)}
              </Text>
            </View>
          )}
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
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    margin: 5,
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align the name and rating vertically centered
    marginHorizontal: 7, // Adjust horizontal margin to align well
    paddingTop: 8, // Add padding above the content
  },

  name: {
    fontSize: 11,
    fontFamily: 'SF-Pro-Display-Regular',
    flexShrink: 1, // Allow name to shrink if necessary
    maxWidth: 85, // Limit the name's width to prevent overflow
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
