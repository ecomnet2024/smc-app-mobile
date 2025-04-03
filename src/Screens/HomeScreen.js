import { StyleSheet, Text, View, Button } from 'react-native'
import React,  { useEffect, useContext, useRef }  from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput, ScrollView } from 'react-native-gesture-handler'
import { Image , ActivityIndicator} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import Testconsult from '../../Components/testconsult';
import { GET_CONSULTATION, GET_USER } from '../../src/Screens/graphql/Queries';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import * as ImagePicker from 'expo-image-picker';
import { jwtDecode } from 'jwt-decode';
import { useMutation } from '@apollo/client';
import { USER_UPDATE_PICTURE } from '../../src/Screens/graphql/Mutation'; 
import SessionContext from '../../Components/SessionProvider';
import { colors } from '../assets/utils/color'



const HomeScreen = () => {

  const { loading, error, data, refetch } = useQuery(GET_CONSULTATION);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const { handleLogout } = useContext(SessionContext); // Importe handleLogout depuis le contexte
  const [profileImage, setProfileImage] = useState(require('../assets/images-user.png')); // Image par défaut
  const [updateUser] = useMutation(USER_UPDATE_PICTURE); // Mutation GraphQL
  const [userId, setUserId] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // État pour afficher le bouton
  const scrollViewRef = useRef(null); // Référence à la ScrollView


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

  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.user_id; // Assurez-vous que 'user_id' correspond bien à votre token
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

   // Récupérer l'ID utilisateur au chargement
   useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      if (id) {
        setUserId(id);
      }
    };
    fetchUserId();
  }, []);

  // Requête pour récupérer les données utilisateur
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId, // Ne pas exécuter la requête tant que l'ID utilisateur n'est pas disponible
  });

  useEffect(() => {
    if (userData?.userById?.image) {
      setProfileImage({ uri: userData.userById.image }); // Met à jour l'image si elle existe
    }
  }, [userData]);


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
        const userId = await getUserIdFromToken(); // ID de l'utilisateur
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

 // Gestion de l'affichage du bouton lors du défilement
 const handleScroll = (event) => {
  const currentOffset = event.nativeEvent.contentOffset.y;
  setShowScrollToTop(currentOffset > 100); // Affiche le bouton si on a défilé de plus de 100px
};
// Fonction pour revenir en haut
const scrollToTop = () => {
  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
};


  const handleNewConsultation=()=>{
     navigation.navigate("NewPatient");
  }
  const handleEmergency=()=>{
    navigation.navigate("Emergency");
 }
  if (loading) {
    return <SafeAreaView style={styles.error}>
    <ActivityIndicator size="large" color={colors.primary} />
    </SafeAreaView>;
  }
  if (error) {
    return <SafeAreaView style={styles.error}><Text> Error : {error.message} Check your connection or Sign In again</Text></SafeAreaView>;
  }
  if (userLoading) {
    return <SafeAreaView style={styles.error}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text>Loading user data...</Text>
    </SafeAreaView>;
  }
  if (userError) {
    console.error('Error fetching user data:', userError);
    return <SafeAreaView style={styles.error}>
    <Text> Oop's Error loading user data</Text>;
    </SafeAreaView>;
  }


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView
     ref={scrollViewRef}
     onScroll={handleScroll}
     scrollEventThrottle={16} >

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
          {/* <Ionicons name="menu" size={30} color="white" style={styles.menuIcon} /> */}
            <Text style={styles.email}>  Hello,{"\n"}{userName}</Text>
          </View>
        </View>

        <Image source={require('../assets/mapubi.png')} style={styles.bottomLeftImage} />

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
        
        <TouchableOpacity style= {styles.button} onPress={handleEmergency}>
        <Image source={require('../assets/emergency.png')} style={styles.logo2} />
          <Text style={styles.buttonText2}>Emergency</Text>
        </TouchableOpacity>
       </View>

       <View style={styles.textContainer}>
       <Text style={styles.title}> recent consultations </Text>
       </View>

       <Testconsult />

       </ScrollView>

       {/* Bouton pour remonter en haut */}
       {showScrollToTop && (
          <TouchableOpacity
            style={styles.scrollToTopButton}
            onPress={scrollToTop}
          >
            <AntDesign name="arrowup" size={26} color="white" />
          </TouchableOpacity>
        )}

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
  scrollToTopButton: {
    position: 'absolute',
    bottom: 21,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    marginVertical:2,
  },
  error: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical:50,
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
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
    backgroundColor: colors.primary,
    padding: 11,
    borderRadius: 15,
    marginVertical:2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -2,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: 'contain',
  },
  logo2: {
    width: 96,
    height: 100,
    resizeMode: 'contain',
  },
  logo3: {
    width: 140,
    height: 140,
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
    width: 48,
    height: 48,
    borderRadius: 25,
    marginLeft: 125,
    borderWidth: 1,
    borderColor: '#ccc', // Optionnel : ajout d'une bordure
    backgroundColor: '#f0f0f0', // Couleur de fond par défaut si l'image ne charge pas
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 6,
    marginBottom: 5,
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
    width: 360,  // Largeur de l'image
    height: 360, // Hauteur de l'image
    zIndex: -1,  // Met les images derrière le contenu
  },
  image1: {
    top: -20,
    left: 8,
  },
  image2: {
    top: 600,
    width: 420,  // Largeur de l'image
    left: 80,
  },
  image3: {
    top: 490,
    right: 65,
    left: 5,
  },
  bottomLeftImage: {
    position: "absolute",
    bottom: 20,
    left: 27,
    width: 62,  // Ajuste la taille selon ton besoin
    height: 62, // Ajuste la taille selon ton besoin
    resizeMode: "contain",
  },
});