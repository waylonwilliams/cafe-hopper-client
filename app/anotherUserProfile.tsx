import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import Profile from '../components/Profile';
import ImageFullView from '@/components/CafePage/ImageFullView';
import assertString from '@/components/assertString';
import { Ionicons } from '@expo/vector-icons';

// Used in review components to navigate to another user's profile

export default function AnotherUserProfile() {
  // accept user id as a dynamic parameter
  const uidObj = useLocalSearchParams();
  const uid = assertString(uidObj.uid);

  const [viewingImages, setViewingImages] = useState<string[] | null>(null);

  return (
    <>
      <SafeAreaView style={{ position: 'relative' }}>
        <View style={{ width: '100%' }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              padding: 10,
            }}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
        </View>
        <Profile uid={uid} setViewingImages={setViewingImages} />
      </SafeAreaView>
      {viewingImages !== null && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
          <ImageFullView images={viewingImages} setImages={setViewingImages} />
        </View>
      )}
    </>
  );
}
