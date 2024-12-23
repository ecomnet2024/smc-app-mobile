import { StyleSheet, Text, View, Button } from 'react-native'
import React,  { useEffect, useContext }  from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput, ScrollView } from 'react-native-gesture-handler'
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import Testconsult from '../../Components/testconsult';
import { GET_CONSULTATION } from '../../src/Screens/graphql/Queries';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import { jwtDecode } from 'jwt-decode';
import { useMutation } from '@apollo/client';
import { USER_UPDATE_PICTURE } from '../../src/Screens/graphql/Mutation'; 
import SessionContext from '../../Components/SessionProvider';



const HomeScreen = () => {

  const { loading, error, data, refetch } = useQuery(GET_CONSULTATION);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [isTokenChecked, setIsTokenChecked] = useState(false); // État pour savoir si la vérification est terminée
  const { handleLogout } = useContext(SessionContext); // Importe handleLogout depuis le contexte
  const [profileImage, setProfileImage] = useState(require('../assets/images-user.png')); // Image par défaut
  const [updateUser] = useMutation(USER_UPDATE_PICTURE); // Mutation GraphQL


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          console.log("token decode",decodedToken);
          setUserName(decodedToken.name || 'User'); // Définit un nom par défaut si non trouvé
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName('User');
      }
    };
    fetchUserName();
  }, []);

  //-----------------------------------------------------------------------------------

  const uploadImageToCloudinary = async (uri) => {
    const data = new FormData();
    data.append('file', {
      uri,
      name: 'profile_image.jpg',
      type: 'image/jpeg',
    });
    data.append('upload_preset', 'my_preset');
    data.append('cloud_name', 'djovqbxfl');
  
    const response = await fetch('https://api.cloudinary.com/v1_1/djovqbxfl/image/upload', {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    return result.secure_url;
  };
  // Function to upload image to Cloudinary

  //------------------------------------------------------------------------------------



  // Gérer l'image de profil
  const handleProfileImagePress = async () => {
    const options = [
      { text: 'Take a Photo', onPress: () => pickImage('camera') },
      { text: 'Choose from Gallery', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ];
    Alert.alert('Profile Picture', 'Choose an option', options);
  };
  const pickImage = async (source) => {
    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1, });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1,  });
      }
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setProfileImage({ uri }); // Mise à jour de l'image affichée

        console.log('Image sélectionnée avec succès:', uri);
        // Upload vers Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(uri);
        console.log('Image uploadée sur Cloudinary:', cloudinaryUrl);
        // Mise à jour de l'utilisateur via GraphQL
        const userId = await AsyncStorage.getItem('userId'); // ID de l'utilisateur
        if (userId) {
          await updateUser({
            variables: {
              id: userId,
              record: { image: cloudinaryUrl },
            },
          });
          console.log('Utilisateur mis à jour avec succès');
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l’image:', error);
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Rafraîchir automatiquement toutes les 60 secondes
      console.log('Data refreshed automatically');
    }, 70000);
  
    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [refetch]);
  
  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Rafraîchir les données à chaque fois que la page est affichée
      console.log('Data refreshed on focus');
    }, [refetch])
  );


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

  // const handleLogout = async () => {
  //   // Supprimer le token et le firstName lors de la déconnexion
  //   await AsyncStorage.removeItem('token');
  //   await AsyncStorage.removeItem('userEmail');
  //   navigation.replace('Login');
  // };


  const handleNewConsultation=()=>{
     navigation.navigate("NewPatient");
  }

  if (loading) {
    return <SafeAreaView><Text>Loading...</Text></SafeAreaView>; // Ou votre propre composant de chargement
  }
  
  if (error) {
    return <SafeAreaView><Text>Error: {error.message}</Text></SafeAreaView>;
  }


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView>

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

          <TouchableOpacity onPress={handleProfileImagePress}>
          <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>

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
            <Text style={styles.email}>  Hello,{"\n"}{userName}</Text>
          </View>
        </View>


        {/* Barre de recherche */}
        

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

       <Testconsult />

       </ScrollView>

    </SafeAreaView>
    </GestureHandlerRootView>
  )

}


export default HomeScreen

const styles = StyleSheet.create({
  scrollContainer: {
   // flexGrow: 1, // Permet à ScrollView de s'étendre pour tout le contenu
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
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
    width: 45,
    height: 45,
    borderRadius: 25,
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