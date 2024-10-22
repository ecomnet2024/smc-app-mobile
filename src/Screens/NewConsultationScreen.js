import { StyleSheet, Text, View , ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import { useState, useMemo } from 'react'
import { Image } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list';
import { useMutation } from '@apollo/client';
import { CREATE_CONSULTATION, CREATE_PRESCRIPTION, CREATE_PATIENT } from '../Screens/graphql/Mutation';


const NewConsultationScreen = () => {


  const navigation = useNavigation();

  const [consultationData, setConsultationData] = useState({
    blood_pressure: '',
    complain: '',
    pulse: '',
    temperature: '',
  });
  // État pour les données du patient
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    status: '',
  });
  // État pour les données de la prescription
  const [prescriptionData, setPrescriptionData] = useState({
    medication: '',
    dosage: '',
    start_date: '',
    end_date: '',
    contraindications: '',
  });

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

  /*let value = {
    name: patientData.name,
    age: patientData.age,
    gender:patientData.gender,
    location: patientData.location,
    status: patientData.status,
    medication: prescriptionData.medication,
    dosage: prescriptionData.dosage,
    start_date: prescriptionData.start_date,
    end_date: prescriptionData.end_date,
    contraindications: prescriptionData.contraindications,
    blood_pressure: consultationData.blood_pressure,
    complain: consultationData.complain,
    pulse: consultationData.pulse,
    temperature: consultationData.temperature,
  }*/

  // Mutations GraphQL
  const [createPatient] = useMutation(CREATE_PATIENT);
  const [createConsultation] = useMutation(CREATE_CONSULTATION);
  const [createPrescription] = useMutation(CREATE_PRESCRIPTION);

  const handleSubmit = async () => {
     // Logs pour vérifier les données du formulaire
     console.log('Consultation Data:', consultationData);
     console.log('Patient Data:', patientData);
     console.log('Prescription Data:', prescriptionData);

    try {

      // Créer le patient
      const patientResult = await createPatient({
        variables: {
          record: {
            name: patientData.name,
            age: parseFloat(patientData.age),
            gender: patientData.gender,
            location: patientData.location,
            status: patientData.status,
          },
        },
      });
      const patientId = patientResult.data.patientCreateOne.record._id;

      // Log avant d'envoyer la mutation de consultation
  console.log('Sending consultation mutation...');

  // Créer la prescription
  const prescriptionResult = await createPrescription({
    variables: {
      record: {
        medication: prescriptionData.medication,
        dosage: prescriptionData.dosage,
        start_date: prescriptionData.start_date,
        end_date: prescriptionData.end_date,
        Contraindications: prescriptionData.contraindications,
      },
    },
  });

  const prescriptionId = prescriptionResult.data.prescriptionCreateOne.record._id;

     // Créer la consultation
 await createConsultation({
  variables: {
    record: {
      blood_pressure: consultationData.blood_pressure,
      complain: consultationData.complain,
      pulse: parseFloat(consultationData.pulse),
      temperature: parseFloat(consultationData.temperature),
      patient: patientId,
      prescriptions: [prescriptionId],
      status: patientData.status, // Même statut pour la consultation
    },
  },
});
console.log('Consultation, Patient, and Prescription created successfully');
} catch (error) {
console.error('Error creating consultation or prescription:', error);
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
      </View>

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

        <Text style={styles.label}>Status</Text>
        <SelectList
          setSelected={(val) => setPatientData({ ...patientData, status: val })}
          data={statusOptions}
          placeholder="Select Status"
          boxStyles={styles.dropdown}
          dropdownStyles={styles.dropdownList}
        />
      </View>

      {/* Prescription Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Prescription</Text>

        <Text style={styles.label}>Medication</Text>
        <TextInput
          style={styles.input}
          value={prescriptionData.medication}
          onChangeText={(value) => setPrescriptionData({ ...prescriptionData, medication: value })}
        />

        <Text style={styles.label}>Dosage</Text>
        <TextInput
          style={styles.input}
          value={prescriptionData.dosage}
          onChangeText={(value) => setPrescriptionData({ ...prescriptionData, dosage: value })}
        />

        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          value={prescriptionData.start_date}
          onChangeText={(value) => setPrescriptionData({ ...prescriptionData, start_date: value })}
        />

        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          value={prescriptionData.end_date}
          onChangeText={(value) => setPrescriptionData({ ...prescriptionData, end_date: value })}
        />

        <Text style={styles.label}>Contraindications</Text>
        <TextInput
          style={styles.textArea}
          value={prescriptionData.contraindications}
          multiline
          numberOfLines={4}
          onChangeText={(value) => setPrescriptionData({ ...prescriptionData, contraindications: value })}
        />
        <TouchableOpacity style= {styles.signInButton} onPress={handleSubmit} >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        </View>

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

})