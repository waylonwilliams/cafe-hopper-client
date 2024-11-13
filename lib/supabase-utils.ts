import { supabase } from '@/lib/supabase';

const getUserId = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('User is not authenticated or userId is null');
  }
  return data.user.id;
};

// Function to get or create a list for "liked" or "to-go"
export const getOrCreateList = async (listName: string) => {
  const userId = await getUserId();
  try {
    const { data: existingList, error } = await supabase
      .from('cafeList')
      .select('id')
      .eq('user_id', userId)
      .eq('list_name', listName)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (existingList) {
      return existingList.id;
    } else {
      // Create the list if it does not exist
      const { data, error: insertError } = await supabase
        .from('cafeList')
        .insert([{ user_id: userId, list_name: listName }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data.id;
    }
  } catch (error) {
    console.error(
      'Error getting or creating list:',
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};

// Function to check if a cafe is in a specific list
export const checkCafeInList = async (cafeId: string, listName: string) => {
  const userId = await getUserId();
  const listId = await getOrCreateList(listName);

  const { data, error } = await supabase
    .from('cafeListEntries')
    .select('id')
    .eq('cafe_id', cafeId)
    .eq('list_id', listId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data; // Returns true if the entry exists, false otherwise
};

// Function to add a cafe to a specific list
export const addCafeToList = async (cafeId: string, listName: string) => {
  const userId = await getUserId();
  const listId = await getOrCreateList(listName);

  const { data, error } = await supabase
    .from('cafeListEntries')
    .insert([{ cafe_id: cafeId, list_id: listId, user_id: userId }]);

  if (error) throw error;
  return data;
};

// Function to remove a cafe from a specific list
export const removeCafeFromList = async (cafeId: string, listName: string) => {
  const userId = await getUserId();
  const listId = await getOrCreateList(listName);

  const { data, error } = await supabase
    .from('cafeListEntries')
    .delete()
    .eq('cafe_id', cafeId)
    .eq('list_id', listId)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};
