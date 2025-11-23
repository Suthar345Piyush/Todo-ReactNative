import React , {useState} from "react";
import {Modal , View , Text , TextInput , TouchableOpacity , StyleSheet , ScrollView , Alert , ActivityIndicator} from 'react-native';

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import * as Sentry from "@sentry/react-native";



interface FeedbackModalProps {
   visible : boolean;
   onClose : () => void;
}


type FeedbackType = 'bug' | 'feature' | 'general';


const FeedbackModal : React.FC<FeedbackModalProps> = ({ visible , onClose }) => {
    const {colors} = useTheme();
    
    // feedback initially set for bug report 

    const [feedbackType , setFeedbackType] = useState<FeedbackType>('bug');
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [subject , setSubject] = useState("");
    const [description , setDescription] = useState("");
    const [isSubmitting , setIsSubmitting] = useState(false);



    const feedbackTypes = [
       {id : 'bug' as FeedbackType , label : 'Bug Report' , icon : 'bug' , color : '#ef4444'},
       {id : 'feature' as FeedbackType , label : 'Feature Request' , icon : 'bulb' , color : '#f59e0b'},
       {id : 'general' as FeedbackType , label : 'General Feedback' , icon : 'chatbubble' , color : '#3b82f6'},
    ];

     const handleSubmit = async () => {

      // validating the description 

        if(!description.trim()) {
           Alert.alert('Required' , 'Please describe your feedback');
           return;
        }

        setIsSubmitting(true);


        try{

          // creating sentry event  
          
          const eventId = Sentry.captureMessage(

             `${feedbackType.toUpperCase()}: ${subject || 'No Subject'}`,

             {
              level : feedbackType === "bug" ? 'error' : 'info',
              tags : {
                 feedback_type : feedbackType,
              },

              contexts : {
                 feedback : {
                    type : feedbackType,
                    subject : subject,
                    description : description,
                    name : name || 'Anonymous',
                    email : email || 'No email provided',
                 },
              },
             },
          );


          //setting user context 

          if(name || email) {
             Sentry.setUser({
                username : name || 'Anonymous',
                email : email || undefined,
             });
          }


          console.log("Feedback sent with event Id:", eventId);


          // reseting the form 

          setName('');
          setEmail('');
          setSubject('');
          setDescription('');
          setFeedbackType('bug');


          Alert.alert(
            'Thank you!!', 'Your feedback helps us to make app more better!!',
            [{text : 'OK' , onPress : onClose}]
          );

        } catch(error){
          console.error('Error submitting feedback:', error);
          Alert.alert('Error' , 'Failed to submit feedback. Please try again.');
        } 
        finally {
           setIsSubmitting(false);
        }
     };


     return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
           <View style={styles.modalOverlay}>
             <View style={[styles.modalContainer , {backgroundColor : '#1a1a1a'}]}>

              {/* header part  */}

              <View style={styles.header}>
                <Text style={[styles.title , {color : colors.text}]}>Send Feedback</Text>
                  <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Ionicons name="close" size={28} color={colors.text}/>
                  </TouchableOpacity>
              </View>


              <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

              {/* selection of what kind of the feedback is  */}

              <View style={styles.section}>
                <Text style={[styles.label , {color : colors.text}]}>Feedback Type</Text>
                <View style={styles.typeContainer}>
                  {feedbackTypes.map((type) => (
                     <TouchableOpacity key={type.id}
                      activeOpacity={0.7}
                       onPress={() => setFeedbackType(type.id)}
                        style={styles.typeButton}>

                          <LinearGradient colors={feedbackType === type.id ? [type.color , type.color + 'CC'] : colors.gradients.surface}>

                            <Ionicons name={type.icon as any}
                              size={24}
                               color={feedbackType === type.id ? '#fff' : colors.text}/>

                               <Text style={[
                                 styles.typeLabel , 
                                  {
                                    color : feedbackType === type.id ? "#fff" : colors.text
                                  },
                               ]}>
                                 {type.label}
                               </Text>


                               {feedbackType === type.id && (
                                 <Ionicons name="checkmark-circle" size={20} color="#fff"/>
                               )}
                          </LinearGradient>
                     </TouchableOpacity>
                  ))}
                </View>
              </View>


              {/* name of feedback provider  */}



              </ScrollView>

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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 4,
  },
  typeContainer: {
    gap: 10,
  },
  typeButton: {
    marginBottom: 2,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
    opacity: 0.6,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  submitButtonWrapper: {
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default FeedbackModal;


