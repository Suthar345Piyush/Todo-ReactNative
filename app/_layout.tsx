import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect , useRef } from "react";
import * as Notifications from "expo-notifications";

import { requestNotificationPermission , addNotificationResponseListner } from "@/components/NotificationManager";




const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});



export default function RootLayout() {

  // setting two reference 1. notificationListener , 2. responseListener , using useRef

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();



  useEffect(() => {

        // request notification permissions on app startup 

        requestNotificationPermission().then((granted) => {
           if(granted) {
             console.log("Notification Permission Granted");
           } else {
            console.log('Notification permission denied');
           }
        });

        // listen for notification when app is in foreground  

        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
               console.log("Notification Received:" , notification);
            }
        );


        // listen when user taps on notification

        responseListener.current = addNotificationResponseListner((response) => {
           console.log('User tapped notification:', response);


           // getting the todo text from notification data 

           const todoText = response.notification.request.content.data?.todoText;


           //check the todoText 
           if(todoText) {
             console.log("Todo to complete:",todoText);
           }
        });




        // cleaning up listeners when component unmount 

        return () => {
           if(notificationListener.current) {
               notificationListener.current.remove();
           }

           if(responseListener.current){
              responseListener.current.remove();
           }
        };

} , []);



  return ( 
  <ConvexProvider client={convex}>
      <ThemeProvider childern = {
          <Stack screenOptions={{headerShown : false}}>
             <Stack.Screen name="(tabs)"/>
        </Stack> }/>
  </ConvexProvider>
  );
};




