import { Switch, Text, View } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import useTheme from '@/hooks/useTheme';
import { createSettingsStyles } from '@/assets/images/styles/settings.styles';
import { Ionicons } from '@expo/vector-icons';

const Preferences = () => {
  const [isAutoSync , setIsAutoSync] = useState(true);
  
  const [isNotificationsEnabled , setIsNotificationsEnabled] = useState(true);

   const {isDarkMode , toggleDarkMode , colors} =  useTheme();

  const settingsStyles = createSettingsStyles(colors);


  return (
      <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Preferences</Text>

         {/* dark mode  */}

         <View style={settingsStyles.settingItem}>
          <View style={settingsStyles.settingLeft}>
            <LinearGradient colors={colors.gradients.primary} style={settingsStyles.settingIcon}>
              <Ionicons name="moon" size={18} color="#fff"/>
            </LinearGradient>
            <Text style={settingsStyles.settingText}>Dark Mode</Text>
          </View>
          <Switch  value={isDarkMode}
           onValueChange={toggleDarkMode}
            thumbColor={"#fff"}
            trackColor={{false : colors.border , true : colors.primary}}
             ios_backgroundColor={colors.border}/>
         </View>



         {/* notifications   */}

         <View style={settingsStyles.settingItem}>
          <View style={settingsStyles.settingLeft}>
            <LinearGradient colors={colors.gradients.warning} style={settingsStyles.settingIcon}>
              <Ionicons name="notifications" size={18} color="#fff"/>
            </LinearGradient>
            <Text style={settingsStyles.settingText}>Notifications</Text>
          </View>
          <Switch  value={isNotificationsEnabled}
           onValueChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
            thumbColor={"#fff"}
            trackColor={{false : colors.border , true : colors.warning}}
             ios_backgroundColor={colors.border}/>
         </View>


         {/* auto-sync  */}

         <View style={settingsStyles.settingItem}>
          <View style={settingsStyles.settingLeft}>
            <LinearGradient colors={colors.gradients.success} style={settingsStyles.settingIcon}>
              <Ionicons name="notifications" size={18} color="#fff"/>
            </LinearGradient>
            <Text style={settingsStyles.settingText}>Auto Sync</Text>
          </View>
          <Switch  value={isAutoSync}
           onValueChange={() => setIsAutoSync(!isAutoSync)}
            thumbColor={"#fff"}
            trackColor={{false : colors.border , true : colors.success}}
             ios_backgroundColor={colors.border}/>
         </View>
      </LinearGradient>
  );
};

export default Preferences;


