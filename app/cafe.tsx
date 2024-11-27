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
 * 
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
 */

// This component will render when you navigate to /cafe
// It is meant to be reusable across all tabs so that users can click on a cafe from any of them
export default function Index() {
  // Parsing arguments to the page
  const cafeObj = useLocalSearchParams();

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
      // Return a default cafe object on failure
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

  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState<string | null>(null);
  const [loggingVisit, setLoggingVisit] = useState(false);
  const [reviews, setReviews] = useState<NewReviewType[]>([]);
  const [viewingImages, setViewingImages] = useState<string[] | null>(null);
  const [addingToList, setAddingToList] = useState(false);

  // Using an external bottom sheet component, these are necessary props
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 78% on cafe view, 89% on log visit / list view, back button remains visible
  const snapPoints = useMemo(() => ['78%', '89%'], []);
  // This is the component that shows up at the top of the sheet, like the drag icon
  // Show differnet when logging visit vs viewing cafe
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

  // Update user session and store in state
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

  // Changes to log visit view and changes bottom sheet height
  function logVisit() {
    setLoggingVisit(true);
    bottomSheetRef.current?.snapToIndex(1);
  }

  // Changes to add to list view and changes bottom sheet height
  function addToList() {
    setAddingToList(true);
    bottomSheetRef.current?.snapToIndex(1);
  }

  // Go back to previous page, when leaving the cafe page
  function goBack() {
    setLoggingVisit(false);
    router.back();
  }

  // Fetch reviews for the cafe on load
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
        {/* Top area, image and back button */}
        <View style={{ backgroundColor: '#f0f0f0', height: '100%', width: '100%' }}>
          <Image
            style={{
              top: 0,
              width: '100%',
              height: undefined,
              aspectRatio: 1,
              position: 'absolute',
            }}
            resizeMode="cover"
            source={cafe.image ? { uri: cafe.image } : require('../assets/images/oshimacafe.png')}
          />

          <Pressable
            onPress={goBack}
            style={{
              position: 'absolute',

              top: insets.top,
              left: 10,
              zIndex: 2,
            }}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Bottom sheet that will host cafe view, logging view, list view */}
      <BottomSheet
        ref={bottomSheetRef}
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
              updateCafeView={(listName, selected) => {}} // Seems unnecessary
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

      {/* Image full view, when you click on a review's image */}
      <ImageFullView images={viewingImages} setImages={setViewingImages} />
    </>
  );
}
