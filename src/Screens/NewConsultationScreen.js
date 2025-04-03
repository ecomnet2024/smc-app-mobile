import { StyleSheet, Text, View , ScrollView, Alert} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Image } from 'react-native'
import { useMutation } from '@apollo/client';
import { CREATE_CONSULTATION} from '../../src/Screens/graphql/Mutation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native';
import { colors } from '../assets/utils/color';
import { Formik } from "formik";
import * as Yup from "yup";



const NewConsultationScreen = () => {

  const route = useRoute();
  const { patient, patientData, patientId } = route.params || {};

  console.log('Route params:', { patient, patientData, patientId });

  const { name, age, gender} = patientData || {}; // Déstructurer les données

  const [loading, setLoading] = useState(false);

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
    pulse: '',
    blood_pressure: '',
    medical_history: '',
    surgical_history: '',
    photo_material: [], // Stockage de l'URI de la photo
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

 // Prise de la photo par camera
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
    try {
      console.log('Photo URI:', photo.assets[0].uri);
      setConsultationData((prevState) => ({
        ...prevState,
        photo_material: [...prevState.photo_material, photo.assets[0].uri],
      }));
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  }
};

// select image from gallery
const pickImageFromGallery = async () => {
  const photo = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!photo.canceled) {
    console.log('Gallery Image URI:', photo.assets[0].uri);
    setConsultationData((prevState) => ({
      ...prevState,
      photo_material: [...prevState.photo_material, photo.assets[0].uri],
    }));
  }
};



// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (fileUri) => {

  console.log('Uploading to Cloudinary:', fileUri);

  const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('upload_preset', 'my_preset');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/djovqbxfl/image/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to upload image');
      return data.secure_url; // URL de l’image téléversée sur Cloudinary
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    } 
};
 

  const handleSubmit = async () => {
     // Logs pour vérifier les données du formulaire
     console.log('Submitting Consultation Data:', consultationData);

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

    const medical_staff_Id = await getDoctorIdFromToken();
    const patientID = patientId || patient?._id;

    if (!medical_staff_Id || !patientID) {
      Alert.alert('Error', 'Missing doctor or patient information.');
      return;
    }
    if (!patientID) {
      Alert.alert('Error', 'Patient ID is missing.');
      return;
    }
    

    try {

      setLoading(true);
      // Vérifiez si une image a été ajoutée
    let photoUrls = [];
    if (consultationData.photo_material.length > 0) {
      console.log("Uploading photos...");
      // Upload toutes les images (dans le cas d'un tableau d'images)
      photoUrls = await Promise.all(
        consultationData.photo_material.map(async (uri) => {
          const url = await uploadImageToCloudinary(uri);
          console.log("Uploaded Photo URL:", url);
          return url;
        })
      );
    }

    console.log("Data being submitted:", {
      medical_staff: medical_staff_Id,
      patient: patientID,
      temperature,
      complain: consultationData.complain,
      pulse,
      medical_history:consultationData.medical_history,
      surgical_history:consultationData.surgical_history,
      blood_pressure: consultationData.blood_pressure,
      status: consultationData.status,
      createdAt: consultationData.createdAt,
      photo_material: photoUrls,
    });
    

       //Création de la consultation
       const result = await consultationCreateOne({
        variables: {
          record: {
            medical_staff: medical_staff_Id,
            patient: patientID,
            temperature: parseFloat(consultationData.temperature),
            complain: consultationData.complain,
            pulse: parseFloat(consultationData.pulse),
            blood_pressure: consultationData.blood_pressure,
            medical_history:consultationData.medical_history,
            surgical_history: consultationData.surgical_history,
            status: consultationData.status,
            createdAt: consultationData.createdAt,
            photo_material: photoUrls,
          },
        },
      });

      console.log('Consultation Created:', result.data);
      const createdConsultation = result.data?.consultationCreateOne?.record;
      console.log('Consultation Created:', createdConsultation);

      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      Alert.alert('Success', 'Consultation created successfully!');

      setConsultationData((prevState) => ({
        ...prevState,
        temperature: '',
        complain: '',
        pulse: '',
        blood_pressure: '',
        medical_history: '',
        surgical_history: '',
        photo_material: [],
      }));

      // Naviguer vers la page de détails
      navigation.navigate('ConsultationTabs',
       { consultation: result.data.consultationCreateOne.record,  patient: patient, 
        patientData: result.data.consultationCreateOne.record.patient, 
        patientId: result.data.consultationCreateOne.record.patient  });

    } catch (error) {
      console.error("GraphQL Error:", error.networkError || error.graphQLErrors || error);
      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      Alert.alert('Error', error.message || "Failed to create consultation.");
    } finally {
      setLoading(false);
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
        <Ionicons name="chevron-back-circle" size={38} color="gray" />
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
            <Text>Name: {name}</Text>
            <Text>Age: {age}</Text>
            <Text>Gender: {gender}</Text>
          </>
        ) : (
          <Text>cannot show patient information here.</Text>
        )}
      </View>

   {/* Formulaire stylisé dans un bloc */}
   <View style={styles.formContainer}>

         {/* Consultation Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Consultation</Text>
        <Text style={styles.legend}>
             <Text style={styles.required}>*</Text> Indicate an obligatory field.
        </Text>

        <Text style={styles.label}>Complaint
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.textArea}
          value={consultationData.complain}
          multiline
          numberOfLines={3}
          onChangeText={(value) => setConsultationData({ ...consultationData, complain: value })}
        />

        <Text style={styles.label}>Pulse
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="/min"
          value={consultationData.pulse}
          onChangeText={(value) => setConsultationData({ ...consultationData, pulse: parseFloat(value) })}
        />

        <Text style={styles.label}>Temperature
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="°C"
          value={consultationData.temperature}
          onChangeText={(value) => setConsultationData({ ...consultationData, temperature: parseFloat(value) })}
        />

        <Text style={styles.label}>Blood Pressure
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          keyboardType="numbers-and-punctuation"
          value={consultationData.blood_pressure}
          onChangeText={(text) => setConsultationData({ ...consultationData, blood_pressure: text })}
          placeholder="SYS/DIA"
        />

        <Text style={styles.label}>Medical History</Text>
        <TextInput
          style={styles.textArea}
          value={consultationData.medical_history}
          multiline
          numberOfLines={2}
          onChangeText={(value) => setConsultationData({ ...consultationData, medical_history: value })}
        />

        <Text style={styles.label}>Surgical History</Text>
        <TextInput
          style={styles.input}
          value={consultationData.surgical_history}
          onChangeText={(value) => setConsultationData({ ...consultationData, surgical_history: value })}
        />

         <Text style={styles.label}>Photo Material</Text>
      <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPick}>
        <Text style={styles.photoButtonText}>Take a Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.photoButton} onPress={pickImageFromGallery}>
        <Text style={styles.photoButtonText}>Go to gallery</Text>
      </TouchableOpacity>

      <View>
            {consultationData.photo_material.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </View>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}

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
        paddingHorizontal: 12,
        backgroundColor: '#fff',
      },
  container:{
    flex: 1,
    marginTop: 8,
    marginHorizontal: 10,
  },
  image: {
    width: '67%',
    height: 124, // Taille de l'image en haut
    resizeMode: 'cover', // Adapter l'image
    alignSelf: 'center'
  },
  legend: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  required: {
    color: 'red',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
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
    backgroundColor: colors.primary,
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
    height: 70,
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
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
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
  photoButton: {
    backgroundColor: '#ddd',
    padding: 6,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  photoButtonText: { color: '#000000', fontSize: 15 },
  imagePreview: { width: '100%', height: 190, marginBottom: 20 },
  noPhotoText: { color: '#999', marginBottom: 20, fontStyle: 'italic' },
 
})