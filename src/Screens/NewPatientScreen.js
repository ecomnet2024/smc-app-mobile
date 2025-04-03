import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert , ActivityIndicator} from 'react-native';
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { useMutation, useQuery } from '@apollo/client';
import { SafeAreaView } from 'react-native-safe-area-context'
import { CREATE_PATIENT } from '../../src/Screens/graphql/Mutation';
import { GET_CLINIC ,GET_PATIENT } from '../../src/Screens/graphql/Queries';
import { UPDATE_STATUS_PATIENT } from '../../src/Screens/graphql/Mutation';
import { useNavigation } from '@react-navigation/native'
import { SelectList } from 'react-native-dropdown-select-list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setLogVerbosity } from '@apollo/client';
import { colors } from '../assets/utils/color';


const CreatePatientForm = () => {

    const navigation = useNavigation();


  const { data: clinicData, loading: clinicLoading, error: clinicError, refetch } = useQuery(GET_CLINIC);
  const { data: patientDataResponse, loading: patientLoading, error: patientError } = useQuery(GET_PATIENT);

  const [updatePatientStatus] = useMutation(UPDATE_STATUS_PATIENT);

  const [selectedPatientId, setSelectedPatientId] = useState(null); // Stocke l'ID du patient sélectionné
  // Stocke l'ID du patient sélectionné

  console.log("All Clinic",clinicData);


  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    clinic:'',
    phone: '',
    status: 'New'
  });
  const [patientCreateOne, {data}] = useMutation(CREATE_PATIENT);

 // Générer les options pour les cliniques
 const clinicOptions =
      clinicData?.clinicMany?.map((clinic) => ({
        key: clinic._id,
        value: clinic.name,
      })) || [];
      console.log('Clinic Options:', clinicOptions);

// Générer les options pour les patients
const patientOptions =
 patientDataResponse?.patientMany?.map(patient => ({
   key: patient._id,
   value: patient.name,
 })) || [];

   // Options pour le champ Gender
   const genderOptions = [
    { key: 'M', value: 'M' },
    { key: 'F', value: 'F' },
  ];

  
  
  const handleSelectSubmit = async () => {

    if (!selectedPatientId) {
      Alert.alert('Error', 'Please select a patient');
      return;
    }
    // Récupérer l'objet complet du patient sélectionné
    const selectedPatient = patientDataResponse.patientMany.find(
      (patient) => patient._id === selectedPatientId
    );
    if (!selectedPatient) {
      Alert.alert('Error', 'Patient not found');
      return;
    }

    try {
      // Mettre à jour le statut du patient sélectionné
      const result = await updatePatientStatus({
        variables: {
          id: selectedPatientId,
          record: { status: 'Returning' },
        },
      });
      console.log('Mutation result:', result);
  
      if (result.data?.patientUpdateById?.record) {
        console.log('Patient status updated successfully:', result.data.patientUpdateById.record.status);
        //Alert.alert('Success', 'Patient status updated to Returning');   // Alert to verify the update of status
      } else {
        console.error('Error updating patient status:', result);
        Alert.alert('Error', 'Failed to update patient status');
      }
  
      // Naviguer vers la page ConsultationScreen avec l'objet patient
      navigation.navigate('NewConsultation', { patient: selectedPatient });
    } catch (error) {
      console.error('Error updating patient status:', error.message, error);
      Alert.alert('Error', 'An error occurred while updating the patient status');
    }
  };



  const sn=" ";
  
  const handleSubmit = async () => {
  //     console.log('handleSubmit triggered'); // Ajoutez ce log
  // alert('handleSubmit triggered'); // Vérifiez aussi avec une alerte
  
    if (
      !patientData.name ||
      !patientData.age ||
      !patientData.gender ||
      !patientData.clinic
    ) {
      // Gestion des erreurs si un champ est vide
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('Sending mutation with data:', patientData);
      const result = await patientCreateOne({
        variables: {
          record: {
            name: patientData.name,
            age: parseFloat(patientData.age),
            gender: patientData.gender,
            clinic: patientData.clinic,          //"676418c44715a630db6272a4",
            email: patientData.email,     //il y a une erreur sur email, ca doit etre null et identique
            phone: patientData.phone,
            status: patientData.status,
            sn : sn
          },
        },
      });
      console.log('Données envoyées pour création du patient :',
        "name:" ,patientData.name,
        "age:"  ,parseFloat(patientData.age),
        "gender:" ,patientData.gender,
        "clinic:", patientData.clinic,
        "email:" ,patientData.email,
        "phone:" ,patientData.phone,
        "status:" ,patientData.status,
    );

      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      console.log("PatientData",result);
      if (result.data && result.data.patientCreateOne && result.data.patientCreateOne.record) {
        const patient = result.data.patientCreateOne.record;
        console.log('Patient ID:', patient);
        console.log("datamutation",data);
  
        // Redirection vers la page consultation en passant l'ID du patient
      navigation.navigate('NewConsultation', { patient: patient ,
      patientData: result.data.patientCreateOne.record,});
    } else {
        console.error('Erreur: la mutation n’a pas renvoyé de patient.');
      }
    } catch (error) {
      //console.error('Error creating patient:', error);
      console.error('Erreur Apollo :', error.networkError || error.graphQLErrors);
      console.log('Données envoyées pour création du patient :', patientData);
      console.log('Résultat complet de la mutation:', JSON.stringify(result, null, 2));
      console.log("PatientData",result);
    }
  };

  if (clinicLoading || patientLoading) {
    return <SafeAreaView style={styles.container}>
    <ActivityIndicator size="large" color="#3C58C1" />
    </SafeAreaView>;
  }
  if (clinicError || patientError) {
    console.error('Error fetching data:', clinicError || patientError);
    return <SafeAreaView style={styles.container}>
     <Text>Failed to load data. Please try again later.</Text>;
     </SafeAreaView>
  }

  setLogVerbosity('debug');


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

      {/* Formulaire stylisé dans un bloc */}
      <View style={styles.formContainer}>

      <View>
     {/* Sélection d'un patient existant */}
     <Text style={styles.label}>Select an existing patient</Text>
          <SelectList
            setSelected={(value) => setSelectedPatientId(value)}
            data={patientOptions}
            placeholder="Choose patient created"
            boxStyles={styles.dropdown}
            dropdownStyles={styles.dropdownList}
          />
      <Button
        title="Submit existing patient"
        onPress={handleSelectSubmit}
        disabled={!selectedPatientId}
      />
    </View>

         {/* Patient Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Patient information</Text>
        <Text style={styles.legend}>
             <Text style={styles.required}>*</Text> Indicate an obligatory field.
        </Text>

        <Text style={styles.label}>Name
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={patientData.name}
          onChangeText={(value) => setPatientData({ ...patientData, name: value })}
        />

        <Text style={styles.label}>Age
        <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={patientData.age}
          onChangeText={(value) => setPatientData({ ...patientData, age: parseFloat(value) })}
        />

        <Text style={styles.label}>Gender
        <Text style={styles.required}>*</Text></Text>
        <SelectList
          setSelected={(val) => setPatientData({ ...patientData, gender: val })}
          data={genderOptions}
          placeholder="Select Gender"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
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

         <Text style={styles.label}>Clinic
         <Text style={styles.required}>*</Text></Text>
       <SelectList
         setSelected={(val) => setPatientData({ ...patientData, clinic: val })}
         data={clinicOptions}
         placeholder="Select Clinic"
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
        paddingHorizontal: 13,
        backgroundColor: '#fff',
      },
  container:{
    flex: 1,
    marginTop: 9,
    marginHorizontal: 10,
  },
  image: {
    width: '60%',
    height: 151, // Taille de l'image en haut
    resizeMode: 'cover', // Adapter l'image
    alignSelf: 'center',
    marginTop:-8,
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
