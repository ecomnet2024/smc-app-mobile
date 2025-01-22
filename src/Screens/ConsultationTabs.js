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
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import LabResultScreen from './AllDetails/LabresultScreen';


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
        onPress={() => navigation.navigate("Home")} >
        <Ionicons name="home" size={35} color="black" />
      </TouchableOpacity>


        {/* Carte pour afficher les détails */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Patient Information</Text>
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
    color: '#555',
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
});
