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



const NewConsultationScreen = () => {

  const route = useRoute();

  const { patientId } = route.params;
  const { patientData } = route.params; // Récupérer les données du patient
  const { name, age, gender, location } = patientData || {}; // Déstructurer les données


  useEffect(() => {
    console.log('ID du patient reçu:', patientId);
  }, []);


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
    allergies: '',
    medications: '',
    dosage: '',
    //Contraindications: '',
    pulse: '',
    blood_pressure: '',
   // surgical_history: '',
   // emergency: false,
    start_date: new Date(),
    end_date: new Date(),
    status:'New',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setConsultationData({ ...consultationData, [field]: value });
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    setConsultationData({ ...consultationData, start_date: selectedDate });
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    setConsultationData({ ...consultationData, end_date: selectedDate });
  };

  const [date, setDate] = useState(new Date());
  


  // Mutations GraphQL
 const [consultationCreateOne,{data}] = useMutation(CREATE_CONSULTATION);
 

  const handleSubmit = async () => {
     // Logs pour vérifier les données du formulaire
     console.log('Consultation Data:', consultationData);
     if (!consultationData.temperature || !consultationData.complain || !consultationData.pulse || !consultationData.blood_pressure) {
      // Gestion des erreurs si un champ est vide
      alert('Please fill in all required fields');
      return;
    }
    if (!patientId) {
      console.error('Erreur: ID du patient manquant');
      return;
    }
    const doctorId = await getDoctorIdFromToken();

    if (!doctorId) {
      Alert.alert("Error", "Unable to retrieve doctor ID");
      return;
    }

    try {
      const result = await consultationCreateOne({
        variables: {
          record: {
            doctor: doctorId, // ID du docteur connecté (récupérer dynamiquement)
            patient: patientId,
            temperature: parseFloat(consultationData.temperature),
            complain: consultationData.complain,
            allergies: consultationData.allergies,
            medications: consultationData.medications,
            dosage: consultationData.dosage,
            start_date: consultationData.start_date,
            end_date: consultationData.end_date,
            pulse: parseFloat(consultationData.pulse),
            blood_pressure: consultationData.blood_pressure,
            status: consultationData.status,
           // surgical_history: consultationData.surgical_history,
           // emergency: consultationData.emergency,
          },
        },
      });
      if (result.data && result.data.consultationCreateOne) {
        Alert.alert("Consultation Created", "Your consultation has been created successfully.");
        
        // Passer les données de consultation à la page d'accueil
        navigation.navigate('Home', { consultationData: result.data.consultationCreateOne.record });
      } else {
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
            <Text>Localisation: {location}</Text>
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

        <Text style={styles.label}>Blood Pressure</Text>
        <TextInput
          style={styles.input}
          value={consultationData.blood_pressure}
          onChangeText={(value) => setConsultationData({ ...consultationData, blood_pressure: value })}
        />

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

        <Text style={styles.label}>Medications</Text>
        <TextInput
          style={styles.input}
          value={consultationData.medications}
          onChangeText={(text) => setConsultationData({ ...consultationData, medications: text })}
          placeholder="Enter medications"
        />

        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={consultationData.dosage}
          onChangeText={(text) => setConsultationData({ ...consultationData, dosage: text })}
          placeholder="Enter dosage"
        />

        <Text style={styles.label}>allergies</Text>
        <TextInput
          style={styles.input}
          value={consultationData.allergies}
          onChangeText={(text) => setConsultationData({ ...consultationData, allergies: text })}
          placeholder="Enter allergies"
        />

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text>Start Date: {consultationData.start_date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={consultationData.start_date}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

         <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
          <Text>End Date: {consultationData.end_date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={consultationData.end_date}
            mode="date"
            display="default"
            onChange={onEndDateChange}
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
    width: '85%',
    height: 160, // Taille de l'image en haut
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

})