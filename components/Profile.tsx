import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, FlatList } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardComponent from '@/components/Card';

// setup with props so this can be used for other ppls profiles in the future
interface Props {
  uid: string;
}

interface ProfileType {
  name: string;
  bio: string;
  location: string;
  pfp: string | null;
}

// how to refresh on router.back()?

export default function Profile({ uid }: Props) {
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
      name: '11th Hour Coffee',
      localImage: require('../assets/images/11th-hour.png'),
      rating: 4.6,
      tags: ['🛜', '🪴', '🥐'],
    },
    {
      name: 'The Abbey',
      localImage: require('../assets/images/abbey.png'),
      rating: 4.7,
      tags: ['📚', '☕', '🛜'],
    },
    {
      name: 'Verve',
      localImage: require('../assets/images/verve.png'),
      rating: 4.4,
      tags: ['🪴', '☕', '📚'],
    },
  ];

  useEffect(() => {
    // Fetch user profile data when the component mounts

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

        if (profileError) {
          // Create a default profile when theirs doesn't exist
          const { data: newProfileData, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              user_id: uid,
              name: 'Cafe lover',
              location: 'Cafe',
              bio: 'I love cafes!',
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
    };

    fetchProfile();
  }, []);

  return (
    <ScrollView>
      {/* Profile */}
      <View style={styles.pfpContainer}>
        {/* Profile Picture */}
        <Image
          source={profile.pfp ? { uri: profile.pfp } : require('../assets/images/default.jpg')}
          style={styles.pfp}
        />

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
                    <Text style={styles.edit}>Edit Profile</Text>
                  </Pressable>
                </Link>
                <TouchableOpacity>
                  <Icon name="edit" size={14} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.bio}>{profile.bio}</Text>

          <Text style={styles.location}>{profile.location}</Text>

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
            renderItem={({ item }) => <CardComponent card={item} />}
            keyExtractor={(item) => item.name}
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
            renderItem={({ item }) => <CardComponent card={item} />}
            keyExtractor={(item) => item.name}
            style={styles.carousel}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pfpContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 20,
  },
  pfp: {
    width: 100,
    height: 100,
    backgroundColor: 'gray',
    borderRadius: 999,
  },
  userInfo: {
    flexDirection: 'column',
    marginLeft: 15,
    gap: 3,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 25,
    padding: 5,
    marginRight: 10,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    height: 25,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  edit: {
    fontSize: 12,
    marginRight: 5,
  },
  bio: {
    color: '#8a8888',
    fontSize: 12,
    fontWeight: '600',
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
    marginLeft: 25,
    marginRight: 25,
    alignContent: 'center',
  },
  statText: {
    padding: 3,
    marginLeft: 5,
    fontSize: 12,
  },
  recent: {
    padding: 5,
    marginLeft: 10,
    marginBottom: 5,
  },
  listText: {
    fontSize: 18,
    marginBottom: 5,
  },
  carousel: {
    height: 220,
  },
});
