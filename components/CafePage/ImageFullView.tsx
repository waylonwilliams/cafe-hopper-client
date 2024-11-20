import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  images: string[] | null;
  setImages: (arg: null) => void;
}

/**
 * Render this component at the base page on pages where the user will want to expand images, probably only needed otherwise in index page
 * @param images array of strings representing image urls or null, null when nothing should be showed, array of strings when images should be shown
 * @param setImages function to set images array to null when closed
 */
export default function ImageFullView({ images, setImages }: Props) {
  const insets = useSafeAreaInsets();

  if (!images) return null;

  // currently using this for image size, would be better to do something else
  const { width } = Dimensions.get('window');

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        height: '100%',
      }}>
      {/* Dark overlay on the screen
        Rn it is just 200% so it will hopefully be big enough for everythign
      */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '200%',
          top: -200,
          backgroundColor: 'rgba(50, 50, 50, .85)',
        }}
      />

      {/* top bar */}
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
            top: 12.5, // 12.5 + 25 + 12.5 is middle of the view bar
            zIndex: 2,
          }}>
          <Ionicons name="close" size={25} color="white" />
        </Pressable>
      </View>

      {/* Scroll view of images */}
      <ScrollView
        horizontal
        pagingEnabled
        contentContainerStyle={{
          position: 'relative',
        }}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            // This is a bit jank, height may exceed depending on screen size
            style={{ width, height: '86%' }}
            resizeMode="contain"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
