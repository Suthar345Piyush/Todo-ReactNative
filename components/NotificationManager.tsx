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


/*

  schedule a notification for a todo task
  parameters -> todoText = the text of the todo item
  deadlineHours = Hours until notifications 
  

  --- returns notification Id that can be used to cancel later 

*/



export async function scheduleTodoNotification (

   todoText : string,
   deadlineHours : number = 24

) :  Promise<string | null> {
   
     // firstly check for permissions 

     try {
       const {status} = await Notifications.getPermissionsAsync();

       if(status !== 'granted') {
         console.log("Cannot schedule notification: permission not granted");
         return null;
       }


         // trigger time ->  (for Production -> deadlineHours * 60 * 60)

        // trigger time -> (for testing -> new Date(Date.now() + 2 * 60 * 1000))

        //setting for testing purpose (2 minutes), later go for production trigger 

        const triggerTime = new Date(Date.now()  + 2 * 60 * 1000);

        
        const notificationId = await Notifications.scheduleNotificationAsync({
            content : {
               title : '⏰ Todo Reminder',
               body : `Time's up! Complete: "${todoText}"`,
               sound : 'default',
               priority : Notifications.AndroidNotificationPriority.HIGH,
               data : {todoText , type : 'todo-reminder'},
            },

            trigger : {
               date : triggerTime,
               channelId : Platform.OS === 'android' ? 'todo-reminders' : undefined,
            } as Notifications.DateTriggerInput,
        });


        console.log(`Notification scheduled with ID: ${notificationId} for ${triggerTime}`);
        return notificationId;


     } catch(error){
       console.error("Error scheduling notification:",error);
       return null;
     }
}



/*

  cancel a scheduled notification 
  paremeters -> notificationId => the id returned from scheduleTodoNotification

*/


export async function cancelTodoNotification(
   notificationId : string | undefined
) : Promise<void> {
   if(!notificationId) {
     console.log('No notification ID provided');
     return;
   }


   try {
     await Notifications.cancelAllScheduledNotificationsAsync(notificationId);
     console.log(`Notification ${notificationId} cancelled`);
   } catch(error) {
     console.error('Error cancelling notification:',error);
   }
}


/* 

cancel multiple notifications at once
parameters -> array of notificaions id's to cancel 

*/




export async function cancelMultipleNotification(
    notificationIds : (string | undefined)[]
) : Promise<void> {
    try {
       const validIds = notificationIds.filter((id) : id is string => id !== undefined);


       await Promise.all(
         validIds.map(id => Notifications.cancelScheduledNotificationAsync(id))
       );

       console.log(`Cancelled ${validIds.length} notificaions`);
    } catch(error) {
       console.error('Error cancelling multiple notifications', error);
    }
}




/*

 cancel ALL scheduled notifications (for debugging)

*/


export async function cancelAllNotification() : Promise<void> {
    try{
       await Notifications.cancelAllScheduledNotificationsAsync();
       console.log('All notifications cancelled');
    } catch(error) {
       console.error('Error cancelling all notifications:', error);
    }
}





/*

getting ALL currently scheduled notifications (for debugging)

*/


export async function getAllScheduledNotifications() {
     try {
       const notifications = await Notifications.getAllScheduledNotificationsAsync();
       console.log('Scheduled notifications:', notifications);
       return notifications;
     } catch(error) {
       console.error('Error getting scheduled notifications:', error);
       return [];
     }
}



/*

setting up a listner for when user taps on a notification
 
parameters => callback -> function to call when notifications are tapped 

it returns subscription object (call .remove()) to unsubscribe  

*/


export function addNotificationResponseListner(
     callback : (response : Notifications.NotificationResponse) => void
) {
   return Notifications.addNotificationResponseReceivedListener(callback);
}


/*

check if notification permission is granted or not (boolean)

 */


export async function hasNotificationPermissions() : Promise<boolean> {
   const {status} = await Notifications.getPermissionsAsync();
   return status === 'granted';
}








