import { router } from 'expo-router';
import { Image, Pressable, SafeAreaView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetHandleProps, BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cafe from '@/components/CafePage/Cafe';
import Log from '@/components/CafePage/Log';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CafeType, NewReviewType } from '@/components/CafePage/CafeTypes';
import { supabase } from '@/lib/supabase';
import ImageFullView from '@/components/CafePage/ImageFullView';

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

function assertString(v: string | string[] | undefined) {
  console.log(v);
  if (typeof v !== 'string') {
    console.log('somethig did not go right');
    throw new Error(
      'Something went wrong passing parameters to cafe page, probably not passing all required',
    );
  }
  return v;
}

/**
 * When you click on a cafe card / pin on map this page will be shown
 * Ideally upgrade this to take in a cafe as a param and render it that way
 */
export default function Index() {
  const cafeObj = useLocalSearchParams();

  const cafe = {
    id: assertString(cafeObj.id),
    created_at: assertString(cafeObj.created_at),
    name: assertString(cafeObj.name),
    hours: assertString(cafeObj.hours),
    latitude: parseFloat(assertString(cafeObj.latitude)),
    longitude: parseFloat(assertString(cafeObj.longitude)),
    address: assertString(cafeObj.address),
    tags: assertString(cafeObj.tags).split(','),
    image: assertString(cafeObj.image),
    summary: assertString(cafeObj.summary),
    rating: parseFloat(assertString(cafeObj.rating)),
    num_reviews: parseFloat(assertString(cafeObj.num_reviews)),
  } as CafeType;

  const [loggingVisit, setLoggingVisit] = useState(false);
  const [reviews, setReviews] = useState<NewReviewType[]>([]);
  const [viewingImages, setViewingImages] = useState<string[] | null>(null);
  const [viewingImageIndex, setViewingImageIndex] = useState<number | null>(null);

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

  function logVisit() {
    setLoggingVisit(true);
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
        const { data, error } = await supabase.from('reviews').select('*').eq('cafe_id', cafe.id);
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
      console.log('fetching reviews');
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
            source={require('../../assets/images/oshimacafe.png')}
          />

          <Pressable onPress={goBack}>
            <Ionicons
              name="chevron-back"
              size={24}
              color="white"
              style={{ padding: 4, position: 'absolute', zIndex: 2 }}
            />
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
          ) : (
            <Cafe
              cafe={cafe}
              reviews={reviews}
              logVisit={logVisit}
              setViewingImages={setViewingImages}
              setViewingImageIndex={setViewingImageIndex}
            />
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Image full view */}
      {viewingImageIndex !== null && (
        <ImageFullView images={viewingImages} setImages={setViewingImages} />
      )}
    </>
  );
}
