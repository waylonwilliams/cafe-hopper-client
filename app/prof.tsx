import { Alert, AppState } from 'react-native';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, ScrollView, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardComponent from '@/components/Card';


export default function Index() {
    const [name, setName] = useState('');
  const [loc, setLoc] = useState('');
  const [bio, setBio] = useState('');
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

  return (
    <SafeAreaView>
        <ScrollView>

            {/* Profile */}
            <View style={styles.pfpContainer}>
                {/* PLACEHOLDER --  ADD IMAGE UPLOAD*/}
                <Image style={styles.pfp}/>

                <Text>Name</Text>
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
    </SafeAreaView>
    
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

  editButton: {
    flexDirection: 'row',
    height: 30,
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  
  recent:{
    padding: 20,

  },

  carousel: {
    height: 230,
  },

});
