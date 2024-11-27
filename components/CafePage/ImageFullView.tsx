import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  images: string[] | null;
  setImages: (arg: null) => void;
}

/**
 * Render this component at the base page on pages where the user will want to expand images from reviews or maybe like pfp
 * @param images array of strings representing image urls or null, null when nothing should be showed, array of strings when images should be shown
 * @param setImages function to set images array to null when closed
 */
export default function ImageFullView({ images, setImages }: Props) {
  const insets = useSafeAreaInsets();

  // Don't render anything when there are no images
  // You don't need to worry about conditionally rendering this component, it will do it
  if (!images) return null;

  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: 'rgba(50, 50, 50, .85)',
      }}>
      {/* Top bar */}
      <View
        style={{
          width: '100%',
          height: 50,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          top: insets.top,
        }}>
        {images.length > 1 && <Text style={{ color: 'white' }}>{images.length} images</Text>}

        <Pressable
          onPress={() => setImages(null)}
          style={{
            position: 'absolute',
            right: 10,
            top: 12.5,
            zIndex: 2,
          }}>
          <Ionicons name="close" size={25} color="white" />
        </Pressable>
      </View>

      {/* Scroll view of images */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: insets.top,
        }}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width, height: '90%' }}
            resizeMode="contain"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
