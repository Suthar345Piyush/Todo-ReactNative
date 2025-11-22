import React from 'react';
import { View , Text , TouchableOpacity , StyleSheet , ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';


// defining components props 

interface AvatarSelectorProps {
    selectedIcon : string;
    selectedColor : string;
    onSelectIcon : (icon : string) => void;
    onSelectColor : (icon : string) => void;
}


const AvatarSelector : React.FC<AvatarSelectorProps> = ({
          selectedIcon,
             selectedColor,
            onSelectIcon,
           onSelectColor,
}) => {


    const {colors} = useTheme();



    // predefined avatar icons  

    const avatarIcons = [
       'person',
       'person-circle',
       'happy',
       'rocket',
       'star',
       'heart',
       'flame',
       'sparkles',
       'pizza',
       'cafe',
       'game-controller',
       'musical-notes',
       'basketball',
       'football',
       'bicycle',
       'airplane',
    ];


    // gradient colors 

     const avatarColors = [
      '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#a855f7', // Violet
    '#ef4444', // Red
     ];

     return (
        <View style={styles.container}>
      
      {/* icon selection section  */}

           <View style={styles.section}>
            <Text style={[styles.sectionTitle , {color : colors.text}]}>Choose Icon</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconScroll} contentContainerStyle={styles.scrollContent}>

              {avatarIcons.map((icon) => (
                 <TouchableOpacity key={icon}
                  activeOpacity={0.7}
                   onPress={() => onSelectIcon(icon)}
                    style={styles.iconButton}>

                      <View style={[
                        styles.iconWrapper, {
                           backgroundColor : selectedIcon === icon ? selectedColor : "#fff",
                           borderColor : selectedIcon === icon ? selectedColor : colors.border,
                        },
                      ]}>

                        <Ionicons name={icon as any} size={28} color={selectedIcon === icon ? '#fff' : colors.text}/>
                      </View>
                 </TouchableOpacity>
              ))}

            </ScrollView>
           </View>

           {/* color selection section  */}

           <View style={styles.section}>

           <Text style={[
              styles.sectionTitle , {color : colors.text}
           ]}>Choose Color</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll} contentContainerStyle={styles.scrollContent}>

                {avatarColors.map((color) => (
                   <TouchableOpacity key={color} activeOpacity={0.7} onPress={() => onSelectColor(color)} style={styles.colorButton}>
       <View style={[
          styles.colorCircle , {backgroundColor : color},
           selectedColor === color && styles.selectedColor,
       ]}>

        {selectedColor === color && (
            <Ionicons name="checkmark" size={20} color='#fff'/>
        )}
       </View>
                   </TouchableOpacity>
                ))}
              </ScrollView>
           </View>
        </View>
     )
};


const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  iconScroll: {
    flexGrow: 0,
  },
  iconButton: {
    marginRight: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorScroll: {
    flexGrow: 0,
  },
  colorButton: {
    marginRight: 12,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
})

export default AvatarSelector;
