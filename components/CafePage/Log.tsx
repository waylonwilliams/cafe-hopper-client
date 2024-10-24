import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { cafeTags } from './CafeTypes';
import EmojiTag from '../EmojiTag';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  setLoggingVisit: (arg: boolean) => void;
}

export default function Log({ setLoggingVisit }: Props) {
  const [rating, setRating] = useState(4);
  const [publicPost, setPublicPost] = useState(true);
  const [emojiTags, setEmojiTags] = useState<string[]>([]);
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // images only
      quality: 1, // not compressed
      allowsMultipleSelection: true,
      exif: false, // removes some data we don't need
      orderedSelection: true,
      // selectionLimit: 5, // add maximum number of images per review?
    });

    if (result.canceled) {
      return;
    }

    const newImages = [...images];
    for (const image of result.assets) {
      if (!newImages.some((img) => img.assetId === image.assetId)) {
        newImages.push(image);
      }
    }
    setImages(newImages);
  }

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        paddingVertical: 25,
        gap: 15,
        paddingHorizontal: 20,
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
          // <Pressable onPress={() => setRating(num)} key={num}>
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
        placeholder="Describe your visit..."
        multiline
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

      {/* Went with someone should go here */}

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
  );
}
