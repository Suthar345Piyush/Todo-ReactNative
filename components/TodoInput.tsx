import { createHomeStyles } from "@/assets/images/styles/home.styles";
import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import {useState} from "react";
import { Alert , TextInput , TouchableOpacity , View } from "react-native";
import { scheduleTodoNotification , hasNotificationPermissions } from "./NotificationManager";



const TodoInput = () => {
   const {colors} = useTheme();

   const homeStyles = createHomeStyles(colors);


   const [newTodo , setNewTodo] = useState("");
   const addTodo = useMutation(api.todos.addTodo);

   const handleAddTodo = async () => {
     if(newTodo.trim()){
       try{
       
        // check if notification permissions are granted 

        const hasPermissions = await hasNotificationPermissions();

        let notificationId : string | null = null;

        // for testing 2/60 => 2 minutes 
        // for production = 24 hrs

        // let deadlineHours = 2/60;

        const delayInSeconds = 54000;


        // schedule notification if permission granted 

        if(hasPermissions) {
             notificationId = await scheduleTodoNotification(
             newTodo.trim(),
             delayInSeconds
          );


       if(notificationId) {
         console.log(`Notification scheduled for "${newTodo.trim()}" in ${delayInSeconds} seconds (${delayInSeconds/60} minutes)`);
       } else {
         console.log("Failed to schedule notification");
       }
    } else {
        console.log("Notification permissions not granted");
    }

       
    // adding todo and it's notification id (details) to CONVEX backend  
    
         await addTodo({
          text : newTodo.trim(),
          notificationId : notificationId || undefined,
          deadlineHours : delayInSeconds / 3600,
        });
         setNewTodo("");
       } catch(error){
          console.log("Error adding todo",error);
          Alert.alert("Error" , "Failed to add new todo");
       }
     }
   };


   return (
     <View style={homeStyles.inputSection}>
       <View style={homeStyles.inputWrapper}>
          <TextInput 
             style={homeStyles.input}
              placeholder="Enter your todo"
               value={newTodo}
                onChangeText={setNewTodo}
                 onSubmitEditing={handleAddTodo}
                  placeholderTextColor={colors.textMuted}/>
                
                <TouchableOpacity onPress={handleAddTodo} activeOpacity={0.8} disabled={!newTodo.trim()}>
                   <LinearGradient colors={newTodo.trim() ? colors.gradients.primary : colors.gradients.muted} style={[homeStyles.addButton , !newTodo.trim() && homeStyles.addButtonDisabled]}>
                      <Ionicons name="add" size={24} color="#ffffff"/>                     
                   </LinearGradient>
                </TouchableOpacity>
       </View>
     </View>
   );
};



export default TodoInput;

