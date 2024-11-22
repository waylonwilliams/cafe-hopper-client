import { router } from 'expo-router';
import { Image, Pressable, SafeAreaView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetHandleProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cafe from '@/components/CafePage/Cafe';
import Log from '@/components/CafePage/Log';
import AddToList from '@/components/CafePage/AddToList';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';
import { supabase } from '@/lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageFullView from '@/components/CafePage/ImageFullView';
import assertString from '@/components/assertString';

/**
 * An example of how you can open this page
 * You just need to pass a CafeType object via params
 * <Link
        // will pass the fetched cafe data like this to prevent multiple fetches
        href={{
          pathname: "/cafe",
          params: {
            id: 1,
            created_at: "2021-08-01T00:00:00.000Z",
            name: "Cafe Oshima's",
            address:
              "2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam",
            tags: [
              "🍵 Matcha",
              "🛜 Free Wifi",
              "🌱 Vegan",
              "🌳 Outdoor",
              "🐶 Pet Friendly",
              "🏠 Indoor",
              "🚗 Parking",
            ],
            hours: `8:00AM - 10:00PM Monday
                    8:00AM - 10:00PM Tuesday
                    8:00AM - 10:00PM Wednesday
                    8:00AM - 10:00PM Thursday
                    8:00AM - 10:00PM Friday
                    8:00AM - 10:00PM Saturday
                    8:00AM - 10:00PM Sunday`,
          },
          latitude: 10.7743,
          longitude: 106.686,
          image: "https://jghggbaesaohodfsneej.supabase.co/storage/v1/object/public/page_images/public/60d09661-18af-43b5-bcb8-4c5a0b2dbe12",
          summary: "A cozy cafe",
          rating: 9.4,
          num_reviews: 100,
        }}
        asChild
      >
        <Pressable>
          <Text>Open cafe view</Text>
        </Pressable>
      </Link>
 */

/**
 * When you click on a cafe card / pin on map this page will be shown
 * Ideally upgrade this to take in a cafe as a param and render it that way
 */
export default function Index() {
  const cafeObj = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const cafe = useMemo(() => {
    try {
      return {
        id: assertString(cafeObj.id),
        created_at: assertString(cafeObj.created_at),
        name: assertString(cafeObj.name),
        hours: assertString(cafeObj.hours),
        latitude: parseFloat(assertString(cafeObj.latitude)) || 0,
        longitude: parseFloat(assertString(cafeObj.longitude)) || 0,
        address: assertString(cafeObj.address),
        tags: assertString(cafeObj.tags).split(',').filter(Boolean),
        image: assertString(cafeObj.image),
        summary: assertString(cafeObj.summary),
        rating: parseFloat(assertString(cafeObj.rating)) || 0,
        num_reviews: parseFloat(assertString(cafeObj.num_reviews)) || 0,
      } as CafeType;
    } catch (error) {
      console.error('Error parsing cafe parameters:', error);
      // Return a default cafe object
      return {
        id: '',
        created_at: '',
        name: 'Unknown Cafe',
        hours: '',
        latitude: 0,
        longitude: 0,
        address: '',
        tags: [],
        image: '',
        summary: '',
        rating: 0,
        num_reviews: 0,
      } as CafeType;
    }
  }, [cafeObj]);

  const [userId, setUserId] = useState<string | null>(null);
  const [loggingVisit, setLoggingVisit] = useState(false);
  const [reviews, setReviews] = useState<NewReviewType[]>([]);
  const [viewingImages, setViewingImages] = useState<string[] | null>(null);

  const [addingToList, setAddingToList] = useState(false);

  // idk stuff for the bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);
  //   const handleSheetChanges = useCallback((index: number) => {}, []);
  const snapPoints = useMemo(() => ['78%', '89%'], []); // 95% so you can see back button
  // differnt top handle components for if you are viewing the cafe or if you are logging your visit
  const HandleComponent: React.FC<BottomSheetHandleProps> = (props) => {
    return loggingVisit ? (
      <></>
    ) : (
      <View style={{ width: '100%', alignItems: 'center', padding: 10 }}>
        <View
          style={{
            backgroundColor: '#808080',
            width: 100,
            height: 5,
            borderRadius: 999,
            opacity: 0.5,
          }}
        />
      </View>
    );
  };
  // Fetch user ID when component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserId();
  }, []);

  function logVisit() {
    setLoggingVisit(true);
    bottomSheetRef.current?.snapToIndex(1);
  }

  function addToList() {
    setAddingToList(true);
    bottomSheetRef.current?.snapToIndex(1);
  }

  function goBack() {
    setLoggingVisit(false);
    router.back();
  }

  // fetch reviews assosicated with this cafe on load

  useEffect(() => {
    setReviews([]);
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*, profiles (name, pfp), reviewLikes (id)')
          .eq('cafe_id', cafe.id);
        if (error) {
          console.log('Error fetching reviews', error);
        } else {
          setReviews(data);
        }
      } catch (error) {
        console.log('Unexpected error fetching reviews', error);
      }
    }
    if (cafe.id) {
      fetchReviews();
    }
  }, [cafe.id]);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: 'white',
        }}>
        {/* The actual cafe here */}
        <View style={{ backgroundColor: '#f0f0f0', height: '100%', width: '100%' }}>
          <Image
            style={{ top: -70, width: '100%', position: 'absolute' }}
            // Why is the uri not showing?
            source={cafe.image ? { uri: cafe.image } : require('../assets/images/oshimacafe.png')}
          />

          <Pressable
            onPress={goBack}
            style={{
              position: 'absolute',
              // IF THE BUTTON PLACEMENT IS OFF
              // there are changes to safeareaview in new version of expo
              // if on newest version, use insets.top to be at the top of safe area
              // else just use 0
              top: insets.top, // Account for the safe area inset
              // top: 0,
              left: 10, // Add some padding
              zIndex: 2,
            }}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        //   onChange={handleSheetChanges}
        index={0}
        snapPoints={snapPoints}
        handleComponent={HandleComponent}>
        <BottomSheetView
          style={{
            width: '100%',
            height: '100%',
            paddingTop: 5,
          }}>
          {loggingVisit ? (
            <Log
              setLoggingVisit={setLoggingVisit}
              cafe={cafe}
              reviews={reviews}
              setReviews={setReviews}
            />
          ) : addingToList ? (
            <AddToList
              setAddingToList={setAddingToList}
              cafe={cafe}
              userId={userId ?? ''}
              updateCafeView={(listName, selected) => {
                /* implement the callback function here */
              }}
            />
          ) : (
            <Cafe
              cafe={cafe}
              reviews={reviews}
              logVisit={logVisit}
              setViewingImages={setViewingImages}
              userId={userId ?? ''}
              addToList={addToList}
            />
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Image full view */}
      {viewingImages !== null && (
        <ImageFullView images={viewingImages} setImages={setViewingImages} />
      )}
    </>
  );
}
