import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { CafeType, ReviewType } from '@/components/CafePage/CafeTypes';
import EmojiTag from '@/components/EmojiTag';

interface ListCardProps {
  cafe: CafeType;
  review: ReviewType;
}

export default function ListCard({ cafe, review }: ListCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{cafe.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐️{review.score}</Text>
        </View>
      </View>
      <Text style={styles.hours}>{cafe.hours}</Text>
      <Text style={styles.location}>{cafe.address}</Text>

      <View style={styles.tagsContainer}>
        <FlatList
          data={cafe.topTags}
          renderItem={({ item }) => <EmojiTag tag={item} filled={true} />}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    width: '94%', // Adjust width here
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hours: {
    fontSize: 11,
    color: '#9e9e9e',
    marginTop: 5,
  },
  location: {
    fontSize: 11,
    color: '#9e9e9e',
    marginTop: 3,
  },
  ratingContainer: {
    borderWidth: 1,
    borderRadius: 999,
    padding: 6,
    marginTop: 4,
    alignSelf: 'flex-start', // Keeps rating to the left
  },
  ratingText: {
    fontWeight: '600',
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
});
