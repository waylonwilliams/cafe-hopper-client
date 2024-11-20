import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, Alert, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '@/lib/supabase';

interface NewListProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onListCreated: () => void;
}

export default function NewList({ visible, onClose, userId, onListCreated }: NewListProps) {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreateList = async () => {
    if (!listName) {
      Alert.alert('Please enter a list name.');
      return;
    }

    try {
      const { error } = await supabase
        .from('cafeList')
        .insert([{ user_id: userId, list_name: listName, description, public: isPublic }])
        .select()
        .single();

      if (error) throw error;

      Alert.alert('List created successfully!');
      setListName('');
      setDescription('');
      onListCreated();
      onClose();
    } catch (error) {
      console.error('Error creating list:', error);
      Alert.alert('Failed to create list.');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>New List</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>

          {/* Input Fields */}
          <Text style={styles.label}>Name this List</Text>
          <TextInput
            placeholder="Enter list name"
            value={listName}
            onChangeText={setListName}
            style={styles.input}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descriptionInput]}
            multiline
          />

          {/* Privacy Options */}
          <View style={styles.privacyContainer}>
            <Pressable style={styles.privacyOption} onPress={() => setIsPublic(true)}>
              <Ionicons name="earth" size={20} color={isPublic ? 'black' : '#CCCCCC'} />
              <Text style={[styles.privacyText, isPublic && styles.selectedText]}>Public</Text>
            </Pressable>
            <Pressable style={styles.privacyOption} onPress={() => setIsPublic(false)}>
              <Ionicons name="lock-closed" size={20} color={!isPublic ? 'black' : '#CCCCCC'} />
              <Text style={[styles.privacyText, !isPublic && styles.selectedText]}>Private</Text>
            </Pressable>
          </View>

          {/* Create Button */}
          <Pressable onPress={handleCreateList} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  descriptionInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  selectedText: {
    color: 'black',
  },
  createButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
