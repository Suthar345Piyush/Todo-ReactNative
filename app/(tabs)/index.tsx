import { Alert, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import useTheme from '@/hooks/useTheme';
import { createHomeStyles } from '@/assets/images/styles/home.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import {LinearGradient} from "expo-linear-gradient";
import Header from '@/components/Header';
import TodoInput from '@/components/TodoInput';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoadingSpinner from '@/components/LoadingSpinner';  
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '@/components/EmptyState';
import { cancelTodoNotification } from '@/components/NotificationManager';



type Todo = Doc<"todos">

export default function Index()  {

  const [editingId , setEditingId] = useState<Id<"todos"> | null>(null);

  const [editText , setEditText]  = useState("");

  const todos = useQuery(api.todos.getTodos);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);


  const {toggleDarkMode , colors} = useTheme();

  const homeStyles = createHomeStyles(colors);

  const isLoading = todos === undefined;

  if(isLoading) return <LoadingSpinner />

   // formating the timestamp to readable date 

   const formatTimestamp = (timestamp : number) => {
      const date = new Date(timestamp);
       const now = new Date();

       const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000 );

        // if the time less than 1 hour , then show "X minutes ago"

        if(diffInMinutes < 60) {
           if(diffInMinutes < 1) return 'Just now';
           return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
        }

        // if the time less than 24 hour , then show "X hours ago"

        // for that we have to calculate hours difference 

        const diffInHours = Math.floor(diffInMinutes / 60);

        if(diffInHours < 24) {
           return `${diffInHours} min${diffInHours > 1 ? 's' : ''} ago`;
        }


        // if  both of them not worked , then show the full date with day 

        const days = ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thu' , 'Fri' , 'Sat'];

        const months = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];

        const day = days[date.getDay()];
        const month = months[date.getMonth()];
        const dateNum = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2 , '0');
        const minutes = date.getMinutes().toString().padStart(2 , '0');


      return `${day} , ${month} ${dateNum} , ${year} at ${hours}:${minutes}`;

   };


const handleToggleTodo = async (id : Id<"todos">) => {
   try {
   
    // getting the todo before toggling to check notification Id 

    const todo = todos?.find(t => t._id === id);

    // toggle the todo 

    const updatedTodo = await toggleTodo({id});

    //if todo is complete then cancel the notification 

    if(updatedTodo && updatedTodo.isCompleted && todo?.notificationId) {
        await cancelTodoNotification(todo.notificationId);
        console.log(`Notification cancelled for completed todo: "${todo.text}"`);
    }

   } catch (error) {
     console.log("Error toggling todo" , error);
     Alert.alert("Error" , "Failed to toggle todo");
   }
};



const handleDeleteTodo = async (id : Id<"todos">) => {
   
  // get the todo before deleting to get notification id

  const todo = todos?.find(t => t._id === id);

  Alert.alert("Delete Todo" , "Are you sure you want to delete this todo?" , [
    {
      text : "Cancel" , style : "cancel"
    },
    {
      text : "Delete", 
      style : "destructive", 
      onPress : async () => {
        try {

          // Delete the todo from Convex

          const result = await deleteTodo({id});
          
          // Cancel the notification if it exists

          if (result?.notificationId) {
            await cancelTodoNotification(result.notificationId);
            console.log(`Notification cancelled for deleted todo: "${todo?.text}"`);
          }
        } catch (error) {
          console.log("Error deleting todo", error);
          Alert.alert("Error", "Failed to delete todo");
        }
      }
    },
  ]);
};


const handleEditTodo = (todo : Todo) => {
   setEditText(todo.text);
   setEditingId(todo._id);
};

const handleSaveEdit = async () => {
   if(editingId){
     try{
       await updateTodo({id : editingId , text : editText.trim()});
       setEditingId(null);
       setEditText("");
     } catch(error){
       console.log("Error updating todo", error);
       Alert.alert("Error" , "Failed to update todo");
     }
   }
};



const handleCancelEdit = () => {
   setEditingId(null);
   setEditText("");
};


const renderTodoItem = ({item} : {item:Todo}) => {

   const isEditing = editingId === item._id;

       return (
          <View style={homeStyles.todoItemWrapper}>
             <LinearGradient colors={colors.gradients.surface}
               style={homeStyles.todoItem}
                start={{x : 0 , y : 0}}
                 end={{x : 1  , y : 1}}>

                  <TouchableOpacity style={homeStyles.checkbox}
                   activeOpacity={0.7}
                    onPress={() => handleToggleTodo(item._id)}>

                      <LinearGradient colors={item.isCompleted ? colors.gradients.success : colors.gradients.muted}
                       style={[
                         homeStyles.checkboxInner , {borderColor : item.isCompleted ? "transparent" : colors.border},
                       ]}>

                        {item.isCompleted && <Ionicons name="checkmark" size={18} color="#fff"/>}
                      </LinearGradient>
                  </TouchableOpacity>

                  {isEditing ? (
                     <View style={homeStyles.editContainer}>
                       <TextInput 
                         style={homeStyles.editInput}
                          value={editText}
                           onChangeText={setEditText}
                            autoFocus
                            multiline
                             placeholder='Edit the todo...'
                              placeholderTextColor={colors.textMuted}/>

                              <View style={homeStyles.editButtons}>
                                <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                                  <LinearGradient colors={colors.gradients.success} style={homeStyles.editButton}>
                                    <Ionicons name="checkmark" size={16} color="#fff"/>
                                    <Text style={homeStyles.editButtonText}>Save</Text>  
                                  </LinearGradient>
                                </TouchableOpacity>


                                <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                                  <LinearGradient colors={colors.gradients.muted} style={homeStyles.editButton}>
                                    <Ionicons name="close" size={16} color="#fff"/>
                                    <Text style={homeStyles.editButtonText}>Cancel</Text>
                                  </LinearGradient>
                                </TouchableOpacity>
                              </View>
                     </View>
                  ) : (
                     <View style={homeStyles.todoTextContainer}>
                      <Text style={[
                         homeStyles.todoText,
                         item.isCompleted && {
                           textDecorationLine : "line-through",
                           color : colors.textMuted,
                           opacity : 0.6,
                         },
                      ]}>
                         {item.text}
                      </Text>


                      {/* timestamp design set between text and buttons  */}

                      <View style={{flexDirection : 'row' , alignItems : 'center' , marginTop : 4 , marginBottom : 8}}>

                        <Ionicons name="time-outline" size={10} color={colors.textMuted} style={{marginRight : 3 , opacity : 0.6}}/>

                        <Text style={{fontSize : 10 , color : colors.textMuted , opacity : 0.6 , letterSpacing : 0.2}}>
                         
                         {item.createdAt ? formatTimestamp(item.createdAt): 'Unknown'}

                        </Text>

                      </View>


                      <View style={homeStyles.todoActions}>
                        <TouchableOpacity onPress={() => handleEditTodo(item)} activeOpacity={0.8}>
                          <LinearGradient colors={colors.gradients.warning} style={homeStyles.actionButton}>
                            <Ionicons name="pencil" size={14} color="#fff"/>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleDeleteTodo(item._id)} activeOpacity={0.8}>
                          <LinearGradient colors={colors.gradients.danger} style={homeStyles.actionButton}>
                            <Ionicons name="trash" size={14} color="#fff"/>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                     </View>
                  )}
             </LinearGradient>
          </View>
       );
  };


  return (
    <LinearGradient colors={colors.gradients.background} style={homeStyles.container}>
      <StatusBar barStyle={colors.statusBarStyle}/>
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />

        <TodoInput />

          <FlatList 
             data={todos}
             renderItem={renderTodoItem}
             keyExtractor={(item) => item._id}
             style={homeStyles.todoList} 
             contentContainerStyle={homeStyles.todoListContent}
             ListEmptyComponent={<EmptyState />}
            />
      </SafeAreaView>
   </LinearGradient>
  );
}















