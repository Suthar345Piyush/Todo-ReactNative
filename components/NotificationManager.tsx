import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


// handling the notifications in the app 
// it handles notifications , when it comes  

Notifications.setNotificationHandler({
   handleNotification : async () => ({
       shouldShowBanner : true,
       shouldPlaySound : true,
       shouldSetBadge : true,
       shouldShowList : true,     // added to fix the ts error  
  }),  
});



/*
  permission from user for notification 
  must be called before scheduling any notifications    

  {it returns a promise which will further resolve , using bool true -> permission granted , false -> denied}

*/


export async function requestNotificationPermission() : Promise<boolean>  {
    try {
       const {status : existingStatus} = await  Notifications.getPermissionsAsync();
       let finalStatus = existingStatus;


       // if permission not given , request them for geting the permission 

       if(existingStatus !== 'granted') {
         const {status} = await Notifications.requestPermissionsAsync();
         finalStatus = status;
       }

       if(finalStatus !== 'granted') {
         console.log("Notification Permission Denied");
         return false;
       }


       //going to configure notification channel for android 

       if(Platform.OS === 'android') {
         await Notifications.setNotificationChannelAsync('todo-reminders' , {
           name : 'Todo Reminders',
           importance : Notifications.AndroidImportance.HIGH,
           vibrationPattern : [0 , 250 , 250 , 250],
           lightColor : '#FF231F7C',
           sound : 'default',
           enableVibrate : true,
         });
       }

       return true;

    } catch(error) {
       console.error("Error requesting notification permissions:", error);
       return false;
    }
}





