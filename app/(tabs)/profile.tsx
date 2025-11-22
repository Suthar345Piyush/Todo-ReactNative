import React , {useState , useEffect } from "react";
import { View , Text , TextInput , TouchableOpacity , StyleSheet , ScrollView , StatusBar , Alert , KeyboardAvoidingView , Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import useProfile from "@/hooks/useProfile";
import AvatarSelector from "@/components/AvatarSelector";
import TodoHistoryModal from "@/components/TodoHistoryModal";




export default function Profile() {
   
    // all the hooks before any conditional statement  

    const {colors} = useTheme();
    const {profile , saveProfile , updateProfile , getInitials , hasProfile} = useProfile();

    const [name , setName] = useState(profile.name);
    const [description , setDescription] = useState(profile.description || '');
    const [avatarIcon , setAvatarIcon] = useState(profile.avatarIcon);
    const [avatarColor , setAvatarColor] = useState(profile.avatarColor);
    const [isEditing , setIsEditing] = useState(!hasProfile);
    const [historyModalVisible , setHistoryModalVisible] = useState(false);



    useEffect(() => {
      setName(profile.name);
      setDescription(profile.description || '');
      setAvatarIcon(profile.avatarIcon);
      setAvatarColor(profile.avatarColor);
    } , [profile]);


    const handleSave = async () => {
        if(!name.trim()){
           Alert.alert('Required', 'Please enter your name');
           return;
        }

        const success = await saveProfile({
          name : name.trim(),
          description : description.trim(),
          avatarIcon,
          avatarColor,
        });


        if(success) {
           setIsEditing(false);
           Alert.alert('Success' , 'Profile saved successfully!');
        } else {
           Alert.alert('Error' , 'Please create your profile fst');
        }
    };

    const handleCancel = () => {
       if(!hasProfile) {
          Alert.alert('Required' , 'Please create your profile first');
          return;
       }
       
       setName(profile.name);
       setDescription(profile.description || '');
       setAvatarIcon(profile.avatarIcon);
       setAvatarColor(profile.avatarColor);
       setIsEditing(false);
    };


    return (
       <LinearGradient colors={colors.gradients.background} style={styles.container}>
          <StatusBar barStyle={colors.statusBarStyle} />
           <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}>

               <ScrollView contentContainerStyle={styles.scrollContent}
                 showsVerticalScrollIndicator={false}>

                  {/* header  */}

                  <View style={styles.header}>
                      <Text style={[styles.title , {color : colors.text}]}>
                         {isEditing ? 'Edit Profile' : 'My Profile'}
                      </Text>

                      {hasProfile && !isEditing && (
                         <TouchableOpacity activeOpacity={0.7} onPress={() => setIsEditing(true)}>

                            <Ionicons name='pencil' size={24} color={colors.text}/>
                         </TouchableOpacity>
                      )}
                  </View>


                  {/* avatar display   */}

                  <View style={styles.avatarContainer}>
                     <LinearGradient colors={[avatarColor , avatarColor + 'CC']}
                       style={styles.avatarCircle}
                         start={{x : 0 , y : 0}}
                          end={{x : 1 , y : 1}}>

                           <Ionicons name={avatarIcon as any} size={64} color='#fff'/>

                     </LinearGradient>

                     {!isEditing && name && (
                        <Text style={[styles.avatarName , {color : colors.text}] }>{name}</Text>
                     )}
                  </View>

                  {isEditing ? (
                      <>
                         <View style={styles.inputSection}>
                           <Text style={[styles.label , {color : colors.text}]}>Name *</Text>
                           <LinearGradient colors={colors.gradients.surface} style={styles.inputWrapper}>

                              <Ionicons name="person-outline" size={20} color={colors.textMuted}/>

                              <TextInput style={[styles.input , {color : colors.text}]}
                               placeholder="Enter your name"
                                placeholderTextColor={colors.textMuted}
                                 value={name}
                                 onChangeText={setName}
                                 maxLength={30}
                                 />
                           </LinearGradient>
                         </View>


                         {/* description input   */}

                         <View style={styles.inputSection}>
                           <Text style={[styles.label , {color : colors.text}]}>
                               Bio (Optional)
                           </Text>

                           <LinearGradient colors={colors.gradients.surface}
                           style={[styles.inputWrapper , styles.textAreaWrapper]}>

                              <TextInput style={[styles.input , styles.textArea , {color : colors.text}]}
                               placeholder="Tell us about yourself..."
                                placeholderTextColor={colors.textMuted}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                maxLength={150}
                                 />
                           </LinearGradient>
                           <Text style={[styles.charCount , {color : colors.textMuted}]}>{description.length}/150</Text>          
                         </View>


                         {/* avatar selector  */}

                         <AvatarSelector 
                            selectedIcon={avatarIcon}
                             selectedColor={avatarColor}
                              onSelectIcon={setAvatarIcon}
                              onSelectColor={setAvatarColor}
                              />


                             {/* action buttons  */}


                             <View style={styles.buttonContainer}>
                               <TouchableOpacity activeOpacity={0.8}
                                onPress={handleSave}
                                  style={styles.saveButtonWrapper}>
                                    
                                    <LinearGradient colors={colors.gradients.success} 
                                      style={styles.saveButton}>

                                       <Ionicons name="checkmark-circle" size={20} color="#fff"/>
                                       <Text style={styles.saveButtonText}>Save Profile</Text>
                                    </LinearGradient>
                               </TouchableOpacity>


                               {hasProfile && (
                                  <TouchableOpacity activeOpacity={0.8}
                                    onPress={handleCancel}
                                     style={styles.cancelButtonWrapper}>

                                       <LinearGradient colors={colors.gradients.muted}
                                        style={styles.cancelButton}>

                                          <Text style={styles.cancelButtonText}>Cancel</Text>
                                       </LinearGradient>
                                  </TouchableOpacity>
                               )}
                             </View>
                      </>
                  ) : (
                        <>
                        
                          {/* profile display view  */}

                          <View style={styles.profileDisplay}>
                            {description && (
                               <LinearGradient colors={colors.gradients.surface}
                                 style={styles.bioCard}
                                  start={{x : 0 , y : 0}}
                                   end={{x : 1 , y : 1}}>

                                    <Ionicons name="information-circle-outline" size={20} color={colors.textMuted}/>

                                    <Text style={[styles.bioText , {color : colors.text}]}>{description}</Text>
                               </LinearGradient>
                            )} 


                            <LinearGradient colors={colors.gradients.surface} style={styles.infoCard} 
                              start={{x : 0 , y : 0}}
                               end={{x : 1 , y : 1}}>

                                 <View style={styles.infoRow}>

                                    <Ionicons name="shield-checkmark-outline" size={20} color="#22c55e"/>
                                    <Text style={[styles.infoText , {color : colors.text}]}>
                                       No authentication Required
                                    </Text>
                                 </View>
                                 
                                 <View style={styles.infoRow}>
                                    <Ionicons name='phone-portrait-outline' size={20} color='#3b82f6'/>

                                    <Text style={[styles.infoText , {color : colors.text}]}>Data stored locally on device</Text>
                                 </View>


                                 <View style={styles.infoRow}>
                                    <Ionicons name="heart-outline" size={20} color='#ec4899'/>
                                    <Text style={[styles.infoText , {color : colors.text}]}>Your privacy is protected</Text>
                                 </View>
                            </LinearGradient>


                            {/* view history button  */}

                            <TouchableOpacity activeOpacity={0.8}
                              onPress={() => setHistoryModalVisible(true)}
                               style={styles.historyButtonWrapper}>

                               <LinearGradient  colors={colors.gradients.primary}
                                 style={styles.historyButton}
                                   start={{x : 0 , y : 0}}
                                     end={{x : 1 , y : 0}}>

                                <Ionicons name="time-outline" size={22} color="#fff"/>
                                <Text style={styles.historyButtonText}>View Todo History</Text> 
                                <Ionicons name="chevron-forward" size={20} color="#fff"/>
                               </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </>
                  )}
               </ScrollView>
            </KeyboardAvoidingView>
           </SafeAreaView>

           {/* todo history modal  */}

     <TodoHistoryModal 
       visible={historyModalVisible}
         onClose={() => setHistoryModalVisible(false)}/>

       </LinearGradient>
    );
}





const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   safeArea: {
     flex: 1,
   },
   keyboardView: {
     flex: 1,
   },
   scrollContent: {
     padding: 20,
     paddingBottom: 40,
   },
   header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 32,
   },
   title: {
     fontSize: 28,
     fontWeight: '700',
     letterSpacing: 0.5,
   },
   avatarContainer: {
     alignItems: 'center',
     marginBottom: 32,
   },
   avatarCircle: {
     width: 128,
     height: 128,
     borderRadius: 64,
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 8 },
     shadowOpacity: 0.3,
     shadowRadius: 16,
     elevation: 12,
   },
   avatarName: {
     fontSize: 24,
     fontWeight: '700',
     marginTop: 16,
     letterSpacing: 0.5,
   },
   inputSection: {
     marginBottom: 20,
   },
   label: {
     fontSize: 14,
     fontWeight: '600',
     marginBottom: 8,
     paddingLeft: 4,
   },
   inputWrapper: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingHorizontal: 16,
     paddingVertical: 14,
     borderRadius: 12,
     gap: 12,
   },
   textAreaWrapper: {
     alignItems: 'flex-start',
     paddingVertical: 12,
   },
   input: {
     flex: 1,
     fontSize: 16,
   },
   textArea: {
     minHeight: 80,
     textAlignVertical: 'top',
   },
   charCount: {
     fontSize: 12,
     marginTop: 4,
     textAlign: 'right',
     opacity: 0.6,
   },
   buttonContainer: {
     marginTop: 24,
   },
   saveButtonWrapper: {
     marginBottom: 12,
   },
   saveButton: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 16,
     borderRadius: 12,
     gap: 8,
     shadowColor: '#10b981',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.3,
     shadowRadius: 8,
     elevation: 6,
   },
   saveButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: '600',
     letterSpacing: 0.5,
   },
   cancelButtonWrapper: {
     marginBottom: 12,
   },
   cancelButton: {
     paddingVertical: 14,
     borderRadius: 12,
     alignItems: 'center',
   },
   cancelButtonText: {
     color: '#fff',
     fontSize: 16,
     fontWeight: '600',
   },
   profileDisplay: {
     gap: 16,
   },
   bioCard: {
     flexDirection: 'row',
     padding: 16,
     borderRadius: 12,
     gap: 12,
     alignItems: 'flex-start',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
   },
   bioText: {
     flex: 1,
     fontSize: 15,
     lineHeight: 22,
   },
   infoCard: {
     padding: 16,
     borderRadius: 12,
     gap: 14,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
   },
   infoRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
   },
   infoText: {
     fontSize: 14,
     flex: 1,
   },

   historyButtonWrapper : {
     marginTop : 8,
   },

   historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});


