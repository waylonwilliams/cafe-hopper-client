import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { CafeType } from '@/components/CafePage/CafeTypes';
import EmojiTag from '@/components/EmojiTag';

interface ListCardProps {
  cafe: CafeType;
}

const ListCard: React.FC<ListCardProps> = ({ cafe }) => {
  //array for mock images
  const mockImageUrls = [
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/listcardDefault.jpg',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/mockCafe.jpg',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/defaultOshima.png',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/IMG_5259.png',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/IMG_5270.png?t=2024-11-28T21%3A05%3A17.882Z',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/IMG_5603.png?t=2024-11-28T21%3A05%3A31.644Z',
    'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/IMG_5630.png?t=2024-11-28T21%3A05%3A41.686Z',
  ];

  // Function to randomly select an image
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * mockImageUrls.length);
    return mockImageUrls[randomIndex];
  };
  // Randomly selected mock image URL
  const mockImageUrl = getRandomImage();

  // Get the current day of the week as string 
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  // Parse the cafe's hours into a dictionary for easy lookup
  const entries = cafe.hours ? cafe.hours.split('\n') : [];
  const scheduleDict: { [key: string]: string } = {};
  entries.forEach((entry) => {
    const [day, ...timeParts] = entry.split(':'); // Split on the first colon
    const time = timeParts.join(':').trim(); // Join the remaining parts and trim
    scheduleDict[day.trim()] = time;
  });

  return (
    <View style={styles.card}>
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
            <Text style={styles.ratingText}>⭐️{cafe.rating || '4.2'}</Text>
          </View>
        </View>
        <Text style={styles.hours}>{scheduleDict[today]}</Text>
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
};

export default ListCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '96%',
    minWidth: '96%',
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
