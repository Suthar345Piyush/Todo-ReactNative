import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useEffect , useRef } from "react";
import * as Notifications from "expo-notifications";

import { requestNotificationPermission , addNotificationResponseListner } from "@/components/NotificationManager";
import * as Sentry from '@sentry/react-native';
import { initSentry } from "@/utils/sentry";

Sentry.init({
  dsn: 'https://1f22b2c0bcf4e35fafb8185abeb1c513@o4510413585842176.ingest.de.sentry.io/4510413588922448',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  spotlight: __DEV__,
});



//initializing sentry before any other code 

initSentry();




const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});



export default Sentry.wrap(function RootLayout() {

  // setting two reference 1. notificationListener , 2. responseListener , using useRef
   
  // EventSubscription is an object which removes event listner from the emitter 

  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);


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
});;