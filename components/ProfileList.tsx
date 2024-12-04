import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';

interface ProfileListProps {
  list: {
    id: string; // Unique identifier for the list
    name: string; // Name of the list
    cafeCount: number; // Number of cafes in the list
    visibility: boolean; // `true` for public lists, `false` for private lists
    description?: string; // Optional description of the list
  };
}
// Component to display a user's profile list with navigational linking
const ProfileList: React.FC<ProfileListProps> = ({ list }) => {
  return (
    // `Link` is used to navigate to the list's detailed view
    <Link
      href={{
        pathname: '/listView/[listId]',
        params: {
          listId: list.id,
          listName: list.name,
          cafeCount: list.cafeCount,
          description: list.description, // Ensure `description` is included in your data
          visibility: list.visibility.toString(),
        },
      }}
      asChild>
      <Pressable style={styles.container}>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{list.name}</Text>
          <Text style={styles.cafeCount}>
            {list.cafeCount} cafe{list.cafeCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Ionicons
          name={list.visibility ? undefined : 'lock-closed-outline'}
          size={18}
          style={styles.lockIcon}
        />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 4,
  },
  listInfo: {
    flexDirection: 'column',
  },
  listName: {
    fontSize: 14,
    fontWeight: '500',
  },
  cafeCount: {
    fontSize: 12,
    color: 'gray',
  },
  lockIcon: {
    marginLeft: 10,
  },
});

export default ProfileList;
