import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CardComponent from '@/components/Card';
import Review from '@/components/Review';

export default function Home() {
  {
    /* Dummy Cafes */
  }
  const cafes = [
    {
      name: '11th Hour Coffee',
      localImage: require('../../assets/images/11th-hour.png'),
      rating: 4.6,
      tags: ['🛜', '🪴', '🥐'],
    },
    {
      name: 'The Abbey',
      localImage: require('../../assets/images/abbey.png'),
      rating: 4.7,
      tags: ['📚', '☕', '🛜'],
    },
    {
      name: 'Verve',
      localImage: require('../../assets/images/verve.png'),
      rating: 4.4,
      tags: ['🪴', '☕', '📚'],
    },
  ];

  {
    /* Dummy Review */
  }
  const review = {
    name: 'Jane Doe',
    description:
      'This cafe has quickly become my go-to for a peaceful break. The ambiance is so calm and relaxing, perfect for unwinding or getting some work done.',
    tags: ['🌱 Vegan', '🍵 Matcha', '🛜 Free Wifi', '🌳 Outdoor'],
    numLikes: 169,
    datePosted: '2021-09-01T12:00:00Z',
    score: 5,
    images: [
      'https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12',
      'https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12',
      'https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12',
    ],
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {/* Greeting */}
          <Text style={styles.greeting}>Hello, Jane!</Text>

          {/* Header */}
          <Text style={styles.heading}>Where's your next</Text>
          <Text style={styles.h2}>cafe adventure?</Text>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <Icon name="search" size={20} color="#8a8888"></Icon>
            <View>
              <Text style={styles.search}>Search a cafe, profile, etc.</Text>
            </View>
          </View>

          {/* Popular */}
          <Text style={styles.section}>Popular near you</Text>
          <View style={styles.popInfo}>
            <TouchableOpacity activeOpacity={0.6} style={styles.locButton}>
              <Icon name="location-pin" size={15} color="#8a8888"></Icon>
              <Text style={{ color: '#8a8888' }}>Santa Cruz, CA</Text>
            </TouchableOpacity>

            {/* Turn into button later */}
            <Text style={{ color: '#8a8888' }}>Browse all</Text>
          </View>

          {/* Cafe Carousel */}
          <View>
            <FlatList
              horizontal
              data={cafes}
              renderItem={({ item }) => <CardComponent card={item} />}
              keyExtractor={(item) => item.name}
              style={styles.carousel}
            />
          </View>

          {/* Popular Reviews */}
          <View style={styles.reviewContainer}>
            <Text style={styles.section}>Popular Reviews this Week</Text>

            {/* Turn into button later */}
            <Text style={{ color: '#8a8888' }}>Browse all</Text>
          </View>
          {/* MAP REVIEWS HERE */}
          <View style={styles.placeholder}>{/* <Review review={review}></Review> */}</View>

          <Text style={styles.section}>New from friends</Text>
          {/* Feed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
  heading: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 24,
  },
  h2: {
    color: '#8a8888',
    fontSize: 24,
  },
  searchWrapper: {
    marginTop: 15,
    marginBottom: 25,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
  },
  search: {
    flex: 1,
    color: '#8a8888',
    marginTop: 2,
    marginLeft: 5,
  },
  section: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
  },
  popInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    fontSize: 16,
    color: '#8a8888',
  },
  locButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#e6e6e6',
  },
  carousel: {
    height: 230,
  },
  reviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholder: {
    marginTop: 15,
    marginBottom: 20,
  },
});
