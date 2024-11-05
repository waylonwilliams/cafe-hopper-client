import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { markers } from '../../assets/markers';
import { MarkerType } from '../../components/CustomMarker';
import CustomMarker from '../../components/CustomMarker';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmojiTag from '../../components/EmojiTag';
import { cafeTags } from '../../components/CafePage/CafeTypes';
import ListCard from '@/components/ListCard';
import { CafeType, ReviewType } from '@/components/CafePage/CafeTypes';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock data
const mockCafes: { cafe: CafeType; review: ReviewType }[] = [
  {
    cafe: {
      id: '1',
      name: "Cafe Oshima's",
      address: '2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam',
      hours: `8:00AM - 10:00PM`,
      topTags: ['🍵 Matcha', '🛜 Free Wifi', '🌱 Vegan', '🌳 Outdoor', '🐶 Pet Friendly'],
    },
    review: {
      name: 'John Doe',
      description: 'Great place to work and relax!',
      tags: ['🛜 Free wifi', '🍵 Matcha'],
      numLikes: 120,
      datePosted: '2023-10-10',
      score: 4.5,
      images: [],
    },
  },
  {
    cafe: {
      id: '2',
      name: 'Blackbird',
      address: '123 Brew St., Coffee City, CA',
      hours: '7:00AM - 9:00PM',
      topTags: ['☕ Excellent coffee', '🪴 Ambiance', '🎶 Good music'],
    },
    review: {
      name: 'Jane Smith',
      description: 'Lovely ambiance with great coffee!',
      tags: ['☕ Excellent coffee', '🎶 Good music'],
      numLikes: 85,
      datePosted: '2023-09-05',
      score: 4.2,
      images: [],
    },
  },
  {
    cafe: {
      id: '3',
      name: 'Blackbird',
      address: '123 Brew St., Coffee City, CA',
      hours: '7:00AM - 9:00PM',
      topTags: ['☕ Excellent coffee', '🪴 Ambiance', '🎶 Good music'],
    },
    review: {
      name: 'Jane Smith',
      description: 'Lovely ambiance with great coffee!',
      tags: ['☕ Excellent coffee', '🎶 Good music'],
      numLikes: 85,
      datePosted: '2023-09-05',
      score: 4.2,
      images: [],
    },
  },
  {
    cafe: {
      id: '4',
      name: 'Blackbird',
      address: '123 Brew St., Coffee City, CA',
      hours: '7:00AM - 9:00PM',
      topTags: ['☕ Excellent coffee', '🪴 Ambiance', '🎶 Good music'],
    },
    review: {
      name: 'Jane Smith',
      description: 'Lovely ambiance with great coffee!',
      tags: ['☕ Excellent coffee', '🎶 Good music'],
      numLikes: 85,
      datePosted: '2023-09-05',
      score: 4.2,
      images: [],
    },
  },
];

export default function Explore() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 5.603717,
    longitude: -0.186964,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [viewMode, setViewMode] = useState<'list' | 'map'>('map'); // State for switching between views
  const [showFilters, setShowFilters] = useState(false); // State to toggle the filter dropdown
  const [emojiTags, setEmojiTags] = useState<string[]>([]); // State to track selected emoji tags
  const mapRef = useRef<MapView>(null); // Reference to the MapView
  const router = useRouter(); // Get the router instance from expo-router
  const [selectedHours, setSelectedHours] = useState('Any'); // Track selected hours
  const [selectedRating, setSelectedRating] = useState('Any'); // Track selected rating]

  // When the search bar is open it makes it not scrollable and closes when you press outside of it
  // WHen its closed it does nothing, making it scrollable
  const searchExitWrapper = (children: React.ReactNode) => {
    if (showFilters) {
      return (
        <TouchableWithoutFeedback onPress={dismissDropdown}>{children}</TouchableWithoutFeedback>
      );
    } else {
      return <>{children}</>;
    }
  };

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

  const dismissDropdown = () => {
    // Hide dropdown when tapping away or outside
    setShowFilters(false);
    Keyboard.dismiss(); // Hide keyboard if it's open
  };

  const handleTagClick = (tag: string) => {
    if (emojiTags.includes(tag)) {
      setEmojiTags(emojiTags.filter((t) => t !== tag));
    } else {
      setEmojiTags([...emojiTags, tag]);
    }
  };

  const handleHourClick = (option: string) => {
    setSelectedHours(option);
  };

  const handleRatingClick = (option: string) => {
    setSelectedRating(option);
  };

  return searchExitWrapper(
    <View>
      {/* Top Bar with Dummy Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={{ marginRight: 5 }}>
            <Icon name="search" size={20} color="#8a8888" />
          </View>
          <TextInput
            placeholder="Search a cafe, characteristic, etc."
            placeholderTextColor="#888"
            onFocus={() => setShowFilters(true)} // Show filters when search is focused
          />
        </View>
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

      {/* Filter dropdown */}
      {showFilters && (
        <View style={styles.filterDropdown}>
          <ScrollView>
            {/* Hours Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>
                {/* idk why the icon is floating weird */}
                <MaterialIcons name="schedule" size={16} /> Hours
              </Text>
              <View style={styles.filterButtonsContainer}>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedHours === 'Any' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleHourClick('Any')}>
                  <Text>Any</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedHours === 'Open Now' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleHourClick('Open Now')}>
                  <Text>Open now</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedHours === 'Custom' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleHourClick('Custom')}>
                  <Text>Custom</Text>
                </Pressable>
              </View>
            </View>

            {/* Ratings Section */}
            <View style={styles.filterSection}>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} />
                <Text style={styles.filterSectionTitle}> Rating</Text>
                <Text style={styles.atLeastText}> at least</Text>
              </View>
              <View style={styles.filterButtonsContainer}>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedRating === 'Any' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleRatingClick('Any')}>
                  <Text>Any</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedRating === '3.0' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleRatingClick('3.0')}>
                  <Text>3.0</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedRating === '4.0' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleRatingClick('4.0')}>
                  <Text>4.0</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.filterButton,
                    selectedRating === '4.5' ? styles.activeFilterButton : null,
                  ]}
                  onPress={() => handleRatingClick('4.5')}>
                  <Text>4.5</Text>
                </Pressable>
              </View>

              {/* Tags Section */}
              <View style={styles.morefilterContainer}>
                <Text style={styles.filterSectionTitle}>More Filters</Text>
                <View style={styles.emojiContainer}>
                  {cafeTags.map((tag, index) => (
                    <Pressable onPress={() => handleTagClick(tag)} key={index}>
                      <EmojiTag key={index} tag={tag} filled={emojiTags.includes(tag)} />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

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
        <FlatList
          data={mockCafes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ListCard cafe={item.cafe} review={item.review} />}
          contentContainerStyle={styles.listView}
        />
      )}
    </View>,
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
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Align buttons in the center
  },
  toggleButton: {
    width: 70, // Fixed width for smaller buttons
    padding: 5,
    paddingVertical: 7,
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
    paddingTop: 170, // Adjust this based on searchBar height
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 90, // a bit of room for the navbar
  },
  filterDropdown: {
    position: 'absolute',
    top: 120, // Position below the top bar
    left: 11,
    zIndex: 200, // Ensure it's on top of other elements
    backgroundColor: '#fbfbfb', // White background for the dropdown
    borderRadius: 30, // Rounded corners
    height: screenHeight * 0.5, // 50% of screen height
    width: screenWidth * 0.95, // 90% of screen width
    borderWidth: 1, // Optional: border to visually distinguish
    borderColor: '#000000', // Optional: light border color
    elevation: 5, // Optional: adds shadow on Android
    paddingHorizontal: 20, // Add padding to the dropdown
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  filterOption: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#333',
  },
  emojiContainer: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    paddingRight: 10,
    marginTop: 10,
  },
  filterSection: {
    marginBottom: 20,
  },
  morefilterContainer: {
    marginTop: 20,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterButton: {
    flex: 1,
    margin: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#ddd',
  },
  atLeastText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center the content
  },
  filterIcon: {
    marginRight: 5,
  },
});
