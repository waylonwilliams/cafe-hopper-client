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
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Review from '@/components/Review';
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';
import { supabase } from '@/lib/supabase';
import * as Location from 'expo-location';
import { Link, useFocusEffect } from 'expo-router';
import Card from '@/components/Card';
import FeedComponent, { Feed } from '@/components/FeedPost';
import { CafeSearchRequest, CafeSearchResponse } from '@/lib/backend-types';
import { searchCafesFromBackend } from '@/lib/backend';
import { Skeleton } from '@/components/Skeleton';
import ImageFullView from '@/components/CafePage/ImageFullView';

const { width } = Dimensions.get('window');

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [userRegion, setUserRegion] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loc, setLoc] = useState<string | null>(null);

  // For review carousel
  const [reviews, setReviews] = useState<NewReviewType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewingImages, setViewingImages] = useState<string[] | null>(null);

  // For popular cafe carousel
  const [popCafes, setPopCafes] = useState<CafeType[] | null>(null);
  //const router = useRouter();

  // For user greeting
  const [name, setName] = useState<string>('');

  // For feed posts
  const [feed, setFeed] = useState<Feed[]>([]);
  const [feedUsers, setFeedUsers] = useState<Map<string, string>>(new Map());
  const [feedPfps, setFeedPfps] = useState<Map<string, string>>(new Map());
  const [feedCafeNames, setFeedCafeNames] = useState<Map<string, string>>(new Map());
  const [feedCafeLocs, setFeedCafeLocs] = useState<Map<string, string>>(new Map());

  const popCafeSkeletons = () => {
    return new Array(6).fill(null).map((_, index) => (
      <View key={index}>
        <Skeleton width={140} height={200} borderRadius={15} />
      </View>
    ));
  };

  // Get user name
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

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name') // Only fetch the 'name' field
            .eq('user_id', uid)
            .single();

          if (profileError || !profileData?.name) {
            console.warn(
              'Error fetching name or no profile found. Setting default name as "Guest".',
            );
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

  // Fetch popular reviews for home page
  const fetchReviews = async () => {
    // Fetch date to only display top reviews from this past week
    const pastWeek = new Date();
    pastWeek.setDate(pastWeek.getDate() - 7);

    // Fetch list of top reviews in database from past week
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(name, pfp), reviewLikes(id)')
      .gt('created_at', pastWeek.toISOString())
      .order('likes', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching reviews: ', error);
    } else {
      setReviews(data);
    }
  };

  // Formatting and handling review carousel
  const handleNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fetch user details (name, pfp) for feed posts
  const fetchUserInfo = async (
    userIds: string[],
  ): Promise<{ nameMap: Map<string, string>; pfpMap: Map<string, string> } | null> => {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('user_id, name, pfp')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching user details for feed: ', error);
      return null;
    }

    const nameMap = new Map<string, string>();
    const pfpMap = new Map<string, string>();

    users.forEach((user) => {
      nameMap.set(user.user_id, user.name);
      pfpMap.set(user.user_id, user.pfp);
    });

    return { nameMap, pfpMap };
  };

  const fetchCafeInfo = async (
    cafeIds: string[],
  ): Promise<{ cafeMap: Map<string, string>; locMap: Map<string, string> } | null> => {
    const { data: cafes, error } = await supabase
      .from('cafes')
      .select('id, name, address')
      .in('id', cafeIds);

    if (error) {
      console.error('Error fetching cafe details:', error);
      return null;
    }

    if (!cafes) {
      console.log('No cafes found with the given cafe_ids');
      return null;
    }

    const cafeMap = new Map<string, string>();
    const locMap = new Map<string, string>();
    cafes.forEach((cafe) => {
      cafeMap.set(cafe.id, cafe.name);

      // Format location
      const regex = /(?:,\s*)([^,]+),\s*([A-Za-z]{2})\s*\d+,\s*([^,]+)$/;
      const match = cafe.address.match(regex);
      if (match) {
        const formattedCafe = `${match[1]}, ${match[2]}, ${match[3]}`;
        locMap.set(cafe.id, formattedCafe);
      } else {
        locMap.set(cafe.id, cafe.address);
      }
    });

    return { cafeMap, locMap };
  };

  const fetchFeed = useCallback(async () => {
    // Fetch list of top reviews in database from past week
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching reviews: ', error);
      return;
    }

    // Fetch names, pfps, cafes

    const userIds = [...new Set(data.map((review) => review.user_id))];
    const cafeIds = [...new Set(data.map((review) => review.cafe_id))];

    const [userInfo, cafeInfo] = await Promise.all([
      fetchUserInfo(userIds),
      fetchCafeInfo(cafeIds),
    ]);

    if (userInfo) {
      setFeedUsers(userInfo.nameMap);
      setFeedPfps(userInfo.pfpMap);
    }
    if (cafeInfo) {
      setFeedCafeNames(cafeInfo.cafeMap);
      setFeedCafeLocs(cafeInfo.locMap);
    }

    // Create formatted list of Feed objects
    const formattedFeed = data.map((item) => {
      const new_date = new Date(item.created_at);
      const formattedDate: string = new_date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return {
        id: item.id,
        name: feedUsers.get(item.user_id),
        pfp: feedPfps.get(item.user_id),
        action: item.description ? 'reviewed' : 'rated', // Replace or customize based on your logic
        cafe: feedCafeNames.get(item.cafe_id),
        location: feedCafeLocs.get(item.cafe_id),
        date: formattedDate,
        review: {
          description: item.description,
          images: item.images,
          tags: item.tags,
          rating: item.rating,
        },
      };
    });

    setFeed(formattedFeed);
    setFeedLoading(false);
  }, [feedCafeLocs, feedCafeNames, feedPfps, feedUsers]);

  // Fetch Popular Cafes
  const getCafes = useCallback(async () => {
    if (userRegion) {
      try {
        // Call to backend server to search by distance
        const requestBody: CafeSearchRequest = {
          geolocation: {
            lat: userRegion.latitude,
            lng: userRegion.longitude,
          },
          sortBy: 'distance',
        };
        const response: CafeSearchResponse = await searchCafesFromBackend(requestBody);

        if (response.error) {
          console.error('Error searching cafes: ', response.error);
          return;
        }

        const data: CafeType[] = response.cafes;

        const limitData = data.slice(0, 6);
        const cafes = [];
        for (const cafe of limitData) {
          cafes.push({
            id: cafe.id,
            name: cafe.name ? cafe.name : '',
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
        setIsLoading(false);
      } catch (error) {
        console.log('error searching', error);
      }
    }
  }, [userRegion]);

  useEffect(() => {
    getLoc();
    fetchReviews();
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [feedUsers, feedPfps, feedCafeNames, feedCafeLocs]);

  useEffect(() => {
    if (userRegion) {
      getCafes();
    }
  }, [userRegion, getCafes]);

  return (
    <>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Greeting */}
            <Text style={styles.greeting}>Hello, {name}!</Text>
            {/* Header */}
            <Text style={styles.heading}>Where's your next </Text>
            <Text style={{ color: '#8a8888', fontSize: 24 }}>cafe adventure?</Text>
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
              {/* LOAD SKELETONS AS CAFES FETCH */}
              {isLoading ? (
                <FlatList
                  data={popCafeSkeletons()}
                  renderItem={({ item }) => item}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                />
              ) : (
                <FlatList
                  data={popCafes}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <Card cafe={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                />
              )}
            </View>
            {/* Popular Reviews */}
            <View style={styles.reviewContainer}>
              <Text style={styles.popularHeader}>Popular Reviews this Week</Text>
            </View>
            <View style={styles.reviewCarousel}>
              {/* Left Arrow */}
              {currentIndex > 0 && (
                <TouchableOpacity onPress={handlePrevious} style={styles.arrow}>
                  <Text style={styles.arrowText}>{'<'}</Text>
                </TouchableOpacity>
              )}

              {/* Review Content */}
              {reviews[currentIndex] && (
                <View style={styles.reviewContainer}>
                  <Review review={reviews[currentIndex]} setViewingImages={setViewingImages} />
                </View>
              )}

              {/* Right Arrow */}
              {currentIndex < reviews.length - 1 && (
                <TouchableOpacity onPress={handleNext} style={styles.arrow}>
                  <Text style={styles.arrowText}>{'>'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Feed */}
            <Text style={styles.feedHeader}>New from the community</Text>
            {feedLoading ? (
              <Text>Hello check</Text>
            ) : (
              <View>
                {feed.map((feed, index) => (
                  <View key={index}>
                    <FeedComponent feed={feed} />
                    {index < 4 && <View style={styles.separator} />}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Image full view */}
      {viewingImages !== null && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
          <ImageFullView images={viewingImages} setImages={setViewingImages} />
        </View>
      )}
    </>
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
    marginTop: 8,
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
    width: width - 60,
    padding: 5,
  },

  reviewCarousel: {
    flex: 1,
    marginTop: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrow: {
    padding: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#000',
  },
  disabledArrow: {
    color: '#ccc',
  },

  feedHeader: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    marginBottom: 10,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
});
