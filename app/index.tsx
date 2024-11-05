import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function GetStartedPage() {
  const router = useRouter();
  const handleGetStarted = () => {
    // Navigate to the next screen in your app
    // Example: navigation.navigate('HomeScreen');
    console.log('get started pressed');
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/cup.png')} style={styles.image} />
      <Text style={styles.title}>your next favorite cafe is just around the corner...</Text>
      {/* //<Button title="Get Started" onPress={handleGetStarted}  /> */}
      <TouchableOpacity style={styles.start} onPress={() => router.push('/sign_up')}>
        <Text style={styles.buttonText}>Get started</Text>
        <Image style={styles.arrow} source={require('@/assets/images/arrow.png')}></Image>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
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
    // marginTop: 41,
    // marginBottom: 40,

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
  arrow: {},
});
