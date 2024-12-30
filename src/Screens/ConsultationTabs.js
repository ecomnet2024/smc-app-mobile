import React , { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput, FlatList, SafeAreaView } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import VaccinationScreen from '../../src/Screens/AllDetails/VaccinationScreen';
import PrescriptionScreen from '../../src/Screens/AllDetails/PrescriptionScreen';
import AllergyScreen from '../../src/Screens/AllDetails/AllergyScreen';
import MedicationScreen from '../../src/Screens/AllDetails/MedicationScreen';
import FeedbackScreen from '../../src/Screens/AllDetails/FeedbackScreen';
import Ionicons from '@expo/vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

// Page principale avec les détails de la consultation
const MainDetails = ({ route }) => {
  const { consultation } = route.params;
  console.log(consultation.photo_material);

  const navigation = useNavigation();

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>

       <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} >
        <Ionicons name="chevron-back-circle" size={38} color="gray" />
      </TouchableOpacity>

      <Text style={styles.title}>Consultation Details</Text>
      <Text style={{ fontSize: 17 }}>Age : <Text style={styles.value}> {consultation.patient.age}</Text></Text>
      <Text style={{ fontSize: 17 }}>Gender : <Text style={styles.value}> {consultation.patient.gender}</Text></Text>
      <Text style={{ fontSize: 17 }}>Complain : <Text style={styles.value}> {consultation.complain}</Text></Text>
      <Text style={{ fontSize: 17 }}>Blood Pressure :<Text style={styles.value}> {consultation.blood_pressure}</Text></Text>
      <Text style={{ fontSize: 17 }}>Pulse :<Text style={styles.value}> {consultation.pulse}</Text></Text>
      <Text style={{ fontSize: 17 }}>Temperature :<Text style={styles.value}> {consultation.temperature}</Text></Text>

      <Text style={{ fontSize: 17 }}>Surgical history :<Text style={styles.value}> {consultation.surgical_history}</Text></Text>
      <Text style={{ fontSize: 17 }}>Created at : <Text style={styles.value}>  {new Date(consultation.createdAt).toISOString().split("T")[0]}</Text></Text>
      <Text style={{ fontSize: 17 }}>Status : <Text style={styles.value}> {consultation.status}</Text></Text>

      <ScrollView>
  {consultation.photo_material && consultation.photo_material.length > 0 ? (
    consultation.photo_material.map((uri, index) => (
      <Image 
        key={index} 
        source={{ uri }} 
        style={styles.imagePreview} 
        onError={(e) => console.log(`Error loading image: ${uri}`, e.nativeEvent.error)} // Pour déboguer
      />
    ))
  ) : (
    <Text style={styles.noPhotoText}>No photos available</Text>
  )}
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
      name="Medications"
      component={MedicationScreen}
      initialParams={{ consultation }}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="flask" size={size} color={color} />
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
    justifyContent: 'space-evenly',
    padding:15,
    marginTop: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 13,
    marginTop:6,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    resizeMode: 'cover',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontWeight: 'normal',
    fontSize: 18,
    color: '#3C58C1',
},
  imagePreview: { width: '200', height: 200, marginBottom: 15 ,
  borderWidth: 1, // Bordure pour voir si l'image est rendue
  borderColor: 'pink',
  alignSelf:'center', marginTop:18,
},
  noPhotoText: { color: '#999', marginBottom: 20, fontStyle: 'italic' },
});
