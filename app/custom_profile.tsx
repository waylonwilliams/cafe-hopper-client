import { Alert, AppState } from 'react-native';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Index() {
  //temporary to save name, loc, bio
  const [name, setName] = useState('');
  const [loc, setLoc] = useState('');
  const [bio, setBio] = useState('');

  const handleSaved = () => {
    console.log('Name: ', name);
    console.log('Location: ', loc);
    console.log('Bio: ', bio);
    console.log('changes saved');
  };

  return (
    <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <Link href="../profile" asChild>
          <Pressable>
            <Ionicons name="chevron-back" size={24} color="gray"></Ionicons>
          </Pressable>
        </Link>
        <Text style={styles.headingText}>Edit Profile</Text>
      </View>

      {/* Profile */}
      <View style={styles.pfpContainer}>
        {/* PLACEHOLDER --  ADD IMAGE UPLOAD*/}
        <Image style={styles.pfp}/>
        <TouchableOpacity style={styles.edit}>
            <Icon name='edit' size={16}></Icon>
        </TouchableOpacity>
      </View>

      {/* Input Boxes */}
      <View style={styles.inputWrapper}>
        <Text style={styles.h2}>Name</Text>
        <TextInput style={styles.inputs} placeholder="Name" onChangeText={setName} value={name} />

        <Text style={styles.h2}>Location</Text>
        <TextInput style={styles.inputs} placeholder="Location" onChangeText={setLoc} value={loc} />

        <Text style={styles.h2}>Bio</Text>
        <TextInput
          style={styles.bio}
          placeholder="Bio"
          onChangeText={setBio}
          value={bio}
          multiline
        />

        <Text style={styles.h2}>Favorite Cafes</Text>
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSaved}>
        <Text style={styles.saveText}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
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
    right: -45,
    bottom: -3,
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
