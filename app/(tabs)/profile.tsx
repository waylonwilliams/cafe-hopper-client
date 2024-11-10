import { router } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import Profile from '../../components/Profile';

export default function Index() {
  const [loggedIn, setLoggedIn] = useState<string | false>(false);

  // run this function once on load to get initial auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.log('Error getting session on profile load:', error);

      if (data.session) {
        setLoggedIn(data.session.user.id);
      } else {
        // send them to sign up if not logged in
        router.push('/signUp');
      }
    };

    checkAuth();

    // this runs whenever the user logs in / logs out, right now I store in loggedIn variable
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setLoggedIn(session.user.id);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ position: 'relative' }}>
      {loggedIn && <Profile uid={loggedIn} />}
    </SafeAreaView>
  );
}
