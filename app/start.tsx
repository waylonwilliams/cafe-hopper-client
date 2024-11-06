import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

// do we need this file?
// I think the start page is already being defined in index
export default function GetStartedPage() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/cup.png')} style={styles.image} />
      <Text style={styles.title}>your next favorite cafe is just around the corner...</Text>
      <TouchableOpacity style={styles.start}>
        <Text style={styles.buttonText}>Get started</Text>
        <Image source={require('@/assets/images/arrow.png')}></Image>
      </TouchableOpacity>
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
