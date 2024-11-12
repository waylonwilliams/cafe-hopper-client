import { supabase } from '@/lib/supabase';

// Function to get or create a list for "liked" or "to-go"
export const getOrCreateList = async (userId: string, listName: string) => {
  try {
    // Check if the list already exists for the user
    const { data: existingList, error } = await supabase
      .from('cafeList')
      .select('id')
      .eq('user_id', userId)
      .eq('list_name', listName)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (existingList) {
      return existingList.id;
    } else {
      // If not exists, create the list
      const { data, error: insertError } = await supabase
        .from('cafeList')
        .insert([{ user_id: userId, list_name: listName }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data.id;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting or creating list:', error.message);
    } else {
      console.error('Error getting or creating list:', error);
    }
    throw error;
  }
};

// Function to check if a cafe is in a specific list
export const checkCafeInList = async (cafeId: string, userId: string, listName: string) => {
  const listId = await getOrCreateList(userId, listName);

  const { data, error } = await supabase
    .from('cafeListEntries')
    .select('id')
    .eq('cafe_id', cafeId)
    .eq('list_id', listId)
    .eq('user_id', userId)
    .single();

  return !!data; // Returns true if the entry exists, false otherwise
};

// Function to add a cafe to a specific list
export const addCafeToList = async (cafeId: string, userId: string, listName: string) => {
  try {
    const listId = await getOrCreateList(userId, listName);

    // Add the cafe to the list
    const { data, error } = await supabase
      .from('cafeListEntries')
      .insert([{ cafe_id: cafeId, list_id: listId, user_id: userId }]);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding cafe to list:', error.message);
    } else {
      console.error('Error adding cafe to list:', error);
    }
    throw error;
  }
};

// Function to remove a cafe from a specific list
export const removeCafeFromList = async (cafeId: string, userId: string, listName: string) => {
  try {
    const listId = await getOrCreateList(userId, listName);

    const { data, error } = await supabase
      .from('cafeListEntries')
      .delete()
      .eq('cafe_id', cafeId)
      .eq('list_id', listId)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error removing cafe from list:', error.message);
    } else {
      console.error('Error removing cafe from list:', error);
    }
    throw error;
  }
};
