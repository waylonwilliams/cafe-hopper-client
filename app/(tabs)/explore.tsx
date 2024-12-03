import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { MarkerType } from '../../components/CustomMarker';
import CustomMarker from '../../components/CustomMarker';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListCard from '@/components/ListCard';
import { CafeType } from '@/components/CafePage/CafeTypes';
import EmojiTag from '@/components/EmojiTag';
import { cafeTags } from '@/components/CafePage/CafeTypes';
import { searchCafesFromBackend } from '@/lib/backend';
import { CafeSearchRequest, CafeSearchResponse } from '@/lib/backend-types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Explore() {
  // Map region state for initial and updated location
  const [mapRegion, setMapRegion] = useState({
    latitude: 5.603717,
    longitude: -0.186964,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  // Predefined options for filters
  const daysOfWeek = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];
  // States for various UI and search functionalities

  const [scale, setScale] = useState(1); // Scale state for dynamic resizing
  const mapRef = useRef<MapView>(null); // Reference to the MapView
  const router = useRouter(); // Get the router instance from expo-router

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); // State for switching between views
  const [searchQuery, setSearchQuery] = useState(''); // Track search query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchedCafes, setSearchedCafes] = useState<CafeType[]>([]); // Track searched cafes
  const [searchedMarkers, setMarkers] = useState<MarkerType[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedRating, setSelectedRating] = useState('Any'); // Track selected rating
  const [emojiTags, setEmojiTags] = useState<string[]>([]); // State to track selected emoji tags
  const [searchIsFocused, setSearchIsFocused] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  // States for filtering based on time
  const [selectedDay, setSelectedDay] = useState(''); // Track selected day
  const [selectedHours, setSelectedHours] = useState('Any'); // Track selected hours
  const [selectedTime, setSelectedTime] = useState<number>(); // Selected hour
  const [selectedPeriod, setSelectedPeriod] = useState<string>('AM'); // Selected period (AM/PM)

  const convertTo24Hour = (hour: number, period: string): string => {
    const hour24 =
      period === 'PM' && hour !== 12 ? hour + 12 : period === 'AM' && hour === 12 ? 0 : hour;
    return hour24.toString().padStart(2, '0') + '00'; // Format as "XXXX" (e.g., "0700")
  };

  const calculateZoomLevel = (latitudeDelta: number) => {
    // Approximate calculation of zoom level based on latitudeDelta
    return Math.log2(360 / latitudeDelta);
  };

  // Update region and scale dynamically when map region changes
  const handleRegionChangeComplete = (region: typeof mapRegion) => {
    setMapRegion(region);
    const zoomLevel = calculateZoomLevel(region.latitudeDelta);
    const newScale = Math.min(Math.max(zoomLevel / 15, 0.5), 1.5); // Normalize scale between 0.5 and 1.5
    setScale(newScale);
    setMapRegion(region);
  };

  // Handle marker press to navigate to cafe details
  const handleMarkerPress = (marker: MarkerType) => {
    // Navigate to cafe view and pass marker data as parameters
    console.log('Navigating to cafe', marker.name);
    if (marker.cafe) {
      navigateToCafe(marker.cafe);
    }
  };

  // Navigate to cafe details page
  const navigateToCafe = (cafe: CafeType) => {
    if (isNavigating) {
      return;
    }
    setIsNavigating(true);

    try {
      const cafeParams = {
        id: cafe?.id ?? '',
        created_at: cafe?.created_at ?? '',
        name: cafe?.name ?? '',
        address: cafe?.address ?? '',
        hours: cafe?.hours ?? '',
        latitude: cafe?.latitude ?? 0,
        longitude: cafe?.longitude ?? 0,
        tags: Array.isArray(cafe?.tags) ? cafe?.tags.join(',') : '',
        image: cafe?.image ?? '',
        summary: cafe?.summary ?? '',
        rating: cafe?.rating ?? 0,
        num_reviews: cafe?.num_reviews ?? 0,
      };

      // Add a small delay to ensure state updates are complete
      setTimeout(() => {
        router.push({
          pathname: '/cafe',
          params: cafeParams,
        });
      }, 100);
    } catch (error) {
      console.log('Failed to navigate to cafe', error);
    } finally {
      setIsNavigating(false);
    }
  };
  // Debounce the search query to prevent too many requests
  useEffect(() => {
    const handler = setTimeout(() => {
      if (debouncedQuery !== searchQuery) {
        setDebouncedQuery(searchQuery);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debouncedQuery]);

  // Fetch cafes based on search query and filters
  useEffect(() => {
    if (!locationReady) return;

    const handleCustomHourChange = (day?: string, hour?: number, period?: string) => {
      const dayMap = new Map<string, number>([
        ['Sunday', 0],
        ['Monday', 1],
        ['Tuesday', 2],
        ['Wednesday', 3],
        ['Thursday', 4],
        ['Friday', 5],
        ['Saturday', 6],
      ]);
      const dayValue = day ? dayMap.get(day) : undefined;
      const timeString = hour !== undefined && period ? convertTo24Hour(hour, period) : undefined;

      // Construct customTime object for Search Request
      const customTime: {
        day?: number;
        time?: string;
      } = {};

      // Add day and time to customTime object if they exist
      if (dayValue) {
        customTime.day = dayValue;
      }

      if (timeString) {
        customTime.time = timeString;
      }

      return customTime;
    };

    const searchCafes = async (query: string) => {
      try {
        // Build Request Object
        const customTime =
          selectedHours === 'Custom'
            ? handleCustomHourChange(selectedDay, selectedTime, selectedPeriod)
            : undefined;

        const searchRequest: CafeSearchRequest = {
          query,
          geolocation: {
            lat: mapRegion.latitude,
            lng: mapRegion.longitude,
          },
          openNow: selectedHours === 'Open Now',
          rating: selectedRating === 'Any' ? undefined : parseFloat(selectedRating),
          tags: emojiTags,
          customTime,
        };

        // Send it over to the backend server
        const response: CafeSearchResponse = await searchCafesFromBackend(searchRequest);
        if (response.error) throw new Error(response.error);

        // Get top 15 results, since more rendered components can cause performance issues
        const fetchedCafes: CafeType[] = response.cafes.slice(0, 15);

        const cafes = [];
        const markers: MarkerType[] = [];
        for (const cafe of fetchedCafes) {
          const newCafe = {
            id: cafe.id,
            name: cafe.name ? cafe.name : '',
            address: cafe.address ? cafe.address : '',
            hours: cafe.hours ? cafe.hours : '',
            tags: cafe.tags ? cafe.tags : [],
            created_at: cafe.created_at ? cafe.created_at : '',
            latitude: cafe.latitude ? cafe.latitude : 0,
            longitude: cafe.longitude ? cafe.longitude : 0,
            rating: cafe.rating ? cafe.rating : 0,
            num_reviews: cafe.num_reviews ? cafe.num_reviews : 0,
            image: cafe.image ? cafe.image : '',
            summary: cafe.summary ? cafe.summary : '',
          };
          cafes.push(newCafe);

          markers.push({
            name: cafe.name,
            latitude: cafe.latitude,
            longitude: cafe.longitude,
            rating: cafe.rating ? cafe.rating.toString() : '0',
            category: 'default',
            cafe: newCafe, // Attach the cafe data to the marker for navigation
          });
        }

        // Update the states with the fetched cafes and markers
        setSearchedCafes(cafes);
        setMarkers(markers);
      } catch (error) {
        console.error('Error searching for cafes:', error);
      }
    };
    searchCafes(debouncedQuery);
  }, [
    debouncedQuery,
    mapRegion,
    selectedHours,
    selectedRating,
    emojiTags,
    locationReady,
    selectedDay,
    selectedTime,
    selectedPeriod,
  ]);

  // Request user location and update the map
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

    setLocationReady(true);
  };

  useEffect(() => {
    userLocation();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleTagClick = (tag: string) => {
    if (emojiTags.includes(tag)) {
      setEmojiTags(emojiTags.filter((t) => t !== tag));
    } else {
      setEmojiTags([...emojiTags, tag]);
    }
    handleSearch(searchQuery);
  };

  const handleHourClick = (option: string) => {
    setSelectedHours(option);
    handleSearch(searchQuery);
  };

  const handleRatingClick = (option: string) => {
    setSelectedRating(option);
    handleSearch(searchQuery);
  };

  const handleTimeClick = (hour: number) => {
    if (selectedTime === hour) {
      setSelectedTime(undefined);
      return;
    }
    setSelectedTime(hour);
  };

  const handleDayClick = (day: string) => {
    if (selectedDay === day) {
      setSelectedDay('');
      return;
    }
    setSelectedDay(day);
  };

  return (
    <View>
      {/** Top Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={{ marginRight: 5 }}>
            <Icon name="search" size={20} color="#8a8888" />
          </View>
          <TextInput
            placeholder="Search a cafe, characteristic, etc."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => handleSearch(text)}
            // onFocus and onBlur to toggle the filter dropdown whether or not the search bar is open
            // no need to have it press off because the keyboard is in the way anyway
            onFocus={() => setSearchIsFocused(true)}
            onBlur={() => setSearchIsFocused(false)}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={(text) => handleSearch(text.nativeEvent.text)}
            testID="search-bar"
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

      {searchIsFocused && (
        <View style={styles.filterDropdown}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hours Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>
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
                  onPress={() => setSelectedHours('Custom')}>
                  <Text>Custom</Text>
                </Pressable>
              </View>
              {selectedHours === 'Custom' && (
                <View style={styles.customHourContainer}>
                  {/* Days of the Week */}
                  <Text style={styles.customHourLabel}>Select Day:</Text>
                  <View style={styles.daysRow}>
                    {daysOfWeek.map((day, index) => (
                      <Pressable
                        key={index}
                        style={[
                          styles.smallCircleButton,
                          selectedDay === day.value ? styles.activeSmallCircleButton : null,
                        ]}
                        onPress={() => handleDayClick(day.value)}>
                        <Text
                          style={[
                            styles.smallCircleButtonText,
                            selectedDay === day.value ? styles.activeSmallCircleButtonText : null,
                          ]}>
                          {day.label.slice(0, 3).toUpperCase()}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Times of the Day */}
                  <Text style={styles.customHourLabel}>Select Time:</Text>
                  <View style={styles.twoRowContainer}>
                    {/* First row: Hours 1-6 */}
                    <View style={styles.hourRow}>
                      {Array.from({ length: 6 }, (_, i) => i + 1).map((hour) => (
                        <Pressable
                          key={hour}
                          style={[
                            styles.smallCircleButton,
                            selectedTime === hour ? styles.activeSmallCircleButton : null,
                          ]}
                          onPress={() => handleTimeClick(hour)}>
                          <Text
                            style={[
                              styles.smallCircleButtonText,
                              selectedTime === hour ? styles.activeSmallCircleButtonText : null,
                            ]}>
                            {hour}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    {/* Second row: Hours 7-12 */}
                    <View style={styles.hourRow}>
                      {Array.from({ length: 6 }, (_, i) => i + 7).map((hour) => (
                        <Pressable
                          key={hour}
                          style={[
                            styles.smallCircleButton,
                            selectedTime === hour ? styles.activeSmallCircleButton : null,
                          ]}
                          onPress={() => handleTimeClick(hour)}>
                          <Text
                            style={[
                              styles.smallCircleButtonText,
                              selectedTime === hour ? styles.activeSmallCircleButtonText : null,
                            ]}>
                            {hour}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* AM/PM Toggle */}
                  <View style={styles.amPmContainer}>
                    {['AM', 'PM'].map((period) => (
                      <Pressable
                        key={period}
                        style={[
                          styles.smallCircleButton,
                          selectedPeriod === period ? styles.activeSmallCircleButton : null,
                        ]}
                        onPress={() => setSelectedPeriod(period)}>
                        <Text
                          style={[
                            styles.smallCircleButtonText,
                            selectedPeriod === period ? styles.activeSmallCircleButtonText : null,
                          ]}>
                          {period}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
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
            onRegionChangeComplete={handleRegionChangeComplete} // Trigger on zoom or move
            showsMyLocationButton={true}
            testID="map-view"
            mapType="standard">
            {searchedMarkers.map((marker, index) => {
              const validMarker: MarkerType = {
                ...marker,
                category: marker.category as 'liked' | 'saved' | 'default' | undefined,
              };
              return (
                <Marker
                  key={index}
                  coordinate={marker}
                  anchor={{ x: 0.5, y: 0.5 }}
                  calloutAnchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => handleMarkerPress(validMarker)}>
                  <CustomMarker marker={validMarker} scale={scale} />
                </Marker>
              );
            })}
          </MapView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listView}>
          {searchedCafes ? (
            searchedCafes.map(
              (
                cafe, // if no searched cafes, return text saying no cafes found
              ) => (
                <Pressable
                  key={cafe.id}
                  onPress={() => navigateToCafe(cafe)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}>
                  <ListCard cafe={cafe} />
                </Pressable>
              ),
            )
          ) : (
            <Text>No cafes found</Text>
          )}
        </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  filterDropdown: {
    position: 'absolute',
    padding: 10,
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
  customHourContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  customHourLabel: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Ensures equal spacing
    marginTop: 10,
    marginBottom: 15,
  },
  twoRowContainer: {
    marginVertical: 10,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  smallCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeSmallCircleButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  smallCircleButtonText: {
    fontSize: 12,
    color: '#555',
  },
  activeSmallCircleButtonText: {
    color: '#fff',
  },
  amPmContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
