import { Alert, AppState } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button, Input } from '@rneui/themed'
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable } from 'react-native';
import {router} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome';
import {MaterialCommunityIcons} from '@expo/vector-icons';

function goBack() {
  // setLoggingVisit(false);
  router.back();
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})


  
const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ConfPwd: ', confPassword);
    if (password == confPassword){
      console.log('pwds match');
      if (password)
      setLoading(true)
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

      if (error) Alert.alert(error.message)
      if (!session) Alert.alert('Please check your inbox for email verification!')
      setLoading(false)
    } else {
      Alert.alert('Passwords do not match!')
    }

    
  }

  const handleLogin = () => {
    // Perform login logic here, e.g., API call
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const goToLogin = () => {
    console.log('go to login');
  }

    
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    
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
          placeholder="Username or Email"
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
        placeholderTextColor='black'

        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
       /> 
      <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
          />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="black" />
        <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor='black'

        secureTextEntry={!showPassword}
        value={confPassword}
        onChangeText={setConfPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
          />
      </View>

      <View style={styles.altLogin}> 
        <Text>or sign in with</Text>
        <Image style={styles.google} source={require('@/assets/images/Google.png')}></Image>
      </View>
      
      <View style={styles.signupButton}>
        <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
        <Text style={styles.buttonText}>Start exploring</Text>
        <Image style={styles.arrow} source={require('@/assets/images/arrow.png')}></Image>

      </TouchableOpacity>

      <TouchableOpacity onPress={goToLogin}>
      <Text style={styles.alt}>Already have an account? Login</Text>
      </TouchableOpacity>
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    // borderWidth:1,
    marginTop: 150,
    marginBottom: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  }, 
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    // marginBottom: 40,
    // width: '90%',
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
  back:{
    width: 30,
    height: 30,

  },
  
  input: {
    flex:1,
    width: '100%',
    height: 55,
    paddingLeft: 10,
    borderRadius: 20,
  },

  altLogin:{
    marginTop: 20,
    alignItems: 'center',
  },
  signupButton: {
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,    
    borderRadius: 32.05, // Half of height for pill shape
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    elevation: 5, // Shadow for Android
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:70,
    marginBottom: 20,
  },
  buttonText: {
    color: 'black', // Text color
    fontSize: 16, // Text size
    fontWeight: 'bold', // Text weight
    paddingRight: 10,
  },
  alt: {
    // marginTop:20,

  },
  alt2: {
    
  },
  alt_opt: {
    flexDirection: 'row',
  },
  google: {
    marginTop:10,
  }
  
});

export default SignUpScreen;
