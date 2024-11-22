import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import CardComponent from '@/components/Card';
import { supabase } from '@/lib/supabase';
import { CafeType } from '@/components/CafePage/CafeTypes';

const ListView = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { listId, listName, cafeCount, visibility, description } = params;

  const [cafes, setCafes] = useState<CafeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch cafes from the list
  const fetchCafes = async (): Promise<void> => {
    try {
      const { data: user } = await supabase.auth.getUser(); // Get logged-in user
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const { data, error } = await supabase
        .from('cafeListEntries')
        .select(
          `
        cafes(
          id, 
          created_at, 
          title, 
          hours, 
          latitude, 
          longitude, 
          address, 
          tags, 
          image, 
          summary, 
          rating, 
          num_reviews
        ), 
        user_id
        `,
        ) // Ensure this matches your actual database schema
        .eq('list_id', listId);

      if (error) {
        console.error('Error fetching cafes:', error);
        return;
      }

      // Check ownership
      if (data && data.length > 0 && user.user?.id === data[0].user_id) {
        setIsOwner(true); // Set ownership flag
      }

      // console.log('Raw data from Supabase:', data);

      // Map the fetched cafes to match the CafeType structure
      const mappedCafes: CafeType[] =
        data?.flatMap((entry: { cafes: any }) => {
          if (entry.cafes) {
            const cafe = entry.cafes;
            return {
              id: cafe.id,
              created_at: cafe.created_at,
              name: cafe.title, // Map 'title' to 'name'
              hours: cafe.hours,
              latitude: cafe.latitude,
              longitude: cafe.longitude,
              address: cafe.address,
              tags: cafe.tags || [], // Default to an empty array if null
              image: cafe.image, // Single top image
              summary: cafe.summary || null,
              rating: cafe.rating, // Convert rating for display
              num_reviews: cafe.num_reviews,
            };
          }
          return [];
        }) || [];

      setCafes(mappedCafes);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, [listId]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backButtonContainer}>
              <Ionicons name="chevron-back-outline" size={28} color="#c9c9c9" />
            </Pressable>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{listName}</Text>
              <Ionicons
                name={visibility === 'true' ? 'earth-outline' : 'lock-closed-outline'}
                size={20}
                color="#000"
                style={styles.visibilityIcon}
              />
            </View>
            {/* Edit Button */}
            {isOwner && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => alert('Edit List functionality here')}>
                <Text style={styles.editButtonText}>Edit List</Text>
                <Ionicons name="pencil-outline" size={16} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          {/* Cafe Count and Description */}
          <View style={styles.details}>
            <Text style={styles.cafeCount}>
              {cafeCount} cafe{Number(cafeCount) !== 1 ? 's' : ''}
            </Text>
            {description && <Text style={styles.description}>{description}</Text>}
          </View>

          {/* Cafe Cards */}
          {loading ? (
            <Text style={styles.loading}>Loading cafes...</Text>
          ) : cafes.length === 0 ? (
            <Text style={styles.empty}>No cafes in this list.</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.cardContainer}>
              {cafes.map((cafe, index) => (
                <View key={cafe.id || index} style={styles.card}>
                  <CardComponent cafe={cafe} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20, // Slightly reduce padding for better spacing
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  backButtonContainer: {
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  visibilityIcon: {
    marginLeft: 8,
  },
  details: {
    marginLeft: 40,
    marginTop: 0,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 15,
  },
  editButtonText: {
    marginRight: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  cafeCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#c9c9c9',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Wrap cards to create rows
    justifyContent: 'space-between', // Spread cards evenly in the row
    paddingHorizontal: 20, // Optional padding for better spacing
    paddingTop: 10, // Add space above the cards
  },
  card: {
    width: '48%', // Two cards per row with space
    marginBottom: 10, // Add space below each card
  },
});

export default ListView;
