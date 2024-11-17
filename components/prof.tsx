import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Image, ScrollView, FlatList } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardComponent from '@/components/Card';
import ProfileList from './ProfileList';
interface Profile {
  name: string;
  location: string;
  bio: string;
  pfp: string;
}

export default function Prof() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    location: '',
    bio: '',
    pfp: '',
  });

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

  interface UserList {
    id: string;
    name: string;
    cafeCount: number;
    visibility: boolean;
  }

  const [userLists, setUserLists] = useState<UserList[]>([]); // State to hold user's lists
  useEffect(() => {
    const fetchUserProfileAndLists = async () => {
      const userId = (await supabase.auth.getSession())?.data.session?.user.id;

      // Fetch Profile Data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, location, bio, pfp')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch User Lists
      const { data: userLists, error: listsError } = await supabase
        .from('cafeList')
        .select('id, list_name, public')
        .eq('user_id', userId);

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
          };
        }),
      );

      setUserLists(formattedLists);
    };

    fetchUserProfileAndLists();
  }, []);

  return (
    <ScrollView>
      {/* Profile */}
      <View style={styles.pfpContainer}>
        {/* Profile Picture */}
        <Image source={{ uri: profile.pfp || 'default-image-url' }} style={styles.pfp} />

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.editButton}>
              <Link href="../customProfile" asChild>
                <Pressable>
                  <Text style={styles.edit}>{'Edit Profile'}</Text>
                </Pressable>
              </Link>
              <TouchableOpacity>
                <Icon name="edit" size={14}></Icon>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.stats}>
            {/* PLACEHOLDERS */}
            <Text style={styles.numbers}>0</Text>
            <Text style={styles.numbers}>0</Text>
            <Text style={styles.numbers}>0</Text>
            <Text style={styles.numbers}>0</Text>
          </View>

          <View style={styles.stats}>
            {/* PLACEHOLDERS */}
            <Text style={styles.statText}>Cafes</Text>
            <Text style={styles.statText}>This Year</Text>
            <Text style={styles.statText}>Followers</Text>
            <Text style={styles.statText}>Following</Text>
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

      {/* Lists */}
      <View style={styles.recent}>
        <Text style={styles.listText}>Lists</Text>
        {userLists.map((list) => (
          <ProfileList key={list.id} list={list} />
        ))}
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
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 8,
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
