import React from "react";
import { Modal , View , Text , TouchableOpacity , StyleSheet , ScrollView , Alert } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { useQuery , useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";



interface TodoHistoryModalProps {
   visible : boolean;
   onClose : () => void;
}

const TodoHistoryModal : React.FC<TodoHistoryModalProps> = ({visible , onClose}) => {

   const {colors} = useTheme();

   const history = useQuery(api.todoHistory.getHistory);

   const stats = useQuery(api.todoHistory.getHistoryStats);

   const clearHistory = useMutation(api.todoHistory.clearHistory);



   const formatTimestamp = (timestamp : number) => {

      const date = new Date(timestamp);

      const now = new Date();

      const diffInHours = Math.floor((now.getTime() - date.getTime()) / 3600000);

      if(diffInHours < 24) {

        const hours = date.getHours().toString().padStart(2 , '0');

        const minutes = date.getMinutes().toString().padStart(2 , '0');

        return `Today at ${hours}:${minutes}`;

      }

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const day = days[date.getDay()];

      const month = months[date.getMonth()];

      const dateNum = date.getDate();

      const hours = date.getHours().toString().padStart(2 , '0');

      const minutes = date.getMinutes().toString().padStart(2 , '0');

      return `${day} , ${month} , ${dateNum} at ${hours}:${minutes}`;

   };


   

   const getActionIcon = (action : string) => {
      switch (action) {
         case 'created':
           return {
               name : 'add-circle' , color : '#3b82f6'
           };

         case 'completed':
           return {
              name : 'checkmark-circle' , color : '#22c55e'
           };

         case 'deleted':
           return {
             name : 'trash' , color : '#ef4444' 
           };

         default:
           return {
              name : 'ellipse' , color : colors.textMuted
           };
      }
   };












}

