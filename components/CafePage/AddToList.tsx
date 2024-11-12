import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import EmojiTag from '@/components/EmojiTag';
import { cafeTags, CafeType } from '@/components/CafePage/CafeTypes';
import { addCafeToList } from '@/lib/supabase-utils';
import { supabase } from '@/lib/supabase';

interface Props {
  setAddingToList: (arg: boolean) => void;
  cafe: CafeType;
  userId: string;
}

export default function AddToList({ setAddingToList, cafe, userId }: Props) {
  const [tags, setTags] = useState<string[]>([]);
  const [lists, setLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch user's lists from Supabase on mount
    const fetchUserLists = async () => {
      try {
        const { data, error } = await supabase
          .from('cafeList')
          .select('id, list_name')
          .eq('user_id', userId);

        if (error) throw error;
        setLists((data || []).map((list) => ({ id: list.id, name: list.list_name })));
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchUserLists();
  }, [userId]);

  function handleTagClick(tag: string) {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag],
    );
  }

  async function handleAddToList() {
    if (!selectedListId) {
      Alert.alert('Please select a list to add this cafe to.');
      return;
    }

    try {
      await addCafeToList(cafe.id, userId, selectedListId);
      Alert.alert('Cafe added to your list!');
      setAddingToList(false);
    } catch (error) {
      console.error('Error adding cafe to list:', error);
      Alert.alert('Failed to add cafe to list.');
    }
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 25, gap: 15 }}>
      <Pressable
        onPress={() => setAddingToList(false)}
        style={{ position: 'absolute', top: 10, right: 10 }}>
        <Ionicons name="close" size={26} color="black" />
      </Pressable>

      <Text style={{ fontWeight: 700, fontSize: 24 }}>Add to List</Text>

      {/* Render available lists */}
      <View style={{ width: '100%', paddingHorizontal: 20 }}>
        <Text style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Your Lists</Text>
        {lists.map((list) => (
          <Pressable
            key={list.id}
            onPress={() => setSelectedListId(list.id)}
            style={{
              padding: 10,
              marginVertical: 5,
              borderRadius: 5,
              backgroundColor: selectedListId === list.id ? '#CCCCCC' : '#f0f0f0',
            }}>
            <Text style={{ fontSize: 16 }}>{list.name}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleAddToList}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#CCCCCC',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        <Text style={{ color: 'white', fontWeight: 700, marginLeft: 8 }}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}
