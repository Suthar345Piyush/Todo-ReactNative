import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useTheme from '@/hooks/useTheme';
import { createHomeStyles } from '@/assets/images/styles/home.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import {LinearGradient} from "expo-linear-gradient";
import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';


export default function Index()  {
  const {toggleDarkMode , colors} = useTheme();

  const homeStyles = createHomeStyles(colors);


  return (
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      <StatusBar barStyle={colors.statusBarStyle}/>
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />

        <TodoInput />
        
         <Text>hi</Text>
      </SafeAreaView>
   </LinearGradient>

  );
}















