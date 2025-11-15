
import React from "react";
import { View , Text , TouchableOpacity , Linking , StyleSheet , Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "@/hooks/useTheme";

interface SocialLinksProps {
    githubUrl : string;
    twitterUrl : string;
}

const SocialLinks : React.FC<SocialLinksProps> = ({githubUrl , twitterUrl}) => {
    const {colors}  = useTheme();

    const handleOpenLink = async (url : string , platform : string) => {
        try{
           const canOpen = await Linking.canOpenURL(url);

           if(canOpen) {
             await Linking.openURL(url);
           } else {
              Alert.alert('Error' , `Cannot open ${platform} link`);
           }
        } catch(error) {
           console.error(`Error opening ${platform}:`, error);
           Alert.alert('Error' , `Failed to open ${platform} link`);
        }
    };


    return (
          <View style={styles.container}>
              <Text style={[styles.title , {color : colors.text}]}>Connect With Us</Text>

              <View style={styles.socialContainer}>

                 {/* github button  */}


                  <TouchableOpacity activeOpacity={0.8} onPress={() => handleOpenLink(githubUrl , twitterUrl)} style={styles.buttonWrapper}>
                       
                       <LinearGradient colors={['#24292e' , '#1a1e22']} style={styles.socialButton} start={{x : 0 , y : 0}} end={{x : 1 , y : 1}}>

                        <Ionicons name="logo-github" size={28} color="#ffffff"/>
                        <Text style={styles.buttonText}>GitHub</Text>
                       </LinearGradient>
                  </TouchableOpacity>


                  {/* twitter button  */}

                  <TouchableOpacity activeOpacity={0.8} onPress={() => handleOpenLink(twitterUrl , 'X')} style={styles.buttonWrapper}>

                    <LinearGradient colors={['#000000' , '#1a1a1a']}
                      style={styles.socialButton}
                       start={{x : 0 , y : 0}}
                        end={{x : 1 , y : 1}}>

                          <Ionicons name="logo-twitter" size={28} color="#ffffff"/>
                        <Text style={styles.buttonText}>X (Twitter)</Text>
                    </LinearGradient>
                </TouchableOpacity>
              </View>
            <Text style={{color : '#fff'}}>Open for Contributions !!</Text>
          </View>
    )
};



const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: 160,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  contributionContainer: {
    marginBottom: 12,
  },
  contributionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  contributionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
});

export default SocialLinks;