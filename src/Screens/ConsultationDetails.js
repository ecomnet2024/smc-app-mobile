import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity } from 'react-native'
import { GestureHandlerRootView, TextInput, ScrollView } from 'react-native-gesture-handler'
import React from 'react'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_PATIENT } from '../Screens/graphql/Mutation';
import { CREATE_CONSULTATION } from '../Screens/graphql/Mutation';
import { GET_CONSULTATION_BY_PATIENT } from '../Screens/graphql/Queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

const ConsultationDetails = ({ route }) => {

   // Récupérer la consultation passée en paramètre
   const { consultation, patientId } = route.params;
   console.log("Consultation Details Patient ID:", patientId); // Vérifier si `patientId` est bien reçu
   console.log("Consultation Details Consultation:", consultation);
   
  const { loading, error, data } = useQuery(GET_CONSULTATION_BY_PATIENT, {
    variables: { patientId },
  });
  
  // États pour les modales
  const [isConsultationModalVisible, setConsultationModalVisible] = useState(false);
  const [isPatientModalVisible, setPatientModalVisible] = useState(false);

  // États pour les nouveaux formulaires
  const [newConsultationData, setNewConsultationData] = useState({
    complain: '',
    blood_pressure: '',
    pulse: '',
    temperature: '',
    status: ''
  });
  const [newPatientData, setNewPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    location: ''
  });

 // Hook Apollo pour la mutation de création de consultation
 const [consultationCreateOne, { loading: loadingConsultation, error: errorConsultation }] = useMutation(CREATE_CONSULTATION);

 const handleAddConsultation = async () => {
   const doctorId = await getDoctorIdFromToken();
   if (!doctorId) {
     Alert.alert("Error", "Unable to retrieve doctor ID");
     return;
   }
  // Vérification des champs vides
  if (
    !newConsultationData.complain ||
    !newConsultationData.blood_pressure ||
    !newConsultationData.pulse ||
    !newConsultationData.temperature ||
    !newConsultationData.status
  ) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  // Vérification des valeurs spécifiques
  const temperature = parseFloat(newConsultationData.temperature);
  if (temperature < 30 || temperature > 42) {
    Alert.alert("Error", " temperature must be between 30°C and 42°C");
    return;
  }

  const pulse = parseFloat(newConsultationData.pulse);
  if (pulse < 40 || pulse > 180) {
    Alert.alert("Error", "Pulse must be between 40 and 180 bpm");
    return;
  }

   try {
     const { data } = await consultationCreateOne({
       variables: {
         record: {
         complain: newConsultationData.complain,
         blood_pressure: newConsultationData.blood_pressure,
         pulse: parseFloat(newConsultationData.pulse),
         temperature: parseFloat(newConsultationData.temperature),
         status: newConsultationData.status,
         patient: patientId,  // Utiliser l'ID du patient actuel
         doctor: doctorId
         }
       }
     });

     console.log('Consultation créée:', data.consultationCreateOne);
     setConsultationModalVisible(false);  // Fermer la modale après création
   } catch (err) {
     console.error("Erreur lors de la création de la consultation:", err);
   }
};

 const handleAddPatient = async () => {
  ////////////////
 };


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

  console.log(data);

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      {!loading && !error && data?.consultationMany && data.consultationMany.length > 0 ? (
       
      <ScrollView>
      {data.consultationMany.map((consultation) => (
    <View key={consultation._id} style={styles.detailCard}>
      <Text style={styles.title}>Details consultation for Patient: {consultation.patient.name}</Text>
          
      <Text style={styles.label}>Complain: <Text style={styles.value}> {consultation.complain}</Text></Text>
      <Text style={styles.label}>Blood Pressure: <Text style={styles.value}> {consultation.blood_pressure}</Text></Text>
      <Text style={styles.label}>Pulse: <Text style={styles.value}> {consultation.pulse}</Text></Text>
      <Text style={styles.label}>Temperature: <Text style={styles.value}> {consultation.temperature}</Text></Text> 
      <Text style={styles.label}>Status: <Text style={styles.value}> {consultation.status}</Text></Text> 
      <Text style={styles.label}>Medications: <Text style={styles.value}> {consultation.medications}</Text></Text> 
      <Text style={styles.label}>Created at: <Text style={styles.value}> {consultation.patient.createdAt}</Text></Text>
      
      </View>
      ))}
    </ScrollView>
     ) : (
      !loading && !error && <Text>No consultations available for this patient.</Text>
    )}


    <TouchableOpacity
              style={styles.button}
              onPress={() => setConsultationModalVisible(true)}>
              <Text style={styles.buttonText}>Add Consultation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setPatientModalVisible(true)}>
              <Text style={styles.buttonText}>Add Patient</Text>
            </TouchableOpacity>

          {/* Modale pour Ajouter une Consultation */}
          <Modal
            visible={isConsultationModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setConsultationModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Consultation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Complain"
                  value={newConsultationData.complain}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, complain: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Blood Pressure"
                  value={newConsultationData.blood_pressure}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, blood_pressure: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Pulse"
                  value={newConsultationData.pulse}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, pulse: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Temperature"
                  value={newConsultationData.temperature}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, temperature: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Status"
                  value={newConsultationData.status}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, status: text })}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddConsultation}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setConsultationModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ConsultationDetails

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    flex: 1,
    marginTop:5
   },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  detailCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop:20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 4,
},
value: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#333',
},
button: {
  backgroundColor: '#3498db',
  padding: 12,
  borderRadius: 8,
  marginTop: 15,
  alignItems: 'center',
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  maxWidth: 400,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 8,
  marginBottom: 15,
  fontSize: 16,
},
submitButton: {
  backgroundColor: '#2ecc71',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
cancelButton: {
  backgroundColor: '#e74c3c',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
cancelButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
modalText: {
  fontSize: 16,
  color: '#333',
  marginBottom: 10,
}
})