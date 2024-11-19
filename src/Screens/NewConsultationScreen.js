import { StyleSheet, Text, View , ScrollView, Pressable, Platform, Alert} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { Image } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';
import { useMutation } from '@apollo/client';
import { CREATE_CONSULTATION} from '../Screens/graphql/Mutation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import * as ImagePicker from 'expo-image-picker';



const NewConsultationScreen = () => {

  const route = useRoute();

  const { patient } = route.params;
  const { patientData } = route.params; // Récupérer les données du patient
  const { name, age, gender} = patientData || {}; // Déstructurer les données


  const navigation = useNavigation();


  const getDoctorIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("Token_present",token);
      
      if (token) {
        const tokenString = String(token)
        const decodedToken = jwtDecode(tokenString);
        const doctorId = decodedToken.user_id;
        console.log("token decode",decodedToken);
        return doctorId;

      } else {
        console.error("Token not found");
        return null;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  

  const [consultationData, setConsultationData] = useState({
    temperature: '',
    complain: '',
    //allergies: '',
    //medications: '',
    pulse: '',
    blood_pressure: '',
   // surgical_history: '',
   // emergency: false,
    photo_material: '', // Stockage de l'URI de la photo
    createdAt: new Date(),
    status:'New',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setConsultationData({ ...consultationData, [field]: value });
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    setConsultationData({ ...consultationData, createdAt: selectedDate });
  };
  const [date, setDate] = useState(new Date());
  

  // Mutations GraphQL
 const [consultationCreateOne,{data}] = useMutation(CREATE_CONSULTATION);

 // Prise de la photo
 const handlePhotoPick = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Permission Required', 'Camera access is needed to take a photo.');
    return;
  }
  const photo = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!photo.canceled) {
    setConsultationData({ ...consultationData, photo_material: photo.assets[0].uri });
  }
};

 // Options pour le champ Status
 const statusOptions = [
  { key: 'New', value: 'New' },
  { key: 'In_Review', value: 'In_Review' },
  { key: 'Closed', value: 'Closed' },
];
 

  const handleSubmit = async () => {
     // Logs pour vérifier les données du formulaire
     console.log('Consultation Data:', consultationData);
     if (!consultationData.temperature || !consultationData.complain || !consultationData.pulse || !consultationData.blood_pressure) {
      // Gestion des erreurs si un champ est vide
      alert('Please fill in all required fields');
      return;
    }

  // Vérification des valeurs spécifiques
  const temperature = parseFloat(consultationData.temperature);
  if (temperature < 30 || temperature > 42) {
    Alert.alert("Error", " temperature must be between 30°C and 42°C");
    return;
  }
  const pulse = parseFloat(consultationData.pulse);
  if (pulse < 40 || pulse > 180) {
    Alert.alert("Error", "Pulse must be between 40 and 180 bpm");
    return;
  }

    if (!patient) {
      console.error('Erreur: patient manquant');
      return;
    }
    const doctorId = await getDoctorIdFromToken();
    let patientID = patient._id;

    if (!doctorId) {
      Alert.alert("Error", "Unable to retrieve doctor ID");
      return;
    }

    try {
      const result = await consultationCreateOne({
        variables: {
          record: {
            doctor: doctorId, // ID du docteur connecté (récupérer dynamiquement)
            patient: patientID,
            temperature: parseFloat(consultationData.temperature),
            complain: consultationData.complain,
            pulse: parseFloat(consultationData.pulse),
            blood_pressure: consultationData.blood_pressure,
            status: consultationData.status,
            createdAt: consultationData.createdAt,
            photo_material: consultationData.photo_material,
           // surgical_history: consultationData.surgical_history,
           // emergency: consultationData.emergency,
          },
        },
      });
      if (result.data && result.data.consultationCreateOne) {
        Alert.alert("Consultation Created", "Your consultation has been created successfully.");
        
        // Passer les données de consultation à la page d'accueil
        navigation.navigate('Details', { consultation: result.data.consultationCreateOne.record });
      } else {                                    //Data
        throw new Error("Error creating consultation");
      }
      console.log('Consultation created:', result);
      console.log("datamutation",data);

      // Rediriger ou afficher une confirmation
    } catch (error) {
      console.error('Error creating consultation:', error);
      Alert.alert("Error", "There was a problem creating your consultation.");
    }

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

     {/* Affichage des informations du patient */}
     <View style={styles.patientInfo}>
        {patientData ? (
          <>
            <Text>Nom: {name}</Text>
            <Text>Âge: {age}</Text>
            <Text>Genre: {gender}</Text>
          </>
        ) : (
          <Text>Aucune donnée du patient disponible.</Text>
        )}
      </View>

   {/* Formulaire stylisé dans un bloc */}
   <View style={styles.formContainer}>

         {/* Consultation Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Consultation</Text>

        <Text style={styles.label}>Complaint</Text>
        <TextInput
          style={styles.textArea}
          value={consultationData.complain}
          multiline
          numberOfLines={4}
          onChangeText={(value) => setConsultationData({ ...consultationData, complain: value })}
        />

        <Text style={styles.label}>Pulse</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={consultationData.pulse}
          onChangeText={(value) => setConsultationData({ ...consultationData, pulse: parseFloat(value) })}
        />

        <Text style={styles.label}>Temperature</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={consultationData.temperature}
          onChangeText={(value) => setConsultationData({ ...consultationData, temperature: parseFloat(value) })}
        />

        <Text style={styles.label}>Blood Pressure</Text>
        <TextInput
          style={styles.input}
          value={consultationData.blood_pressure}
          onChangeText={(text) => setConsultationData({ ...consultationData, blood_pressure: text })}
          placeholder="Enter blood pressure"
        />

         <Text style={styles.label}>Status</Text>
        <SelectList
          setSelected={(val) => setConsultationData({ ...consultationData, status: val })}
          data={statusOptions}
          placeholder="Select Status"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
        />

         <Text style={styles.label}>Photo Material</Text>
      <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPick}>
        <Text style={styles.photoButtonText}>Take a Photo</Text>
      </TouchableOpacity>

      {consultationData.photo_material ? (
        <Image source={{ uri: consultationData.photo_material }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.noPhotoText}>No photo selected</Text>
      )}

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text>Date of creation: {consultationData.createdAt.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={consultationData.createdAt}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

      </View>

        <TouchableOpacity style= {styles.signInButton} onPress={handleSubmit} >
          <Text style={styles.buttonText}>Submit</Text>
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
        paddingHorizontal: 14,
        backgroundColor: '#fff',
      },
  container:{
    flex: 1,
    marginTop: 12,
    marginHorizontal: 10,
  },
  image: {
    width: '70%',
    height: 130, // Taille de l'image en haut
    resizeMode: 'cover', // Adapter l'image
    alignSelf: 'center'
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
  textArea: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownList: {
    backgroundColor: '#f9f9f9',
  },
  patientInfo: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  patientInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  photoButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 13,
    marginBottom: 10,
    alignItems: 'center',
  },
  photoButtonText: { color: '#000000', fontSize: 16 },
  imagePreview: { width: '100%', height: 200, marginBottom: 20 },
  noPhotoText: { color: '#999', marginBottom: 20, fontStyle: 'italic' },
 
})