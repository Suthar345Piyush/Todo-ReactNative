// Custom Time picker component 

import React  from "react";
import { Modal , View , Text , TouchableOpacity , StyleSheet , ScrollView} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";



  // props for the component 

interface CustomTimePickerProps {
     visible : boolean;
     onClose : () => void;
     onSelectTime : (seconds : number) => void;
     currentDeadline?: number;          // deadline in seconds , it is optional 
  }



const CustomTimePicker : React.FC<CustomTimePickerProps> = ({
    visible,
    onClose,
    onSelectTime,
    currentDeadline,
}) => {
      
       const { colors } = useTheme();


       // predefined time options (all in seconds)

       const timeOptions = [
          {label : '30 Minutes' , seconds : 1800 , icon : 'timer-outline'},
          {label : '1 Hour', seconds : 3600 , icon : 'time-outline'},
          {label : '2 Hours' , seconds : 7200 , icon : 'hourglass-outline'},
          {label : '4 Hours' , seconds : 14400 , icon : 'alarm-outline'},
          {label : '8 Hours' , seconds : 28800 , icon : 'moon-outline'},
          {label : '12 Hours' , seconds : 43200 , icon : 'sunny-outline'},
          {label : '15 Hours (Default)' , seconds : 54000  , icon : 'notifications-outline'},
          {label : '24 Hours' , seconds : 86400 , icon : 'calender-clear-outline'},
          {label : '2 Days' , seconds : 172800 , icon : 'calender-number-outline'},
          {label : '3 Days' , seconds : 259200 , icon : 'calendar-sharp'},
       ];


        const handleSelectTime = (seconds : number) => {
           onSelectTime(seconds);
           onClose();
        }


        const formatCurrentDeadline = (seconds? : number) => {

            if(!seconds) return 'Default (15 hours)';

            const hours = Math.floor(seconds / 3600);
            const days = Math.floor(hours / 24);

            if(days > 0) return `${days} day${days > 1 ? 's' : ''}`;

            if(hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;

            const minutes = Math.floor(seconds / 60);

            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        };



        return (
             <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
                > 

                <View style={styles.modalOverlay}>
                   <View style={[styles.modalContainer , {backgroundColor : '#fff'}]}>


                      {/* header  */}

                    <View style={styles.header}>
                        <Text style={[styles.title , {color : colors.text}]}>
                           Set Todo Deadline
                        </Text>

                        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                          <Ionicons name="close" size={28} color={colors.text}/>
                        </TouchableOpacity>
                    </View>


                    {/* current deadline display  */}

                    {currentDeadline && (
                       <View style={styles.currentDeadlineContainer}>
                         <LinearGradient colors={colors.gradients.primary}
                           style={styles.currentDeadlineBadge}
                            start={{x : 0 , y : 0}}
                             end={{x : 1 , y : 0}}>

                              <Ionicons name="timer" size={16} color="#fff"/>

                              <Text style={styles.currentDeadlineText}>
                                 Current: {formatCurrentDeadline(currentDeadline)} 
                              </Text>
                         </LinearGradient>
                       </View>
                    )}



                    {/* use of time options array  */}

                    <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>

                      {timeOptions.map((option , index) => (
                         <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => handleSelectTime(option.seconds )}>

                          <LinearGradient colors={
                             currentDeadline === option.seconds
                              ? colors.gradients.success : colors.gradients.surface
                          }
                          style={styles.optionButton}
                          start={{x : 0 , y : 0}}
                          end={{x : 1 , y : 1}}
                          >

                          <View style={styles.optionContent}>
                             <Ionicons name={option.icon as any}
                               size={22}
                                color={currentDeadline === option.seconds ?  '#fff' : colors.text}/>

                                <Text style={[
                                  styles.optionLabel,
                                  {color : currentDeadline === option.seconds ? '#fff' : colors.text},
                                ]}>
                                  {option.label}
                                </Text>
                          </View>

                          {currentDeadline === option.seconds && (
                             <Ionicons name="checkmark-circle" size={24} color="#fff"/>
                          )}
                          </LinearGradient>
                         </TouchableOpacity>
                      ))}
                    </ScrollView>


                      {/* cancel button  */}

                      <TouchableOpacity activeOpacity={0.8}
                        onPress={onClose}
                         style={styles.cancelButtonContainer}>

                          <LinearGradient colors={colors.gradients.muted} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                          </LinearGradient>
                      </TouchableOpacity>
                   </View>
                </View>
             </Modal>
        );
};




const styles  = StyleSheet.create({
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
    maxHeight: '80%',
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
  currentDeadlineContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  currentDeadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  currentDeadlineText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  optionsContainer: {
    maxHeight: 400,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  cancelButtonContainer: {
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
})





export default CustomTimePicker;





