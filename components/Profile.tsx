import { supabase } from '@/lib/supabase';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, FlatList } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardComponent from '@/components/Card';
import ProfileList from './ProfileList';
import { CafeType } from './CafePage/CafeTypes';

// setup with props so this can be used for other ppls profiles in the future
interface Props {
  uid: string;
  setViewingImages: React.Dispatch<React.SetStateAction<string[] | null>>;
}

interface ProfileType {
  name: string;
  bio: string;
  location: string;
  pfp: string | null;
}

// how to refresh on router.back()?

export default function Profile({ uid, setViewingImages }: Props) {
  const [profile, setProfile] = useState<ProfileType>({
    name: '',
    location: '',
    bio: '',
    pfp: '',
  });
  // store if it is their profile in this state
  const [owner, setOwner] = useState(false);

  {
    /* Dummy Cafes */
  }
  const cafes = [
    {
      id: 'alo',
      created_at: '2021-08-01T00:00:00.000Z',
      title: "Cafe Oshima's",
      address: '2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam',
      tags: [
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
      latitude: 10.7743,
      longitude: 106.686,
      image: require('../assets/images/11th-hour.png'),
      summary: 'A cozy cafe',
      rating: 9.4,
      num_reviews: 100,
    },
    {
      id: 'jalo',
      created_at: '2021-08-01T00:00:00.000Z',
      title: "Cafe Oshima's",
      address: '2/37 Cao Thang, Ward 5, District 3, Ho Chi Minh City, Vietnam',
      tags: [
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
      latitude: 10.7743,
      longitude: 106.686,
      image: require('../assets/images/11th-hour.png'),
      summary: 'A cozy cafe',
      rating: 9.4,
      num_reviews: 100,
    },
    {
      id: 'bloom',
      created_at: '2021-09-15T00:00:00.000Z',
      title: 'Bloom Cafe',
      address: '123 Flower St, Garden City, NY, USA',
      tags: ['🌸 Floral', '☕ Coffee', '🍰 Desserts', '📚 Books'],
      hours: `7:00AM - 8:00PM Monday
                    7:00AM - 8:00PM Tuesday
                    7:00AM - 8:00PM Wednesday
                    7:00AM - 8:00PM Thursday
                    7:00AM - 8:00PM Friday
                    8:00AM - 9:00PM Saturday
                    8:00AM - 9:00PM Sunday`,
      latitude: 40.7128,
      longitude: -74.006,
      image: require('../assets/images/11th-hour.png'),
      summary: 'A floral-themed cafe',
      rating: 8.7,
      num_reviews: 85,
    },
    {
      id: 'java',
      created_at: '2021-10-20T00:00:00.000Z',
      title: 'Java House',
      address: '456 Coffee Ln, Brewtown, CA, USA',
      tags: ['☕ Coffee', '💻 Work Friendly', '📶 Free Wifi', '🍪 Snacks'],
      hours: `6:00AM - 6:00PM Monday
                    6:00AM - 6:00PM Tuesday
                    6:00AM - 6:00PM Wednesday
                    6:00AM - 6:00PM Thursday
                    6:00AM - 6:00PM Friday
                    7:00AM - 7:00PM Saturday
                    7:00AM - 7:00PM Sunday`,
      latitude: 34.0522,
      longitude: -118.2437,
      image: require('../assets/images/11th-hour.png'),
      summary: 'A perfect place for coffee lovers',
      rating: 9.1,
      num_reviews: 120,
    },
  ] as CafeType[];

  interface UserList {
    id: string;
    name: string;
    cafeCount: number;
    visibility: boolean;
  }

  const [userLists, setUserLists] = useState<UserList[]>([]); // State to hold user's lists

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('name, location, bio, pfp')
            .eq('user_id', uid)
            .single();

          const { data: sessionData } = await supabase.auth.getSession();
          const myUid = sessionData?.session?.user.id;

          let finalProfileData: ProfileType | null = profileData;

          if (profileError || !profileData) {
            // Create a default profile when theirs doesn't exist
            const { data: newProfileData, error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                user_id: uid,
                // remove and use supabase defaults
              })
              .select()
              .single();

            if (upsertError) {
              console.error('Creating new profile error: ', upsertError);
            } else {
              finalProfileData = newProfileData;
            }
          }

          if (!finalProfileData) {
            throw 'Error fetching profile, neither fetch or upsert returned data';
          }

          setProfile(finalProfileData);
          if (uid === myUid) {
            setOwner(true);
          }
        } catch (error) {
          console.error('Error fetching profile: ', error);
        }

        const { data: userLists, error: listsError } = await supabase
          .from('cafeList')
          .select('id, list_name, description, public') // Ensure description is fetched
          .eq('user_id', uid);

        if (listsError) {
          console.error('Error fetching lists:', listsError);
          return;
        }

        const formattedLists = await Promise.all(
          (userLists || []).map(async (list) => {
            // Fetch cafe count for each list
            const { count: cafeCount, error: countError } = await supabase
              .from('cafeListEntries')
              .select('cafe_id', { count: 'exact' })
              .eq('list_id', list.id);

            if (countError) {
              console.error(`Error fetching cafe count for list :`, countError);
            }

            return {
              id: list.id,
              name: list.list_name,
              cafeCount: cafeCount || 0,
              visibility: list.public,
              description: list.description, // Include description here
            };
          }),
        );

        setUserLists(formattedLists);
      };

      fetchProfile();
    }, [uid]),
  );

  return (
    <ScrollView>
      {/* Profile */}
      <View style={styles.pfpContainer}>
        {/* Profile Picture */}
        <Pressable
          onPress={() => {
            if (profile.pfp) setViewingImages([profile.pfp]);
          }}>
          <Image
            source={profile.pfp ? { uri: profile.pfp } : require('../assets/images/default.jpg')}
            style={styles.pfp}
          />
        </Pressable>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            {owner && (
              <View style={styles.editButton}>
                <Link
                  href={{
                    pathname: '../customProfile',
                    params: {
                      name: profile.name,
                      bio: profile.bio,
                      location: profile.location,
                      pfp: profile.pfp,
                    },
                  }}
                  asChild>
                  <Pressable>
                    <Text style={{ fontSize: 12 }}>Edit Profile</Text>
                  </Pressable>
                </Link>
                <TouchableOpacity>
                  <Icon name="edit" size={14} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ gap: 4 }}>
            {profile.bio !== '' && <Text style={styles.bio}>{profile.bio}</Text>}
            {profile.location !== '' && (
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Icon color="#8a8888" name="location-on" size={14} />
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.numbers}>0</Text>
              <Text style={styles.statText}>Cafes</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.numbers}>0</Text>
              <Text style={styles.statText}>This year</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.numbers}>0</Text>
              <Text style={styles.statText}>Followers</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.numbers}>0</Text>
              <Text style={styles.statText}>Following</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Likes */}
      <View style={styles.recent}>
        <Text style={styles.listText}>Recent Likes</Text>
        {/* PLACEHOLDER */}
        <View>
          <FlatList
            horizontal
            data={cafes}
            renderItem={({ item }) => <CardComponent cafe={item} />}
            keyExtractor={(item) => item.id}
            style={styles.carousel}
          />
        </View>
      </View>

      <View style={styles.recent}>
        <Text style={styles.listText}>Favorite Cafes</Text>
        {/* Cafe Carousel */}
        <View>
          <FlatList
            horizontal
            data={cafes}
            renderItem={({ item }) => <CardComponent cafe={item} />}
            keyExtractor={(item) => item.id}
            style={styles.carousel}
          />
        </View>

        {/* Lists */}
        <View style={styles.recent}>
          <Text style={styles.listText}>Lists</Text>
          <View style={styles.listContainer}>
            {userLists.map((list) => (
              <View key={list.id} style={styles.listItem}>
                <ProfileList list={list} />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pfpContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  pfp: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    borderRadius: 999,
  },
  userInfo: {
    flexDirection: 'column',
    gap: 5,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 25,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  bio: {
    color: '#8a8888',
    fontSize: 12,
    fontWeight: '600',
    paddingLeft: 3, // to match the icon
  },
  location: {
    color: '#8a8888',
    fontSize: 12,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  numbers: {
    alignContent: 'center',
  },
  statText: {
    padding: 3,
    fontSize: 12,
  },
  recent: {
    padding: 10,
  },
  listText: {
    fontSize: 18,
  },
  carousel: {
    height: 220,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Enable wrapping to create a grid
    justifyContent: 'space-between', // Add spacing between items
    gap: 1,
  },
  listItem: {
    width: '48%',
    marginBottom: 2,
  },
});
