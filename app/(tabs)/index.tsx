import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Review from '@/components/Review';
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import Card from '@/components/Card';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import FeedComponent from '@/components/FeedPost';

//const API_URL = `http://${Constants.expoConfig?.hostUri!.split(':').shift()}:3000`;
const API_URL = `http://localhost:3000`;

//Dummy Cafes
const mockCafes: CafeType[] = [
  {
    id: '1',
    name: "Cafe Oshima's",
    address: '2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam',
    hours: `8:00AM - 10:00PM`,
    tags: ['🍵', '🛜', '🌱', '🌳', '🐶'],
    created_at: '',
    latitude: 10.7757,
    longitude: 106.686,
    rating: 4.5,
    num_reviews: 10,
    image: null,
    summary: null,
  },
  {
    id: '2',
    name: 'Verve',
    address: '123 Brew St., Coffee City, CA',
    hours: '7:00AM - 9:00PM',
    tags: ['☕', '🪴', '🎶'],
    created_at: '',
    latitude: 10.7757,
    longitude: 106.686,
    rating: 4.5,
    num_reviews: 10,
    image: null,
    summary: null,
  },
  {
    id: '3',
    name: 'Blackbird',
    address: '123 Brew St., Coffee City, CA',
    hours: '7:00AM - 9:00PM',
    tags: ['🌳', '🐶', '🎶'],
    created_at: '',
    latitude: 10.7757,
    longitude: 106.686,
    rating: 4.5,
    num_reviews: 10,
    image: null,
    summary: null,
  },
];
//Dummy Feed Posts
const mockFeed = [
  {
    id: 1,
    name: 'Jane',
    action: "reviewed",
    location: 'Kyoto, Japan',
    cafe: 'Maccha House',
    date: 'Oct 6',
    review: {
      images: ['https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/public/mockMatcha.jpg'],
      tags: ['🍵 Matcha', '🪴 Ambiance'],
      rating: 9,
    }
  },
  {
    id: 2,
    name: 'Nana',
    action: "rated",
    location: 'Santa Cruz, California',
    cafe: 'Cat and Cloud',
    date: 'Oct 3',
    review: {
      description: 'Amazing coffee, loved the ambiance!',
      images: [],
      tags: ['☕ Coffee', '🪴 Ambiance'],
      rating: 8,
    },
  },
  {
    id: 1,
    name: 'John',
    action: "saved",
    location: 'Seoul, Korea',
    cafe: 'Dotopda',
    date: 'Sep 28',
  },
];

export default function Home() {
  const [userRegion, setUserRegion] = useState({
    latitude: 5.603717,
    longitude: -0.186964,
  });
  const [reviews, setReviews] = useState<NewReviewType[]>([]);
  const [loc, setLoc] = useState<string | null>(null);
  const [, setViewingImages] = useState<string[]>([]);
  const [, setViewingImageIndex] = useState<number | null>(null);
  const [popCafes, setPopCafes] = useState<CafeType[]>(mockCafes);
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<string | false>(false);
  const [name, setName] = useState<string>('');
  const [owner, setOwner] = useState(false);

  // Get Name
  useFocusEffect(
    useCallback(() => {
      const fetchName = async () => {
        try {
          // Check if logged in
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.log('Error fetching session', error);
            setName('Guest');
            return;
          }

          if (!data.session) {
            console.log('Guest Session', error);
            setName('Guest');
            return;
          }

          const uid = data.session.user.id;
          setLoggedIn(uid);

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name') // Only fetch the 'name' field
            .eq('user_id', uid)
            .single();
  
          if (profileError || !profileData?.name) {
            console.warn('Error fetching name or no profile found. Setting default name as "Guest".');
            setName('Guest'); // Set to 'Guest' if no profile or error
            return;
          }
  
          setName(profileData.name); // Directly set the name
  
        } catch (error) {
          console.error('Error fetching name: ', error);
          setName('Guest'); // Fallback to 'Guest' on error
        }
      };
  
      fetchName();
    }, []),
  );

  const getLoc = async () => {
    try {
      // Access Location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      // Set location for fetching cafes
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserRegion(newRegion);

      // Get city, state as string
      let geocodedLocation = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocodedLocation && geocodedLocation[0]?.city && geocodedLocation[0]?.region) {
        const city = geocodedLocation[0].city;
        const state = geocodedLocation[0].region;
        setLoc(`${city}, ${state}`);
      } else {
        setLoc('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location: ', error);
    }
  };

  const fetchReviews = async () => {
    // Fetch date to only display top reviews from this past week
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 7);

    // Fetch list of top reviews in database from past week
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .gt('created_at', pastWeek.toISOString())
      .order('likes', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching reviews: ', error);
    } else {
      setReviews(data);
    }
  };

  const getCafes = async () => {
    try {
      const requestBody = {
        geolocation: {
          lat: userRegion.latitude,
          lng: userRegion.longitude,
        },
        sortBy: 'distance',
        radius: 500,
      };
      console.log('Req body: ', requestBody);
      const response = await fetch(`${API_URL}/cafes/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to search: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.log('Invalid data');
        return;
      }

      const limitData = data.slice(0, 4);
      const cafes = [];
      for (const cafe of limitData) {
        cafes.push({
          id: cafe.id,
          name: cafe.title ? cafe.title : '',
          address: cafe.address ? cafe.address : '',
          hours: cafe.hours ? cafe.hours : '',
          tags: cafe.tags ? cafe.tags : [],
          created_at: cafe.created_at ? cafe.created_at : '',
          latitude: cafe.latitude ? cafe.latitude : 0,
          longitude: cafe.longitude ? cafe.longitude : 0,
          rating: cafe.rating ? cafe.rating : 0,
          num_reviews: cafe.num_reviews ? cafe.num_reviews : 0,
          image: cafe.image ? cafe.image : '',
          summary: cafe.summary ? cafe.summary : '',
        });
      }

      setPopCafes(cafes);

      console.log('searched successfully');
    } catch (error) {
      console.log('error searching', error);
    }
  };

  useEffect(() => {
    getLoc();
    fetchReviews();
  }, []);

  useEffect(() => {
    getCafes();
  }, [userRegion])

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Greeting */}
          <Text style={styles.greeting}>Hello, {name}!</Text>

          {/* Header */}
          <Text style={styles.heading}>Where's your next</Text>
          <Text style={styles.h2}>cafe adventure?</Text>

          {/* Search Bar */}
          <Link style={styles.searchWrapper} href={{ pathname: '/(tabs)/explore' }} asChild>
            <Pressable>
              <Icon name="search" size={20} color="#8a8888"></Icon>
              <Text style={styles.search}>Search a cafe, profile, etc.</Text>
            </Pressable>
          </Link>

          {/* Popular */}
          <Text style={styles.popularHeader}>Popular near you</Text>
          <View style={styles.popInfo}>
            <TouchableOpacity activeOpacity={0.6} style={styles.locButton} onPress={getLoc}>
              <Icon name="location-pin" size={15} color="#8a8888"></Icon>
              <Text style={{ color: '#8a8888' }}>{loc ? loc : 'No location found'}</Text>
            </TouchableOpacity>

            <Link href={{ pathname: '/(tabs)/explore' }} asChild>
              <Pressable>
                <Text style={styles.popBrowse}>Browse all</Text>
              </Pressable>
            </Link>
          </View>
          {/* Cafe Carousel */}
          <View>
            <FlatList
              data={popCafes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                return (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: '/cafe',
                        params: {
                          id: item.id,
                          created_at: item.created_at ? item.created_at : '',
                          name: item.name,
                          address: item.address,
                          hours: item.hours ? item.hours : '',
                          latitude: item.latitude,
                          longitude: item.longitude,
                          tags: item.tags ? item.tags : [],
                          image: item.image ? item.image : '',
                          summary: item.summary ? item.summary : '',
                          rating: item.rating,
                          num_reviews: item.num_reviews,
                        },
                      });
                    }}>
                    <Card cafe={item} />
                  </Pressable>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />
          </View>

          {/* Popular Reviews */}
          <View style={styles.reviewContainer}>
            <Text style={styles.popularHeader}>Popular Reviews this Week</Text>

            {/* Turn into button later */}
            <Text style={{ color: '#8a8888' }}>Browse all</Text>
          </View>
          {/* MAP REVIEWS */}
          <View style={styles.placeholder}>
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    maxWidth: 350,
                    width: '100%',
                    flex: 1,
                    flexDirection: 'row',
                    padding: 10,
                  }}>
                  <Review
                    review={item}
                    setViewingImages={setViewingImages}
                    setViewingImageIndex={setViewingImageIndex}
                  />
                </View>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            />
          </View>

          {/* Feed */}
          <Text style={styles.feedHeader}>New from friends</Text>
          <View>
              {mockFeed.map((feed, index) => (
                <View key={index}>
                <FeedComponent feed={feed} />
                {index < mockFeed.length - 1 && <View style={styles.separator} />}
                </View>
            ))}
          </View>
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
  popularHeader: {
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
  popBrowse: {
    paddingTop: 4,
    color: '#8a8888',
    fontSize: 14,
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
    flex: 1,
  },
  reviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  placeholder: {
    flex: 1,
    marginTop: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  reviewList: {
    paddingHorizontal: 8,
    width: 350,
    marginLeft: 10,
  },

  feedHeader:{
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    marginBottom: 10,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  }
});
