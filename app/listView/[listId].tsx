import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
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

  // Fetch cafes from the list
  const fetchCafes = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('cafeListEntries')
        .select('cafes(*)')
        .eq('list_id', listId);

      if (error) {
        console.error('Error fetching cafes:', error);
        return;
      }

      // console.log('Raw data from Supabase:', data);

      // Set cafes directly
      setCafes(data?.flatMap((entry) => entry.cafes) || []);
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
    paddingHorizontal: 15,
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
    marginTop: 0,
  },
  cafeCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 40,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#c9c9c9',
    lineHeight: 20,
    fontStyle: 'italic',
    marginLeft: 40,
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
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align cards to the left
    paddingHorizontal: 5, // Optional padding for better spacing
  },
  card: {
    width: '48%', // Ensures two cards fit in one row with space in between
    margin: 5, // Adds spacing between cards
  },
});

export default ListView;
