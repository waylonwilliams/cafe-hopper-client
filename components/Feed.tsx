import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Update = {
    user: string; //update to user object later
    activity?: "rated" | "revisited" ;
    cafe: string;
    loc: string;

}

interface UpdateProps {

}