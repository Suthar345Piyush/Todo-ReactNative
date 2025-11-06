import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import useTheme, { ColorScheme } from '@/hooks/useTheme';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Index()  {
  const {toggleDarkMode , colors} = useTheme();

  const styles = createStyles(colors);


  return (
    <View style={styles.container}>
       <Text style={styles.content}>Edit the content</Text>
       <Text>h1</Text>
       <TouchableOpacity onPress={toggleDarkMode}>
             <Text>Click me</Text>
       </TouchableOpacity>
    </View>

  );
}


const createStyles = (colors:ColorScheme) => {
   const styles = StyleSheet.create({
      container : {
         flex : 1,
         justifyContent : "center",
         alignItems : "center",
         gap : 10,
         backgroundColor : colors.bg
      },

      content : {
         fontSize : 22,
      },
   });
   return styles;
}













