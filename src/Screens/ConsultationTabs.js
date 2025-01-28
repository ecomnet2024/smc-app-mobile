import React , { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, FlatList, SafeAreaView, Button, Alert } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { CONSULTATION_UPDATE } from '../../src/Screens/graphql/Mutation';
import VaccinationScreen from '../../src/Screens/AllDetails/VaccinationScreen';
import PrescriptionScreen from '../../src/Screens/AllDetails/PrescriptionScreen';
import AllergyScreen from '../../src/Screens/AllDetails/AllergyScreen';
import FeedbackScreen from '../../src/Screens/AllDetails/FeedbackScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LabResultScreen from './AllDetails/LabresultScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { ActivityIndicator } from 'react-native';


const Tab = createBottomTabNavigator();

// Page principale avec les détails de la consultation
const MainDetails = ({ route }) => {
  const { consultation } = route.params;
  console.log(consultation.photo_material);

  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedData, setUpdatedData] = useState({ ...consultation });
  const [errors, setErrors] = useState({}); // Pour suivre les erreurs des champs

  const [updateConsultation, { loading, error }] = useMutation(CONSULTATION_UPDATE);

  const handleInputChange = (field, value) => {
    // Mise à jour des données
    setUpdatedData({ ...updatedData, [field]: value });
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


  const validateFields = () => {
    let validationErrors = {};

    // Validation pour chaque champ
    if (!updatedData.complain) validationErrors.complain = "Complain is required.";
    if (updatedData.temperature < 30 || updatedData.temperature > 42) {
      validationErrors.temperature = "Temperature must be between 30 and 42.";
    }
    // if (updatedData.pulse <= 0) {
    //   validationErrors.pulse = "Pulse must be greater than 0.";
    // }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; // Pas d'erreurs ?
  };



  const handleUpdate = async () => {
    if (!validateFields()) return; // Arrêter si les champs ne sont pas valides

    const updatedAt = new Date().toISOString(); // Génère la date actuelle

    const medical_staff_Id = await getDoctorIdFromToken();

    try {
      const result = await updateConsultation({
        variables: {
          id: consultation._id,
          record: {
            blood_pressure: updatedData.blood_pressure,
            complain: updatedData.complain,
            medical_history: updatedData.medical_history,
            surgical_history: updatedData.surgical_history,
            pulse: parseFloat(updatedData.pulse),
            temperature: parseFloat(updatedData.temperature),
            //updatedAt,
            lastEditBy: medical_staff_Id,
          },
        },
      });

      if (result.data?.consultationUpdateById?.record) {
        Alert.alert("Success","Consultation updated successfully!");
        setModalVisible(false); // Fermer la modale après la mise à jour
        navigation.replace("ConsultationTabs", { consultation: result.data.consultationUpdateById.record, consultation }); // Recharger la page
      } else {
        alert("Failed to update consultation.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while updating the consultation.");
    }
  };



  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView>

    <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
      <Ionicons name="home" size={35} color="black" />
     </TouchableOpacity>


        {/* Carte pour afficher les détails */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Consultation Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{consultation.patient.age}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{consultation.patient.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Complain:</Text>
            <Text style={styles.value}>{consultation.complain}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Blood Pressure:</Text>
            <Text style={styles.value}>{consultation.blood_pressure}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pulse:</Text>
            <Text style={styles.value}>{consultation.pulse}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Temperature:</Text>
            <Text style={styles.value}>{consultation.temperature}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Medical History:</Text>
            <Text style={styles.value}>{consultation.medical_history}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Surgical History:</Text>
            <Text style={styles.value}>{consultation.surgical_history}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Created At:</Text>
            <Text style={styles.value}>{new Date(consultation.createdAt).toISOString().split('T')[0]}</Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.label}>Updated At:</Text>
            <Text style={styles.value}>{new Date(consultation.updatedAt).toISOString().split('T')[0]}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{consultation.status}</Text>
          </View>
        </View>

        {/* Galerie d'images */}
        <Text style={styles.galleryHeader}>    Photos</Text>
        <ScrollView horizontal contentContainerStyle={styles.imageGallery}>
          {consultation.photo_material && consultation.photo_material.length > 0 ? (
            consultation.photo_material.map((uri, index) => (
              <Image 
                key={index} 
                source={{ uri }} 
                style={styles.imagePreview} 
                onError={(e) => console.log(`Error loading image: ${uri}`, e.nativeEvent.error)} 
              />
            ))
          ) : (
            <Text style={styles.noPhotoText}>No photos available</Text>
          )}
        </ScrollView>

        {/* Bouton Modifier */}
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="pencil" size={30} color="white" />
        </TouchableOpacity>

        {/* Modale pour modification */}
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Edit Consultation</Text>

            {/* Formulaire modifiable */}
            <Text style={styles.label2}>Complain</Text>
              <TextInput
                style={styles.input}
                value={updatedData.complain}
                onChangeText={(text) => handleInputChange("complain", text)}
                placeholder="Enter complain"
              />
              {errors.complain && <Text style={styles.error}>{errors.complain}</Text>}


              <Text style={styles.label2}>Blood Pressure (SYS/DIA)</Text>
              <TextInput
                style={styles.input}
                value={updatedData.blood_pressure}
                onChangeText={(text) => handleInputChange("blood_pressure", text)}
                placeholder="e.g., 80/120"
              />

              <Text style={styles.label2}>Pulse</Text>
              <TextInput
                style={styles.input}
                value={String(updatedData.pulse)}
                onChangeText={(text) => handleInputChange("pulse", text)}
                placeholder="e.g., 72"
                keyboardType="numeric"
              />
              {errors.pulse && <Text style={styles.error}>{errors.pulse}</Text>}


              <Text style={styles.label2}>Temperature (30 - 42)</Text>
              <TextInput
                style={styles.input}
                value={updatedData.temperature}
                onChangeText={(text) => handleInputChange("temperature", text)}
                placeholder="e.g., 37.5"
                keyboardType="numeric"
              />
              {errors.temperature && <Text style={styles.error}>{errors.temperature}</Text>}


              <Text style={styles.label2}>Medical History</Text>
              <TextInput
                style={styles.input}
                value={updatedData.medical_history}
                onChangeText={(text) => handleInputChange("medical_history", text)}
                placeholder="Enter Medical History"
              />

              <Text style={styles.label2}>Surgical History</Text>
              <TextInput
                style={styles.input}
                value={updatedData.surgical_history}
                onChangeText={(text) => handleInputChange("surgical_history", text)}
                placeholder="Enter Surgical history"
              />


            <View style={styles.modalButtons}>
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleUpdate} disabled={loading} />
            </View>
          </View>
        </Modal>

  </ScrollView>

</SafeAreaView>
    </GestureHandlerRootView>
    
  );
};

const ConsultationTabs = ({ route }) => {
  const { consultation } = route.params;

  return (
    <Tab.Navigator initialRouteName="Details">
    <Tab.Screen
      name="Details"
      component={MainDetails}
      initialParams={{ consultation }}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="information-circle" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Lab Result"
      component={LabResultScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="clipboard-list" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Prescriptions"
      component={PrescriptionScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Vaccinations"
      component={VaccinationScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="medical" size={size} color={color} />
        ),
      }}
    />
    
    <Tab.Screen
      name="Allergies"
      component={AllergyScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bug" size={size} color={color} />
        ),
      }}
    />
    
    <Tab.Screen
      name="Feedbacks"
      component={FeedbackScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbox" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
  );
};

export default ConsultationTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    marginTop: 8,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    marginBottom: 10,
    marginTop: 12,
  },
  card: { padding: 20, margin: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  label2: { fontSize: 16, fontWeight: "bold", marginTop: 10, color:"#fff" },
  value: { fontSize: 16, marginBottom: 10 },
  editButton: {
    position: "absolute",
    bottom: 45,
    right: 16,
    backgroundColor: "#3C58C1",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  homeButton: {
    width: 50, // Taille du cercle
    height: 50, // Taille du cercle
    borderRadius: 25, // Moitié de la taille pour un cercle parfait
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop:9,
    marginBottom:8,
    marginLeft:3,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#',
  },
  value: {
    fontSize: 15,
    color: '#3C58C1',
    fontWeight: 'bold',
  },
  galleryHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageGallery: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noPhotoText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 14,
  },
  error: { color: "#f24158", marginBottom: 10 },
});
