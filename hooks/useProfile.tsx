import { useState , useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
    name : string;
    avatarIcon : string;
    avatarColor : string;
    description? : string;
}

const PROFILE_STORAGE_KEY = '@user_profile';


const defaultProfile : UserProfile = {
   name : '',
   avatarIcon : 'person',
   avatarColor : '#6366f1',
   description : '',
};


export const UseProfile = () => {
     const [profile , setProfile] = useState<UserProfile>(defaultProfile);

     const [isLoading , setIsLoading] = useState(true);


     // load profile , from storage on mount 

     useEffect(() => {
        loadProfile();
     } , []);


   // function for loading profile whenever the profile tab is opened 

     const loadProfile = async () => {
        try{
           const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
           if(storedProfile) {
              setProfile(JSON.parse(storedProfile));
           }
        } catch(error){
            console.error('Error loading profile:' , error);
        } finally {
           setIsLoading(false);
        }
     };


     // function for profile saving after making them 

     const saveProfile = async (newProfile : UserProfile) => {
        try {
           await AsyncStorage.setItem(PROFILE_STORAGE_KEY , JSON.stringify(newProfile));
           setProfile(newProfile);

           return true;


        } catch (error) {
           console.error('Error saving profile:' , error);
           return false;
        }
     };

     //function for updating the profile 

     const updateProfile = async (updates : Partial<UserProfile>) => {
         const updatedProfile = {...profile , ...updates};

         return await saveProfile(updatedProfile);
     };

   

     // function for clearing profile  

     const clearProfile = async () => {

       try {
         await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
         setProfile(defaultProfile);
         return true;

       } catch (error) {
         console.error('Error clearing profile:' , error);
         return false;
       }
     };


     // getting the initials of user to make user profile  

     const getInitials = (name : string) => {
        if(!name) return '?';

        const parts = name.trim().split('');

        if(parts.length === 1) return parts[0].charAt(0).toUpperCase();

        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
     };



     return {
       profile,
       isLoading,
       saveProfile,
       updateProfile,
       clearProfile,
       getInitials,
       hasProfile : profile.name.length > 0,
     };
}

export default UseProfile;

