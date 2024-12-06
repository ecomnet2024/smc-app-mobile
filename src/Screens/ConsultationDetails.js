import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity, Image } from 'react-native'
import { GestureHandlerRootView, TextInput, ScrollView } from 'react-native-gesture-handler'
import React from 'react'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_CONSULTATION, REMOVE_CONSULTATION } from '../Screens/graphql/Mutation';
import { GET_CONSULTATION_BY_PATIENT } from '../Screens/graphql/Queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';


const ConsultationDetails = ({ route }) => {

  const navigation = useNavigation();

   // Récupérer la consultation passée en paramètre
   const { consultation, patient } = route.params;
   console.log("Consultation Details Patient :", consultation.patient); 
   console.log("Consultation Details Consultation:", consultation);
   console.log("Received consultation data:", consultation);
console.log("Photo material:", photoMaterial);

   const photoMaterial = consultation.photo_material || [];
   let patientId= consultation.patient._id;
   let patientObj= consultation.patient;
   console.log("Consultation Details PatientID :", patientId);
   console.log("Consultation Details Patient object :", patientObj);
   
  const { loading, error, data, refetch } = useQuery(GET_CONSULTATION_BY_PATIENT, {
    variables: { patientId },
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Rafraîchir les données à chaque fois que la page est affichée
      console.log('Data refreshed on focus');
    }, [refetch])
  );

  const [removeConsultation, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_CONSULTATION, {
    onCompleted: () => {
      refetch();  // Recharger les données de consultations
    },
  });

  // États pour les modales
  const [isConsultationModalVisible, setConsultationModalVisible] = useState(false);

  // États pour les nouveaux formulaires
  const [newConsultationData, setNewConsultationData] = useState({
    complain: '',
    blood_pressure: '',
    pulse: '',
    createdAt: new Date(),
    temperature: '',
    status: 'New',
    photo_material: ''
  });

    // Prise de la photo avec conversion en Base64
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
    setNewConsultationData({ ...newConsultationData, photo_material: photo.assets[0].uri });
  }
};

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    setNewConsultationData({ ...newConsultationData, createdAt: selectedDate });
  };
  const [date, setDate] = useState();


 // Hook Apollo pour la mutation de création de consultation
 const [consultationCreateOne, { loading: loadingConsultation, error: errorConsultation }] = useMutation(CREATE_CONSULTATION , {
  onCompleted: () => {
    refetch();  // Recharger les données de consultations
  },
});

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
         createdAt: newConsultationData.createdAt,
         patient: patientId,  // Utiliser l'ID du patient actuel
         medical_staff: doctorId,
         photo_material: newConsultationData.photo_material, // Ajouter l'image en Base64
         }
       }  

     });

     console.log('Consultation créée:', data.consultationCreateOne);
     setConsultationModalVisible(false);  // Fermer la modale après création

   } catch (err) {
     console.error("Erreur lors de la création de la consultation:", err);
   }

};

const handleRemoveConsultation = async (consultationId) => {
  try {
    const { data } = await removeConsultation({ variables: { id: consultationId } });
     // Actualiser la liste des consultations après suppression
     

    if (data.consultationRemoveById.recordId) {
      Alert.alert('Success', 'Consultation successfully removed.');
     
    } else {
      Alert.alert('Error', 'Failed to remove consultation.');
    }
  } catch (err) {
    console.error('Error while removing consultation:', err);
    Alert.alert('Error', 'An unexpected error occurred.');
  }

  useFocusEffect(
    React.useCallback(() => {
      // Refetch les données lorsque la page devient active
      refetch();
    }, [])
  );

};


// Options pour le champ Status
const statusOptions = [
  { key: 'New', value: 'New' },
  { key: 'In_Review', value: 'In_Review' },
  { key: 'Closed', value: 'Closed' },
];


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

      <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} >
        <Ionicons name="chevron-back-circle" size={39} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate("HomeTabs")} >
         <Ionicons name="home" size={39} color="black" />
      </TouchableOpacity>
      </View>

     
      {!loading && !error && data?.consultationMany && data.consultationMany.length > 0 ? (
      <ScrollView>
      {data.consultationMany.map((consultation) => (
    <View key={consultation._id} style={styles.detailCard}>
      <Text style={styles.title}>Details consultation for Patient: {consultation.patient.name}</Text>
          
      <Text style={styles.label}>Complain: <Text style={styles.value}> {consultation.complain}</Text></Text>
      {/* <Text style={styles.label}>Blood Pressure: <Text style={styles.value}> {consultation.blood_pressure}</Text></Text>
      <Text style={styles.label}>Pulse: <Text style={styles.value}> {consultation.pulse}</Text></Text> */}
      <Text style={styles.label}>Temperature: <Text style={styles.value}> {consultation.temperature}</Text></Text> 
      <Text style={styles.label}>Status: <Text style={styles.value}> {consultation.status}</Text></Text> 
      {/*<Text style={styles.label}>Medications: <Text style={styles.value}> {consultation.medications}</Text></Text>*/} 
      <Text style={styles.label}>Created at: <Text style={styles.value}> {new Date(consultation.createdAt).toISOString().split("T")[0]}</Text></Text>
      
      <View>
  {photoMaterial.map((uri, index) => (
    <Image key={index} source={{ uri }} style={styles.imagePreview} />
  ))}
</View>

         {/* Bouton "Afficher" */}
         <View style={styles.headerContainer}>
    <TouchableOpacity
      style={styles.viewButton}
      onPress={() => navigation.navigate('ConsultationDetailView', { consultation })}>
      <Text style={styles.buttonText}>Show All</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleRemoveConsultation(consultation._id)}>
        <AntDesign name="delete" size={28} color="red" />
    </TouchableOpacity>
    </View>

      </View>
      ))}
    </ScrollView>
     ) : (
      !loading && !error && <Text style={styles.noData}>No consultations available for this patient.</Text>
    )}


         <TouchableOpacity
              style={styles.button}
              onPress={() => setConsultationModalVisible(true)}>
              <Text style={styles.buttonText}>Add Consultation</Text>
         </TouchableOpacity>

          {/* Modale pour Ajouter une Consultation */}
          <Modal
            visible={isConsultationModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setConsultationModalVisible(false)}>
              <ScrollView>
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
                  keyboardType='numeric'
                  value={newConsultationData.blood_pressure}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, blood_pressure: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Pulse"
                  keyboardType='numeric'
                  value={newConsultationData.pulse}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, pulse: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Temperature"
                  keyboardType='numeric'
                  value={newConsultationData.temperature}
                  onChangeText={(text) => setNewConsultationData({ ...newConsultationData, temperature: text })}
                />

         <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
          <Text>Date of creation: {newConsultationData.createdAt.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={newConsultationData.createdAt}
            mode="date"
            display="default"
            onChange={onStartDateChange}
          />
        )}

        <SelectList
          setSelected={(val) => setNewConsultationData({ ...newConsultationData, status: val })}
          data={statusOptions}
          placeholder="Select Status"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
        />

         <Text style={styles.label}>Photo Material</Text>
      <TouchableOpacity style={styles.photoButton} onPress={handlePhotoPick}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      {newConsultationData.photo_material ? (
        <Image source={{ uri: newConsultationData.photo_material }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.noPhotoText}>No photo selected</Text>
      )}
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
            </ScrollView>
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
  width: 185,
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 10,
  alignSelf: 'center',
},
cancelButton: {
  backgroundColor: '#e74c3c',
  padding: 12,
  width: 185,
  alignSelf: 'center',
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 10,
},
cancelButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
dateButton: {
  padding: 15,
  backgroundColor: '#ddd',
  marginBottom: 10,
  borderRadius: 5,
},
modalText: {
  fontSize: 16,
  color: '#333',
  marginBottom: 10,
},
image: { width: '100%', height: 300, marginTop: 20 },
/*photo: {
  width: '100%',
  height: 200,
  resizeMode: 'cover',
  marginBottom: 10,
},*/
noPhoto: {
  fontSize: 12,
  color: 'gray',
},
photo: {
  width: '100%',
  height: 200,
  resizeMode: 'cover',
  marginVertical: 10,
},
noPhotoContainer: {
  marginVertical: 0,
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto', // Permet au conteneur de s'adapter uniquement au contenu
},
noPhoto: {
  textAlign: 'center',
  color: '#888',
  fontSize: 14,
  marginVertical: 0, // Réduit toute marge supplémentaire
},
noData: {
  textAlign: 'center',
  fontSize: 16,
  color: '#888',
  marginTop: 20,
},
deleteButton: {
  backgroundColor: '#fff',
  padding: 8,
  paddingLeft:10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'flex-end',
},
headerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 10,
  marginVertical: 10,
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
viewButton: {
  backgroundColor: '#1abc9c',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  alignItems: 'center',
},


})