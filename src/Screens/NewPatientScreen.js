import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { useMutation } from '@apollo/client';
import { CREATE_PATIENT } from '../Screens/graphql/Mutation';
import { useNavigation } from '@react-navigation/native'
import { SelectList } from 'react-native-dropdown-select-list';
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';


const CreatePatientForm = () => {

    const navigation = useNavigation();

  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    email: '',
    phone: '',
   // insurance_number: '',
    status: '',
  });
  const [createPatient] = useMutation(CREATE_PATIENT);

   // Options pour le champ Gender
   const genderOptions = [
    { key: 'M', value: 'M' },
    { key: 'F', value: 'F' },
  ];

  // Options pour le champ Status
  const statusOptions = [
    { key: 'New', value: 'New' },
    { key: 'Returning', value: 'Returning' },
  ];



  const handleSubmit = async () => {
    if (
      !patientData.name ||
      !patientData.age ||
      !patientData.gender ||
      !patientData.location ||
      !patientData.status
    ) {
      // Gestion des erreurs si un champ est vide
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await createPatient({
        variables: {
          record: {
            name: patientData.name,
            age: parseFloat(patientData.age),
            gender: patientData.gender,
            location: patientData.location,
            email: patientData.email,
            phone: patientData.phone,
           // insurance_number: patientData.insurance_number,
            status: patientData.status,
          },
        },
      });
      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      console.log("PatientData",result);
      if (result.data && result.data.patientCreateOne && result.data.patientCreateOne.record) {
        const patientId = result.data.patientCreateOne.record._id;
        console.log('Patient ID:', patientId);
  
        // Redirection vers la page consultation en passant l'ID du patient
      navigation.navigate('NewConsultation', { patientId: patientId ,
      patientData: result.data.patientCreateOne.record,});
    } else {
        console.error('Erreur: la mutation n’a pas renvoyé de patient.');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
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

      {/* Formulaire stylisé dans un bloc */}
      <View style={styles.formContainer}>

         {/* Patient Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Patient information</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={patientData.name}
          onChangeText={(value) => setPatientData({ ...patientData, name: value })}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={patientData.age}
          onChangeText={(value) => setPatientData({ ...patientData, age: parseFloat(value) })}
        />

        <Text style={styles.label}>Gender</Text>
        <SelectList
          setSelected={(val) => setPatientData({ ...patientData, gender: val })}
          data={genderOptions}
          placeholder="Select Gender"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={patientData.location}
          onChangeText={(value) => setPatientData({ ...patientData, location: value })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={patientData.email}
          onChangeText={(value) => setPatientData({ ...patientData, email: value })}
        />

         <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={patientData.phone}
          onChangeText={(text) => setPatientData({ ...patientData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Status</Text>
        <SelectList
          setSelected={(val) => setPatientData({ ...patientData, status: val })}
          data={statusOptions}
          placeholder="Select Status"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
        />

        <TouchableOpacity style= {styles.signInButton} onPress={handleSubmit} >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        
        </View>

    </View>
    </ScrollView>
    </SafeAreaView>
    </GestureHandlerRootView>
         
  );
};


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
    width: '95%',
    height: 190, // Taille de l'image en haut
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
});

export default CreatePatientForm;
