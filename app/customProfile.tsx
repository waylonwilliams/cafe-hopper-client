import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { v4 as uuidv4 } from 'uuid';

const baseUrl = 'https://lirlyghrkygwaesanniz.supabase.co/storage/v1/object/public/pfps/';

function assertString(v: string | string[] | undefined) {
  if (typeof v !== 'string') {
    return '';
  }
  return v;
}

export default function Index() {
  const profileObj = useLocalSearchParams();

  const [name, setName] = useState<string>(assertString(profileObj.name));
  const [loc, setLoc] = useState<string>(assertString(profileObj.location));
  const [bio, setBio] = useState<string>(assertString(profileObj.bio));
  const initialPfp = assertString(profileObj.pfp);
  const [pfpChanged, setPfpChanged] = useState(initialPfp === ''); // set to true when its been changed or there isn't one to begin with
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  async function addPfp() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // images only
      allowsEditing: true, //users can crop photo
      aspect: [1, 1], //square
      quality: 0.5, // compressed for profile
      exif: false, // removes some data we don't need
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setPfpChanged(true);
    }
  }

  async function saveChanges() {
    try {
      // Get user id
      const uid = (await supabase.auth.getSession())?.data.session?.user.id;
      let imageUrl = '';

      // Handle images
      if (image) {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const arrBuffer = await new Response(blob).arrayBuffer();

        const fileName = `public/${uuidv4()}`;

        const { error: uploadError } = await supabase.storage
          .from('pfps') // Replace with your bucket name
          .upload(fileName, arrBuffer, { contentType: image.mimeType });

        if (uploadError) {
          console.error('Error uploading image: ', uploadError);
          return;
        }

        imageUrl = `${baseUrl}${fileName}`;
      }

      // change to upsert, supabase will automatically get user id
      const { error } = await supabase.from('profiles').upsert({
        user_id: uid,
        name,
        location: loc,
        bio,
        ...(imageUrl !== '' && { pfp: imageUrl }), // only upload new image if it exists
      });
      if (error) throw error;

      Alert.alert('Changes saved!');
      router.back();
    } catch (error) {
      console.error('Error saving changes: ', error);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="gray" />
          </Pressable>

          <Text style={styles.headingText}>Edit Profile</Text>
        </View>

        {/* Profile */}
        <View style={styles.pfpContainer}>
          <Image
            style={styles.pfp}
            source={
              !pfpChanged
                ? { uri: initialPfp }
                : image
                  ? { uri: image.uri }
                  : require('../assets/images/default.jpg')
            }
          />
          <Pressable style={styles.edit} onPress={addPfp}>
            <Icon name="edit" size={16}></Icon>
          </Pressable>
        </View>

        {/* Input Boxes */}
        <View style={styles.inputWrapper}>
          <Text style={styles.h2}>Name</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.inputs}
            placeholder="Name"
            onChangeText={setName}
            value={name}
          />

          <Text style={styles.h2}>Location</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.inputs}
            placeholder="Location"
            onChangeText={setLoc}
            value={loc}
          />

          <Text style={styles.h2}>Bio</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.bio}
            placeholder="Bio"
            onChangeText={setBio}
            value={bio}
            multiline
          />

          <Text style={styles.h2}>Favorite Cafes</Text>
          <Text style={{ fontSize: 12, fontStyle: 'italic' }}>
            Please create and add to a list named 'favorites' to start!
          </Text>
          <View style={styles.favorites}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.cafeBox}
                onPress={() => {
                  console.log(`Add cafe at position ${index}`);
                }}>
                <Text>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveText}>Save changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },

  headingText: {
    marginLeft: 30,
    fontSize: 20,
    fontFamily: 'SF-Pro-Display-Semibold',
  },

  pfpContainer: {
    position: 'relative',
    alignItems: 'center',
    padding: 15,
  },

  pfp: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    borderRadius: 999,
  },

  edit: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 145,
    bottom: 15,
  },

  inputWrapper: {
    marginHorizontal: 20,
  },

  h2: {
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
  },

  inputs: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderColor: '#ddd',
  },

  bio: {
    height: 110,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderColor: '#ddd',
  },

  favorites: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cafeBox: {
    width: 100,
    height: 125,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  saveButton: {
    alignItems: 'center',
  },

  saveText: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    fontWeight: '500',
  },
});
