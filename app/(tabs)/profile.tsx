import { Link } from 'expo-router';
import { Text, SafeAreaView, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);

  // run this function once on load to get initial auth state
  async function isLoggedIn() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Error getting session on profile load:', error);
    }

    if (data.session) {
      console.log('Session:', data.session);
      setLoggedIn(true);
    }
  }
  isLoggedIn();

  // this runs whenever the user logs in / logs out, right now I store in loggedIn variable
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Event:', event);
    console.log('Session:', session);
    if (session) setLoggedIn(true);
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Profile page {loggedIn && 'Hello world'}</Text>
      {/* <Link href="../sign_up" asChild> */}
      <Link href="../login" asChild>
        {/* <Link href="../start" asChild> */}
        <Pressable>
          <Text>Open start page</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
