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



   // for action icons 
   

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


    // for action label 

    const getActionLabel = (action : string) => {
      switch (action) {

         case 'created':
             return 'Created';

         case 'completed':
             return 'Completed';

         case 'deleted':
             return 'Deleted';
         
         default:
              return action;
      }
    };

    // handling the cancel / clear history 

    const handleClearHistory = ()  => {
       Alert.alert(
          'Clear History',
          'Are you sure you want to clear all todo history? This cannot be undone.',
          [
            {
               text : 'Cancel' , style : 'cancel'
            },

            {
               text : 'Clear',
               style : 'destructive',

               onPress : async () => {
                   await clearHistory();
                   Alert.alert('Success' , 'Todo History cleared successfully');
               },
            }
          ]
       );
    };



    return (
         <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer , {backgroundColor :  '#1a1a1a'}]}>  

               {/* header  */}

               <View style={styles.header}>
                  <Text style={[styles.title , {color : colors.text}]}>Todo History</Text>
                  <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                     <Ionicons name="close" size={28} color={colors.text}/>
                  </TouchableOpacity>
               </View>

               {/* stats section  */}

               {
                  stats && (

                      <View style={styles.statsContainer}>
                        <LinearGradient colors={colors.gradients.surface}
                           style={styles.statsCard}
                            start={{x : 0 , y : 0}}
                             end={{x : 1 , y : 1}}>

        
                          {/* history created stuff   */}


                           <View style={styles.statItem}>
                              <Ionicons name='add-circle' size={24} color="#3b82f6"/>

                              <View>
                                 <Text style={[styles.statValue , {color : colors.text}]}>{stats.totalCreated}</Text>

                                 <Text style={[styles.statLabel , {color : colors.textMuted}]}>Created</Text>
                              </View>
                           </View>



                           {/* history - todo completed stuff  */}


                           <View style={styles.statItem}>
                              <Ionicons name="checkmark-circle" size={24} color="#22c55e"/>
                              <View>
                                 <Text style={[styles.statValue , {color : colors.text}]}>{stats.totalCompleted}</Text>
                                 <Text style={[styles.statLabel , {color : colors.textMuted}]}>Completed</Text>
                              </View>
                           </View>


                           {/* todo history deleted stuff  */}



                           <View style={styles.statItem}>
                              <Ionicons name="trash" size={24} color="#ef4444"/>
                              <View>
                                 <Text style={[styles.statValue , {color : colors.text}]}>{stats.totalDeleted}</Text>
                                 <Text style={[styles.statLabel , {color : colors.textMuted}]}>Deleted</Text>
                              </View>
                           </View>


                           {/* all combined stats chart  */}

                           <View style={styles.statItem}>
                              <Ionicons name='stats-chart' size={24} color='#f59e0b'/>
                              <View>
                                 <Text style={[styles.statValue , {color : colors.text}]}>
                                    {stats.completionRate}%
                                 </Text>
                                 <Text style={[ styles.statLabel , {color : colors.textMuted}]}>Rate</Text>
                              </View>
                           </View>
                        </LinearGradient>
                      </View>    
                  )}


                   {/* full history list   */}

                   <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                     {
                        history && history.length > 0 ? (
                           history.map((entry , index) => {
                              const actionIcon = getActionIcon(entry.action);

                              return (
                                  <LinearGradient key={entry._id} colors={colors.gradients.surface}
                                     style={styles.historyItem}
                                      start={{x : 0 , y : 0}}
                                       end={{x : 1 , y : 1}}>


                                    <View style={styles.historyIconContainer}>
                                       <Ionicons name={actionIcon.name as any}
                                        size={24}
                                          color={actionIcon.color}/>
                                    </View>


                                    <View style={styles.historyContent}>
                                       <Text style={[styles.historyText , {color : colors.text}]}>{entry.todoText}</Text>

                                       <View style={styles.historyMeta}>

                                          <Text style={[styles.historyText , {color : actionIcon.color}]}>{getActionLabel(entry.action)}</Text>

                                          <Text style={[styles.historyTimestamp , {color : colors.textMuted}]}>{formatTimestamp(entry.timestamp)}</Text>

                                       </View>

                                       {entry.additionalInfo && (
                                          <Text style={[styles.additionalInfo , {color : colors.textMuted}]}>{entry.additionalInfo}</Text>
                                       )}
                                    </View>
                                 </LinearGradient>
                              );
                           })
                        ) : (

                           <View style={styles.emptyState}>
                              <Ionicons name="time-outline" size={64} color={colors.textMuted}/>
                              <Text style={[styles.emptyText , {color : colors.textMuted}]}>No History yet!!</Text>
                              <Text style={[styles.emptySubtext , {color : colors.textMuted}]}>Your todo actions will appear here</Text>
                           </View>
                        )}
                   </ScrollView>



                   {/* button for history clearing  */}

                   {history && history.length > 0 && (
                      <TouchableOpacity activeOpacity={0.8}
                        onPress={handleClearHistory}
                         style={styles.clearButtonContainer}>

                           <LinearGradient colors={colors.gradients.danger} style={styles.clearButton}>

                              <Ionicons name='trash-outline' size={18} color="#fff"/>

                              <Text style={styles.clearButtonText}>Clear History</Text>

                           </LinearGradient>

                      </TouchableOpacity>
                   )}

                </View>  
            </View>

         </Modal>
    )
};


const styles = StyleSheet.create({
   modalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
     justifyContent: 'flex-end',
   },
   modalContainer: {
     borderTopLeftRadius: 24,
     borderTopRightRadius: 24,
     paddingTop: 20,
     paddingBottom: 32,
     paddingHorizontal: 20,
     maxHeight: '90%',
     shadowColor: '#000',
     shadowOffset: { width: 0, height: -4 },
     shadowOpacity: 0.3,
     shadowRadius: 12,
     elevation: 12,
   },
   header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 20,
   },
   title: {
     fontSize: 22,
     fontWeight: '700',
     letterSpacing: 0.5,
   },
   statsContainer: {
     marginBottom: 20,
   },
   statsCard: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     padding: 16,
     borderRadius: 12,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 2,
   },
   statItem: {
     alignItems: 'center',
     gap: 8,
   },
   statValue: {
     fontSize: 18,
     fontWeight: '700',
     textAlign: 'center',
   },
   statLabel: {
     fontSize: 11,
     textAlign: 'center',
   },
   historyList: {
     flex: 1,
   },
   historyItem: {
     flexDirection: 'row',
     padding: 14,
     borderRadius: 12,
     marginBottom: 10,
     gap: 12,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 0.08,
     shadowRadius: 2,
     elevation: 1,
   },
   historyIconContainer: {
     paddingTop: 2,
   },
   historyContent: {
     flex: 1,
   },
   historyText: {
     fontSize: 15,
     fontWeight: '500',
     marginBottom: 6,
   },
   historyMeta: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 8,
     marginBottom: 4,
   },
   historyAction: {
     fontSize: 13,
     fontWeight: '600',
   },
   historyTimestamp: {
     fontSize: 12,
     opacity: 0.7,
   },
   additionalInfo: {
     fontSize: 11,
     fontStyle: 'italic',
     opacity: 0.6,
   },
   emptyState: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 60,
   },
   emptyText: {
     fontSize: 18,
     fontWeight: '600',
     marginTop: 16,
   },
   emptySubtext: {
     fontSize: 14,
     marginTop: 8,
     opacity: 0.7,
   },
   clearButtonContainer: {
     marginTop: 16,
   },
   clearButton: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 12,
     borderRadius: 12,
     gap: 8,
   },
   clearButtonText: {
     color: '#fff',
     fontSize: 15,
     fontWeight: '600',
   },
 });
 
 export default TodoHistoryModal;

