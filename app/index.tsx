import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function GetStartedPage() {
  const router = useRouter();

  // since i can't make the component async, I do a check and don't show the screen until it loads
  const [checked, setChecked] = useState(false);
  const checkLogin = async () => {
    const { data } = await supabase.auth.getUser(); // use getUser here to refresh on opening app
    if (data.user !== null) {
      router.replace('/(tabs)');
    }
    setChecked(true);
  };
  checkLogin();

  return (
    <View style={styles.container}>
      {checked && (
        <>
          <Image source={require('@/assets/images/cup.png')} style={styles.image} />
          <Text style={styles.title}>your next favorite cafe is just around the corner...</Text>
          <TouchableOpacity testID='button' style={styles.start} onPress={() => router.replace('/signUp')}>
            <Text style={styles.buttonText}>Get started</Text>
            <Image source={require('@/assets/images/arrow.png')}></Image>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 22,
    marginHorizontal: 43.5,
    marginBottom: 22,
  },
  image: {
    width: 254,
    height: 161,
    marginTop: 225,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  start: {
    borderWidth: 1,
    borderRadius: 32.05, // Half of height for pill shape
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 5, // Shadow for Android
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'black', // Text color
    fontSize: 16, // Text size
    fontWeight: 'bold', // Text weight
    paddingRight: 10,
  },
});
