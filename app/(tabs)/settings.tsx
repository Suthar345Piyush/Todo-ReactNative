import { createSettingsStyles } from '@/assets/images/styles/settings.styles';
import DangerZone from '@/components/DangerZone';
import Preferences from '@/components/Preferences';
import ProgressStats from '@/components/ProgressStats';
import SocialLinks from '@/components/SocialAccounts';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
   
   const {colors} = useTheme();
   const settingsStyles = createSettingsStyles(colors);



  return (
     <LinearGradient colors={colors.gradients.background} style={settingsStyles.container}>
       <SafeAreaView style={settingsStyles.safeArea}>

            {/* header  */}

            <View style={settingsStyles.header}>
              <View style={settingsStyles.titleContainer}>
                <LinearGradient colors={colors.gradients.primary} style={settingsStyles.iconContainer}>
                  <Ionicons name="settings" size={28} color="#ffffff"/>
                </LinearGradient>
                <Text style={settingsStyles.title}>Settings</Text>
              </View>
            </View>
            
            <ScrollView 
              style={settingsStyles.scrollView}
               contentContainerStyle={settingsStyles.content}
               showsHorizontalScrollIndicator={false}>

               <ProgressStats />
               <Preferences />
               <DangerZone />
               <SocialLinks 
               githubUrl={'https://github.com/Suthar345Piyush/Todo-ReactNative'} 
               twitterUrl={'https://x.com/eigenpiyush'} />
               
           </ScrollView>
       </SafeAreaView>
     </LinearGradient>
  );
};


export default SettingsScreen;