import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';

interface ProfileListProps {
  list: {
    id: string;
    name: string;
    cafeCount: number;
    visibility: boolean; // true for public, false for private
    description?: string;
  };
}

const ProfileList: React.FC<ProfileListProps> = ({ list }) => {
  return (
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
