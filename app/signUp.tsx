import { Alert, AppState } from 'react-native';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignUpScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (password === confPassword) {
      if (password) setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) Alert.alert(error.message);

      // create corresponding profile on signup
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ user_id: data.user?.id });
      if (profileError) Alert.alert(profileError.message);

      // add two default lists to the users account on creation
      const { error: listError } = await supabase
        .from('cafeList')
        .upsert([{ list_name: 'liked' }, { list_name: 'to-go' }]);
      if (listError) Alert.alert(listError.message);
      // supabase signup will also log them in, so just send them to tabs
      if (!error) router.replace('/(tabs)');
      setLoading(false);
    } else {
      Alert.alert('Passwords do not match');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create an account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="black"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#aaa"
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="black" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="black"
          secureTextEntry={!showPassword}
          value={confPassword}
          onChangeText={setConfPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#aaa"
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>

      <View style={styles.altLogin}>
        <Text>or sign in with</Text>
        <Image style={styles.google} source={require('@/assets/images/Google.png')}></Image>
      </View>

      <View style={styles.signupButton}>
        <TouchableOpacity
          style={styles.guestbutton}
          onPress={() => router.replace('/(tabs)')}
          disabled={loading}>
          <Text style={styles.guestText}>Continue as guest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
          <Text style={styles.buttonText}>Start exploring</Text>
          <Image source={require('@/assets/images/arrow.png')}></Image>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    marginTop: 150,
    marginBottom: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  back: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    width: '100%',
    height: 55,
    paddingLeft: 10,
    borderRadius: 20,
  },
  altLogin: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  guestbutton: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 32.05, // Half of height for pill shape
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 5, // Shadow for Android
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderRadius: 32.05, // Half of height for pill shape
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 5, // Shadow for Android
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black', // Text color
    fontSize: 16, // Text size
    fontWeight: 'bold', // Text weight
    paddingRight: 10,
  },
  guestText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  alt_opt: {
    flexDirection: 'row',
  },
  google: {
    marginTop: 10,
  },
});

export default SignUpScreen;
