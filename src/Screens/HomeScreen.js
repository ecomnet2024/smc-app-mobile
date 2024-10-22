import { StyleSheet, Text, View } from 'react-native'
import React,  { useEffect }  from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';


const HomeScreen = () => {

  const navigation = useNavigation();
  const [isTokenChecked, setIsTokenChecked] = useState(false); // État pour savoir si la vérification est terminée


  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    };

    fetchUserEmail();
  }, []);

  const handleLogout = async () => {
    // Supprimer le token et le firstName lors de la déconnexion
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login');
  };


  const handleNewConsultation=()=>{
     navigation.navigate("NewConsultation");
  }


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>

      <View>

         {/* Images en arrière-plan */}
      <Image
        source={require('../assets/top2.png')} 
        style={[styles.backgroundImage, styles.image1]}
      />
      <Image
        source={require('../assets/bottom2.png')} 
        style={[styles.backgroundImage, styles.image2]}
      />
      <Image
        source={require('../assets/bottom1.png')} 
        style={[styles.backgroundImage, styles.image3]}
      />
  
      {/* Bannière */}
      <View style={styles.banner}>
        {/* Ligne 1 - Logo*/}
        <View style={styles.topRow}>
          <Image source={require('../assets/Group 13.png')} style={styles.logo} />
          <View style={styles.centerRow}>
            <Image source={require('../assets/images-user.png')} style={styles.profileImage} />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Entypo name="log-out" size={24} color="white" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>


         {/* Ligne 2 - Profil */}
         <View style={styles.middleRow}>
    
          <View style={styles.centerRow}>
          <Ionicons name="menu" size={30} color="white" style={styles.menuIcon} />
            <Text style={styles.email}>  Hello,{"\n"}{userEmail}</Text>
          </View>
        </View>


        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patient"
          />
        </View>

        {/* Texte de bienvenue */}
        <Text style={styles.welcomeText}>Welcome back!</Text>
      </View>
    </View>
  

      <Text style={styles.title}> create new folder</Text>


        <View style={styles.buttonContainer}>
        <TouchableOpacity style= {styles.button} onPress={handleNewConsultation}>
        <Image source={require('../assets/undraw_medicine_b1ol.png')} style={styles.logo3} />
          <Text style={styles.buttonText2}>New consultation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style= {styles.button}>
        <Image source={require('../assets/pregnant woman_6226304.png')} style={styles.logo2} />
          <Text style={styles.buttonText2}>Emergency</Text>
        </TouchableOpacity>
       </View>

       <View style={styles.textContainer}>
       <Text style={styles.title}> recent consultations </Text>
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
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginVertical:5,

  },
  textContainer: {
    alignItems:'flex-start',
    marginVertical:15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal:5 ,
  },
  buttonText2:{
    color:'#000000',
    fontWeight:'semibold',
  },
  banner: {
    backgroundColor: '#3C58C1',
    padding: 11,
    borderRadius: 15,
    marginVertical:5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -2,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: '',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  logo2: {
    width: 118,
    height: 118,
    resizeMode: 'contain',
  },
  logo3: {
    width: 138,
    height: 138,
    resizeMode: 'contain',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  menuIcon: {
    marginRight: 12,
    width:25,
    height:25,
  },
  email: {
    fontSize: 14,
    color: '#fff',
  },
  profileImage: {
    width: 41,
    height: 41,
    borderRadius: 20,
    marginLeft: 125,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 7,
    marginBottom: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  logoutButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  backgroundImage: {
    position: 'absolute',
    width: 350,  // Largeur de l'image
    height: 350, // Hauteur de l'image
    zIndex: -1,  // Met les images derrière le contenu
  },
  image1: {
    top: -5,
    left: 8,
  },
  image2: {
    top: 450,
    right: -15,
    width: 350,  // Largeur de l'image
  },
  image3: {
    top: 390,
    right: -5,
  },

})