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
import { ActivityIndicator } from 'react-native';




const NewConsultationScreen = () => {

  const route = useRoute();

  const { patient } = route.params;
  const { patientData } = route.params; // Récupérer les données du patient
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

        // const doctorData = {
        //   _id: decodedToken.user_id, // ID du médecin à partir du token
        //   name: decodedToken.name, // Extrait du token ou backend
        //   role: decodedToken.role, // Rôle, si disponible
        // };

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

  // if (!consultationData.photo_material) {
  //   Alert.alert('No image selected', 'Please retake an image before uploading.');
  //   return;
  // }

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

 // Options pour le champ Status
 const statusOptions = [
  { key: 'New', value: 'New' },
  { key: 'In_Review', value: 'In_Review' },
  { key: 'Closed', value: 'Closed' },
];
 
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
    const patientID = patient?._id;

    // const patient = {
    //   _id: patient?._id, // Assurez-vous que patient existe
    //   name: patient?.name,
    //   age: patient?.age,
    // };

    if (!medical_staff_Id || !patientID) {
      Alert.alert('Error', 'Missing doctor or patient information.');
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
            status: consultationData.status,
            createdAt: consultationData.createdAt,
            photo_material: photoUrls,
          },
        },
      });

      console.log('Consultation Created:', result.data);
      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      Alert.alert('Success', 'Consultation created successfully!');

      // Naviguer vers la page de détails
      navigation.navigate('Details', { consultation: result.data.consultationCreateOne.record });
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
          <Text>cannot show patient information here.</Text>
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
          keyboardType="numeric"
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
      <TouchableOpacity style={styles.photoButton} onPress={pickImageFromGallery}>
        <Text style={styles.photoButtonText}>Go to gallery</Text>
      </TouchableOpacity>

      <View>
            {consultationData.photo_material.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imagePreview} />
            ))}
          </View>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}

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