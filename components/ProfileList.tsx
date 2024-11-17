import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ProfileListProps {
  list: {
    id: string;
    name: string;
    cafeCount: number;
    visibility: boolean; // true for public, false for private
  };
}

const ProfileList: React.FC<ProfileListProps> = ({ list }) => {
  return (
    <View style={styles.container}>
      <View style={styles.listInfo}>
        <Text style={styles.listName}>{list.name}</Text>
        <Text style={styles.cafeCount}>
          {list.cafeCount} cafe{list.cafeCount !== 1 ? 's' : ''}
        </Text>
      </View>
      {!list.visibility && (
        <Ionicons name="lock-closed-outline" size={18} color="gray" style={styles.lockIcon} />
      )}
    </View>
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
    borderRadius: 10,
    marginVertical: 8,
    width: '97%',
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
