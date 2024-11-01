import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useState, useEffect } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

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
  if (!images) return null;

  // currently using this for image size, would be better to do something else
  const { width, height: fullHeight } = Dimensions.get('window');
  const height = fullHeight * 0.8;

  return (
    <>
      <SafeAreaView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(170, 170, 170, 0.9)',
        }}>
        {/* 1 of x and exit button bar */}
        <View
          style={{
            position: 'relative',
          }}>
          <View
            style={{
              width: '100%',
              height: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Text style={{ color: 'white' }}>Hello there</Text>

              <Pressable
                onPress={() => setImages(null)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 12.5, // 12.5 + 25 + 12.5 is middle of the view bar
                }}>
                <Ionicons name="close" size={25} color="white" />
              </Pressable>
            </View>
          </View>

          {/* Scroll view of images */}
          <ScrollView
            horizontal
            pagingEnabled
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width, height }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}
