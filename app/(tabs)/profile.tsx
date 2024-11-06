import { Link } from 'expo-router';
import { Text, SafeAreaView, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);

  // run this function once on load to get initial auth state
  useEffect(()  => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log('Error getting session on profile load:', error);
      }

      if (data.session) {
        console.log('Session:', data.session);
        setLoggedIn(true);
      }
    };

    checkAuth();

    // this runs whenever the user logs in / logs out, right now I store in loggedIn variable
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Event:', event);
      console.log('Session:', session);
      if (session) {
        setLoggedIn(true);
      } else{
        setLoggedIn(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Profile page {loggedIn? 'Hello' : 'Please log in'}</Text>
      {/* <Link href="../sign_up" asChild> */}
      {/* <Link href="../login" asChild> */}
      {/* <Link href="../start" asChild> */}
      {/* <Link href="../custom_profile" asChild>*/}
      <Link href={loggedIn ? "../custom_profile" : "../sign_up"} asChild>
        <Pressable>
          <Text>{loggedIn ? 'Go to Profile' : 'Go to Sign Up'}</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
