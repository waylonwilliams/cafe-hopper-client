import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const ListView = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { listId, listName, cafeCount, visibility, description } = params;

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
});

export default ListView;
