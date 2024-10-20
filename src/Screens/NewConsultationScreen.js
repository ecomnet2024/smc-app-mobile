import { StyleSheet, Text, View , ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Image } from 'react-native'


const NewConsultationScreen = () => {


  const navigation = useNavigation();
    // État pour les valeurs des champs
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      address: '',
      city: '',
    });
  
    // Fonction pour mettre à jour les champs
    const handleInputChange = (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    // Fonction pour soumettre le formulaire
    const handleSubmit = () => {
      console.log('Form Data:', formData);
    };
  


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} >
        <Ionicons name="chevron-back-circle" size={35} color="gray" />
      </TouchableOpacity>

    </View>
      
      {/* Image au-dessus */}
      <Image
        source={require('../assets/undraw_medicine_b1ol.png')}
        style={styles.image}
      />

   {/* Formulaire stylisé dans un bloc */}
   <View style={styles.formContainer}>
        {/* Rubrique: Informations personnelles */}
        <Text style={styles.heading}>Informations personnelles</Text>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={formData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={formData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />

        {/* Rubrique: Détails du compte */}
        <Text style={styles.heading}>Détails du compte</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />

        {/* Rubrique: Adresse */}
        <Text style={styles.heading}>Adresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />

      <TouchableOpacity style= {styles.signInButton} onPress={handleSubmit} >
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>

    </View>
    </ScrollView>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default NewConsultationScreen

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Permet à ScrollView de s'étendre pour tout le contenu
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
      },
  container:{
    flex: 1,
    marginTop: 15,
    marginHorizontal: 10,
  },

  image: {
    width: '100%',
    height: 200, // Taille de l'image en haut
    resizeMode: 'cover', // Adapter l'image
  },
  formContainer: {
    backgroundColor: '#fff', // Fond du formulaire
    padding: 20,
    marginTop: -20, // Permet au bloc de monter légèrement au-dessus de l'image
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000', // Ombre pour un effet de profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Pour Android, ombre
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
 /* formContainer:{
    marginTop:30,
  },
  inputContainer:{
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 9,
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:'#f8f8f8',
    borderColor:'#f8f8f8',
  },
  TextInput:{
    flex:1,
    paddingHorizontal:10,
    fontWeight:"light",
  }, */
  backButton: {
    left: 5,
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  signInButton: {
    backgroundColor: "#3C58C1",
    paddingVertical: 11,
    paddingHorizontal:15,
    marginHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical:4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight:'semibold',
  },
  buttonText2: {
    color: '#000000',
    fontSize: 15,
    fontWeight:'semibold',
  },
  Text:{
    fontSize: 16,
    alignSelf: 'center',
    marginVertical:5,
  },
  buttonContainer: {           
    flexDirection: 'row',  
    justifyContent: 'space-between',
    width: '80%',        
  },
  TextContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:8,
  },

})