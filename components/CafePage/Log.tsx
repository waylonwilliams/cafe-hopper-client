import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { cafeTags, CafeType, NewReviewType } from './CafeTypes';
import EmojiTag from '../EmojiTag';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import 'react-native-get-random-values'; // needed for uuid
import { v4 as uuidv4 } from 'uuid';
import Constants from 'expo-constants';

interface Props {
  setLoggingVisit: (arg: boolean) => void;
  cafe: CafeType;
  reviews: NewReviewType[];
  setReviews: (arg: NewReviewType[]) => void;
}

const baseUrl = 'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/posts/';

export default function Log({ setLoggingVisit, cafe, reviews, setReviews }: Props) {
  const [rating, setRating] = useState(7);
  const [publicPost, setPublicPost] = useState(true);
  const [emojiTags, setEmojiTags] = useState<string[]>([]);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [description, setDescription] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  function handleTagClick(tag: string) {
    if (emojiTags.includes(tag)) {
      setEmojiTags(emojiTags.filter((t) => t !== tag));
    } else {
      setEmojiTags([...emojiTags, tag]);
    }
  }

  async function selectImages() {
    // https://docs.expo.dev/versions/latest/sdk/imagepicker/#imagepickeroptions
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // not compressed
      allowsMultipleSelection: true,
      exif: false,
      orderedSelection: true,
    });

    if (result.canceled) {
      return;
    }

    // filter out duplicates and images that are too large
    let tooLarge = false;
    const newImages = [...images];
    for (const image of result.assets) {
      if (!newImages.some((img) => img.assetId === image.assetId)) {
        if (image.fileSize && !(image.fileSize > 5 * 1024 * 1024)) {
          newImages.push(image);
        } else {
          tooLarge = true;
        }
      }
    }
    if (tooLarge) Alert.alert('One or more images exceeded the 5MB limit');
    setImages(newImages);
  }

  async function handlePost() {
    setSubmittingReview(true);
    try {
      const imagePromises: Promise<
        | { data: { id: string; path: string; fullPath: string }; error: null }
        | { data: null; error: any }
      >[] = [];

      const imagePaths: string[] = [];

      // Upload images to storage bucket concurrently
      for (const image of images) {
        const i = await fetch(image.uri);
        const blob = await i.blob();
        const arrBuffer = await new Response(blob).arrayBuffer();

        const fileName = `public/${uuidv4()}`;

        const res = supabase.storage.from('posts').upload(fileName, arrBuffer, {
          contentType: image.mimeType,
        });
        imagePromises.push(res);
        imagePaths.push(`${baseUrl}${fileName}`);
      }
      const uploadResults = await Promise.all(imagePromises);

      for (const result of uploadResults) {
        if (result.error) throw result.error;
      }

      // Insert review into database
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          cafe_id: cafe.id,
          rating,
          description,
          images: imagePaths,
          tags: emojiTags,
          public: publicPost,
        })
        .select('*, profiles(name, pfp), reviewLikes(id)')
        .single();
      if (error) throw error;

      // async ping to server to renew cafe data
      // wrapped in a try block so it doens't matter if something goes wrong
      try {
        const API_URL = `http://${Constants.expoConfig?.hostUri!.split(':').shift()}:3000`;
        fetch(API_URL + '/cafes/ping', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cafeId: data.cafe_id,
            rating,
          }),
        });
      } catch (e) {
        console.error("Couldn't ping server", e);
      }

      setReviews([data, ...reviews]);
      setLoggingVisit(false);
      Alert.alert('Visit uploaded!');
    } catch (error) {
      console.log(error);
    }
    setSubmittingReview(false);
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 25,
          gap: 15,
          paddingHorizontal: 20,
          paddingBottom: 110,
        }}>
        <Pressable
          onPress={() => setLoggingVisit(false)}
          style={{ position: 'absolute', top: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="black" />
        </Pressable>

        <Text style={{ fontWeight: 700, fontSize: 24 }}>Log your visit</Text>

        {/* Star rating */}
        <View style={{ flexDirection: 'row', gap: 5 }}>
          {[1, 3, 5, 7, 9].map((num) => (
            <View key={num} style={{ position: 'relative' }}>
              <Ionicons
                name={rating === num ? 'star-half' : 'star'}
                size={32}
                color={num <= rating ? '#FFB400' : '#808080'}
              />
              <Pressable
                onPress={() => setRating(num)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                }}
              />
              <Pressable
                onPress={() => setRating(num + 1)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50%',
                  height: '100%',
                }}
              />
            </View>
          ))}
        </View>

        <TextInput
          style={{
            height: 200,
            borderWidth: 1,
            width: '100%',
            padding: 10,
            borderRadius: 5,
            borderColor: '#808080',
          }}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your visit..."
          multiline
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          style={{
            flexDirection: 'row',
            gap: 6,
            borderRadius: 999,
            backgroundColor: '#CCCCCC',
            padding: 10,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={selectImages}>
          <Ionicons name="image-outline" size={24} color="white" />
          <Text style={{ color: 'white', fontWeight: 700 }}>Add photos</Text>
        </Pressable>

        {images.length > 0 && (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              gap: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100, borderRadius: 5 }}
              />
            ))}
          </ScrollView>
        )}

        <View style={{ width: '100%' }}>
          <Text style={{ fontSize: 20, fontWeight: 700 }}>Tags</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
          {cafeTags.map((tag, index) => (
            <Pressable onPress={() => handleTagClick(tag)} key={index}>
              <EmojiTag key={index} tag={tag} filled={emojiTags.includes(tag) ? true : undefined} />
            </Pressable>
          ))}
        </View>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}>
          <Pressable
            onPress={handlePost}
            style={{
              flexDirection: 'row',
              gap: 6,
              borderRadius: 999,
              backgroundColor: '#CCCCCC',
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}>
            <Ionicons name="paper-plane-outline" size={24} color="white" />
            <Text style={{ color: 'white', fontWeight: 700 }}>Post</Text>
          </Pressable>

          <Pressable style={{ alignItems: 'center', gap: 3 }} onPress={() => setPublicPost(true)}>
            <Ionicons name="globe-outline" size={20} color={publicPost ? 'black' : '#808080'} />
            <Text style={{ color: publicPost ? 'black' : '#808080' }}>Public</Text>
          </Pressable>

          <Pressable style={{ alignItems: 'center', gap: 3 }} onPress={() => setPublicPost(false)}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={!publicPost ? 'black' : '#808080'}
            />
            <Text style={{ color: !publicPost ? 'black' : '#808080' }}>Private</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Loading spinner when review is submitting */}
      {submittingReview && (
        <View
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#CCCCCC" testID="activity-indicator" />
        </View>
      )}
    </>
  );
}
