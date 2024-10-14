import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';


const HomeScreen = ({route}) => {

  const { userEmail } = route.params || { userEmail: 'User' };  // Récupération de l'email depuis les paramètres de navigation
  

  const navigation = useNavigation();

  const handleNewConsultation=()=>{
     navigation.navigate("NewConsultation");
  }


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>

      <View>
    <View style={styles.banner}>
        <Text style={styles.title}>MAPUBI ONG</Text>
        <Image 
          source={require('../assets/images.png')}
          style={styles.profileCircle}
        />
         <Text style={styles.welcomeText}>Hello {userEmail}!</Text>

         {/* Photo de profil à droite */}
        <View style={styles.profileCircle}>
          <Image 
            source={require('../assets/images-user.png')} 
            style={styles.profileImage} 
          />
        </View>
        {/* Barre de recherche */}
     <TextInput 
        style={styles.searchBar} 
        placeholder="Search here..."
      />

      {/* Phrase "Welcome back" */}
      <Text style={styles.welcomeBackText}>Welcome back</Text>


    </View>
    </View>

      <Text style={styles.title}> Lien vers la consultation</Text>


        <View style={styles.buttonContainer}>
        <TouchableOpacity style= {styles.button} onPress={handleNewConsultation}>
        <AntDesign name="medicinebox" size={40} color="white" />
          <Text style={styles.buttonText2}>Nouvelle consultation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style= {styles.button}>
        <FontAwesome5 name="clipboard-list" size={40} color="white" />
          <Text style={styles.buttonText2}>Liste consultation</Text>
        </TouchableOpacity>
       </View>

       <View style={styles.textContainer}>
       <Text style={styles.title}> Consultations Recentes </Text>
       </View>

    </SafeAreaView>
    </GestureHandlerRootView>
  )


}


export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    marginVertical:5,

  },
  textContainer: {
    alignItems:'flex-start',
    marginVertical:15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 120,
    height: 120,
    backgroundColor: '#24A5E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal:5 ,
  },
  buttonText2:{
    color:'#FFFFFF',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    elevation: 2,
  },
  welcomeBackText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  banner: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 5,
    borderRadius: 8,
    marginVertical:5,
  },

})