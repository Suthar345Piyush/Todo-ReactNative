import { Ionicons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

const TabsLayout = () => {
  return (
      <Tabs screenOptions={{
           tabBarActiveTintColor : "red",
           tabBarInactiveTintColor : "green",
           tabBarStyle : {
             backgroundColor : "1e293b",
             borderTopWidth : 1,
             borderTopColor : "yellow",
             height : 90,
             paddingBottom : 30,
             paddingTop : 10,
           },
           tabBarLabelStyle : {
             fontSize : 12,
             fontWeight : "600",
           },
           headerShown : false,
      }}>
          <Tabs.Screen 
             name='index'
              options={{
                 title:"Todos",
                 tabBarIcon : ({color , size}) => (
                   <Ionicons name="flash-outline" size={size}/>
                 )
              }}/>



<Tabs.Screen 
             name='settings'
              options={{
                 title:"Settings",
                 tabBarIcon : ({color , size}) => (
                   <Ionicons name="settings" size={size}/>
                 )
              }}/>

              
      </Tabs>
  )
}

export default TabsLayout;

const styles = StyleSheet.create({})