import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { CafeType } from '@/components/CafePage/CafeTypes';
import EmojiTag from '@/components/EmojiTag';

interface ListCardProps {
  cafe: CafeType;
}

export default function ListCard({ cafe }: ListCardProps) {
  const mockImageUrl =
    'https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12';

  return (
    <View style={styles.card}>
      {/* <Image source={{ uri: mockImageUrl }} style={{ height: 100 }} resizeMode="contain" /> */}

      <View style={{ flex: 1, height: 170, paddingBottom: 8 }}>
        <Image
          source={{ uri: cafe.image ? cafe.image : mockImageUrl }}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.name}>{cafe.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐️4.2</Text>
          </View>
        </View>
        <Text style={styles.hours}>{cafe.hours}</Text>
        <Text style={styles.location}>{cafe.address}</Text>

        {cafe.tags && (
          <View style={styles.tagsContainer}>
            {cafe.tags.map((tag, index) => (
              <View key={index} style={styles.tagWrapper}>
                <EmojiTag tag={tag} />
              </View>
            ))}
          </View>
        )}
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
    marginVertical: 8,
    width: '94%', // Adjust width here
    overflow: 'hidden',
    position: 'relative',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  tagWrapper: {
    marginTop: 2,
    marginRight: 3,
  },
});
