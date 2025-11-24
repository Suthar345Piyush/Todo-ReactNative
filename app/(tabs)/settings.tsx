import { createSettingsStyles } from '@/assets/images/styles/settings.styles';
import DangerZone from '@/components/DangerZone';
import Preferences from '@/components/Preferences';
import ProgressStats from '@/components/ProgressStats';
import SocialLinks from '@/components/SocialAccounts';
import useTheme from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React , {useState} from 'react';
import { ScrollView, Text, TouchableOpacity, View , StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackModal from '@/components/FeedbackModal';








const SettingsScreen = () => {
   
   const {colors} = useTheme();
   const settingsStyles = createSettingsStyles(colors);
   const [feedbackVisible , setFeedbackVisible] = useState(false);





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

               {/* feedback section  */}


               <View style={styles.feedbackSection}>
                 <LinearGradient colors={colors.gradients.surface} 
                     style={styles.feedbackCard}
                      start={{x : 0 , y : 0}}
                       end={{x : 1 , y : 1}}>
                   <View style={styles.feedbackHeader}>
                    <Ionicons name="chatbox-ellipses-outline" size={24} color={colors.text}/>
                    <Text style={[styles.feedbackTitle , {color : colors.text}]}>
                       Help us Improve
                    </Text>
                   </View>

                   <Text style={[styles.feedbackDescription , {color : colors.textMuted}]}>
                     Share your feedback,report bugs , or request new features
                   </Text>

                   <TouchableOpacity activeOpacity={0.8} onPress={() => setFeedbackVisible(true)} style={
                    styles.feedbackButtonWrapper
                   }>

                    <LinearGradient colors={colors.gradients.primary} style={styles.feedbackButton}
                     start={{x : 0 , y : 0}}
                      end={{x : 1 , y : 0}}>

                    <Ionicons name="send" size={18} color="#fff"/>
                    <Text style={styles.feedbackButtonText}>Send Feedback</Text>
                    <Ionicons name="chevron-forward" size={18} color="#fff"/>
                    </LinearGradient>

                   </TouchableOpacity>
                 </LinearGradient>
               </View>

               <DangerZone />
               <SocialLinks 
               githubUrl={'https://github.com/Suthar345Piyush/Todo-ReactNative'} 
               twitterUrl={'https://x.com/eigenpiyush'} />

              
           </ScrollView>
       </SafeAreaView>

       {/* feedback modal  */}

       <FeedbackModal visible={feedbackVisible} onClose={() => setFeedbackVisible(false)}/>

     </LinearGradient>
  );
};


const styles = StyleSheet.create({
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  feedbackDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.8,
  },
  feedbackButtonWrapper: {
    marginTop: 4,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});





export default SettingsScreen;