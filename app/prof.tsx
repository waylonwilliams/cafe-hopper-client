import { Alert, AppState } from 'react-native';
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, ScrollView, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardComponent from '@/components/Card';

interface Profile {
    name: string;
    location: string;
    bio: string;
    pfp: string;
}

export default function Index() {
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

  useEffect(() => {
    // Fetch user profile data when the component mounts
    
    const fetchProfile = async () => {
        const uid = (await supabase.auth.getSession())?.data.session?.user.id;
        const { data, error } = await supabase
            .from('profiles')
            .select('name, location, bio, pfp')
            .eq('user_id', uid)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
        } else {
            setProfile(data); // Store profile data in state
        }
    };

    fetchProfile();
  }, []);

  return (
        <ScrollView>

            {/* Profile */}
            <View style={styles.pfpContainer}>
                {/* PLACEHOLDER --  ADD IMAGE UPLOAD*/}
                <Image 
                    source={{ uri: profile.pfp || 'default-image-url' }} 
                    style={styles.pfp}
                />

                <Text style={styles.name}>{profile.name}</Text>
                <View style={styles.editButton}>
                    <Link href="../custom_profile" asChild>
                        <Pressable>
                        <Text>{'Edit Profile'}</Text>
                        </Pressable>
                    </Link>
                    <TouchableOpacity>
                        <Icon name='edit' size={16}></Icon>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Recent Likes */}
            <View style={styles.recent}>
                <Text>Recent Likes</Text>
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

  name: {
    fontSize: 30,
    padding: 5,
    marginLeft: 15,
    marginRight: 10,

  },

  editButton: {
    flexDirection: 'row',
    height: 30,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  
  recent:{
    padding: 20,

  },

  carousel: {
    height: 230,
  },

});
