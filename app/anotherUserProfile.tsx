import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import Profile from '../components/Profile';
import ImageFullView from '@/components/CafePage/ImageFullView';
import assertString from '@/components/assertString';

// This page won't be navigated to if they are an admin
// This is just used when they click on a review and it is not their profile
// Profile component still has some admin checks

export default function anotherUserProfile() {
  const uidObj = useLocalSearchParams();
  const uid = assertString(uidObj.uid);

  const [viewingImages, setViewingImages] = useState<string[] | null>(null);

  return (
    <>
      <SafeAreaView style={{ position: 'relative' }}>
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
