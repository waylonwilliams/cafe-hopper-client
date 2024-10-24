import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { markers } from '../../assets/markers';
import { MarkerType } from '../../components/CustomMarker';
import CustomMarker from '../../components/CustomMarker';
import { useRouter } from 'expo-router';

export default function Map() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 5.603717,
    longitude: -0.186964,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [viewMode, setViewMode] = useState<'list' | 'map'>('map'); // State for switching between views
  const mapRef = useRef<MapView>(null); // Reference to the MapView
  const router = useRouter(); // Get the router instance from expo-router

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setMapRegion(newRegion);

    // Animate the map to the new region
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const handleMarkerPress = (marker: MarkerType) => {
    // Navigate to cafe view and pass marker data as parameters
    console.log(`Navigating to cafe view for: ${marker.name}`);
    router.push({
      pathname: '/cafe',
      params: {
        id: 1,
        name: "Cafe Oshima's",
        address: '2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam',
        topTags: [
          '🍵 Matcha',
          '🛜 Free Wifi',
          '🌱 Vegan',
          '🌳 Outdoor',
          '🐶 Pet Friendly',
          '🏠 Indoor',
          '🚗 Parking',
        ],
        hours: `8:00AM - 10:00PM Monday
                    8:00AM - 10:00PM Tuesday
                    8:00AM - 10:00PM Wednesday
                    8:00AM - 10:00PM Thursday
                    8:00AM - 10:00PM Friday
                    8:00AM - 10:00PM Saturday
                    8:00AM - 10:00PM Sunday`,
      },
    });
  };

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Top Bar with Dummy Search Bar */}
      <View style={styles.topBar}>
        <TextInput style={styles.searchBar} placeholder="Search..." placeholderTextColor="#888" />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' ? styles.activeButton : null]}
            onPress={() => setViewMode('list')}>
            <Text style={styles.buttonText}>List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' ? styles.activeButton : null]}
            onPress={() => setViewMode('map')}>
            <Text style={styles.buttonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content based on viewMode */}
      {viewMode === 'map' ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.location} onPress={userLocation}>
            <Text>
              <MaterialIcons name="my-location" size={24} color="black" />
            </Text>
          </TouchableOpacity>
          <MapView
            ref={mapRef} // Attach reference to MapView
            style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            showsUserLocation={true} // Show the default blue dot for user location
            followsUserLocation={true}
            showsMyLocationButton={true}
            mapType="standard">
            {markers.map((marker, index) => {
              const validMarker: MarkerType = {
                ...marker,
                category: marker.category as 'liked' | 'saved' | 'default' | undefined,
              };
              return (
                <Marker
                  key={index}
                  coordinate={marker}
                  onPress={() => handleMarkerPress(validMarker)}>
                  <CustomMarker marker={validMarker} />
                </Marker>
              );
            })}
          </MapView>
        </View>
      ) : (
        <View style={styles.listView}>
          {/* Placeholder for the list view */}
          <Text>List View is currently empty.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  location: {
    position: 'absolute',
    zIndex: 50,
    bottom: 80,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 70,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 100, // Ensure the top bar is on top of everything
  },
  searchBar: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Align buttons in the center
  },
  toggleButton: {
    width: 70, // Fixed width for smaller buttons
    padding: 5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#c9c9c9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  listView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
