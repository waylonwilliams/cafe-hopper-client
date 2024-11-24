import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { CafeType } from '@/components/CafePage/CafeTypes';
import { addCafeToList, removeCafeFromList, checkCafeInList } from '@/lib/supabase-utils';
import { supabase } from '@/lib/supabase';
import NewList from './NewList';

interface Props {
  setAddingToList: (arg: boolean) => void;
  cafe: CafeType;
  userId: string;
  updateCafeView: (listName: string, selected: boolean) => void; // Callback to update cafe view icons for "liked" and "to-go"
}

export default function AddToList({ setAddingToList, cafe, userId, updateCafeView }: Props) {
  const [lists, setLists] = useState<
    { id: string; name: string; selected: boolean; cafeCount: number; visibility: boolean }[]
  >([]);
  const [isNewListVisible, setIsNewListVisible] = useState(false);

  // Define fetchUserLists within AddToList
  const fetchUserLists = async () => {
    try {
      const { data: userLists, error } = await supabase
        .from('cafeList')
        .select('id, list_name, public')
        .eq('user_id', userId);

      if (error) throw error;

      const updatedLists = await Promise.all(
        (userLists || []).map(async (list) => {
          const isSelected = await checkCafeInList(cafe.id, list.list_name);
          const { count, error: countError } = await supabase
            .from('cafeListEntries')
            .select('cafe_id', { count: 'exact' })
            .eq('list_id', list.id);

          if (countError) throw countError;

          return {
            id: list.id,
            name: list.list_name,
            selected: isSelected,
            cafeCount: count || 0,
            visibility: list.public,
          };
        }),
      );
      setLists(updatedLists);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  useEffect(() => {
    fetchUserLists();
  }, [userId, cafe.id, fetchUserLists]);

  const handleNewListCreated = () => {
    setIsNewListVisible(false);
    fetchUserLists(); // Refresh the lists when a new one is created
  };

  function toggleListSelection(listId: string, listName: string) {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === listId) {
          const newSelected = !list.selected;
          if (listName.toLowerCase() === 'liked' || listName.toLowerCase() === 'to-go') {
            updateCafeView(listName, newSelected); // Only update cafe view for "liked" and "to-go"
          }
          return { ...list, selected: newSelected };
        }
        return list;
      }),
    );
  }

  async function handleAddToList() {
    try {
      for (const list of lists) {
        if (list.selected) {
          // Add cafe to the list by list ID directly, ensuring no new list is created
          await addCafeToList(cafe.id, list.id);
        } else {
          // Remove cafe from the list by list ID
          await removeCafeFromList(cafe.id, list.id);
        }
      }
      Alert.alert('Cafe list updated!');
      setAddingToList(false);
    } catch (error) {
      console.error('Error updating cafe lists:', error);
      Alert.alert('Failed to update cafe lists.');
    }
  }

  function getListIcon(listName: string) {
    if (listName.toLowerCase() === 'liked') {
      return 'heart';
    } else if (listName.toLowerCase() === 'saved' || listName.toLowerCase() === 'to-go') {
      return 'bookmark';
    } else {
      return 'list';
    }
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 25, gap: 15 }}>
      <Pressable
        onPress={() => setAddingToList(false)}
        style={{ position: 'absolute', top: 10, right: 10 }}>
        <Ionicons name="close" size={26} color="black" />
      </Pressable>

      <Text style={{ fontWeight: 700, fontSize: 24, marginBottom: 5 }}>Save to List</Text>

      {/* Render New List Button */}
      <Pressable
        onPress={() => setIsNewListVisible(true)}
        style={{
          backgroundColor: '#CCCCCC',
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderRadius: 30,
          marginBottom: 10,
          alignItems: 'center',
          width: '40%',
        }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>New List</Text>
      </Pressable>

      {/* Render available lists */}
      <View style={{ width: '100%', paddingHorizontal: 20 }}>
        {lists.map((list) => (
          <View
            key={list.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#E0E0E0',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons
                name={getListIcon(list.name)}
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={{ fontSize: 16 }}>{list.name}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>
                  {list.cafeCount} cafe{list.cafeCount === 1 ? '' : 's'} -{' '}
                  {list.visibility ? 'public ' : 'private '}
                  list
                </Text>
                {/* Display the cafe count here */}
              </View>
            </View>
            <Pressable onPress={() => toggleListSelection(list.id, list.name)}>
              <Ionicons
                name={list.selected ? 'checkbox' : 'square-outline'}
                size={20}
                color="black"
              />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleAddToList}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#CCCCCC',
          padding: 10,
          borderRadius: 30,
          marginTop: 20,
          width: '80%',
          justifyContent: 'center',
        }}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        <Text style={{ color: 'white', fontWeight: 700, marginLeft: 8 }}>Done</Text>
      </Pressable>

      <NewList
        visible={isNewListVisible}
        onClose={() => setIsNewListVisible(false)}
        userId={userId}
        onListCreated={handleNewListCreated}
      />
    </ScrollView>
  );
}
