import React , {useState , useEffect } from "react";
import { View , Text , TextInput , TouchableOpacity , StyleSheet , ScrollView , StatusBar , Alert , KeyboardAvoidingView , Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import UseProfile from "@/hooks/useProfile";
import AvatarSelector from "@/components/AvatarSelector";




export default function Profile() {

    const {colors} = useTheme();
    const {profile , saveProfile , updateProfile , getInitials , hasProfile} = UseProfile();

    const [name , setName] = useState(profile.name);
    const [description , setDescription] = useState(profile.description || '');
    const [avatarIcon , setAvatarIcon] = useState(profile.avatarIcon);
    const [avatarColor , setAvatarColor] = useState(profile.avatarColor);
    const [isEditing , setIsEditing] = useState(!hasProfile);




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
       
    )




}