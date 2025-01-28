import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert } from 'react-native';
import { CREATE_PRESCRIPTION, REMOVE_PRESCRIPTION } from '../../../src/Screens/graphql/Mutation';
import { GET_PRESCRIPTION } from '../../../src/Screens/graphql/Queries';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PrescriptionScreen = ({ route }) => {

  const { consultation } = route.params;
  console.log('id de la consultation',consultation._id);

  const consultationID = consultation._id;

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

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    start_date: new Date(),
    end_date: new Date(),
    contraindications: '',
    medication: '',
    dosage: '',

  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
const [showEndDatePicker, setShowEndDatePicker] = useState(false);


  const onStartDateChange = (event, selectedDate) => {
    if (selectedDate) { // Vérifiez que la date sélectionnée n'est pas nulle
      setNewPrescription((prevState) => ({
        ...prevState,
        start_date: selectedDate,
      }));
    }
    setShowStartDatePicker(false);
  };
  const onEndDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setNewPrescription((prevState) => ({
        ...prevState,
        end_date: selectedDate,
      }));
    }
    setShowEndDatePicker(false);
  };


  const [date, setDate] = useState(new Date());
  
  
  // Apollo Queries and Mutations
  // Requête Apollo avec filtre
  const { data, loading, error, refetch } = useQuery(GET_PRESCRIPTION, {
    variables: { filter: { consultation: consultationID } },
  });

  console.log('Data from GET_Prescrition:', data);


  const [createPrescription, { loading: mutationLoading }] = useMutation(CREATE_PRESCRIPTION, {
    onCompleted: () => {
      setModalVisible(false);
      Alert.alert('Success', 'Prescription added successfully!');
      refetch();
    },
    onError: (error) => {
      console.error('Mutation Error:', error.message);
    },
  });

  const [removePrescription] = useMutation(REMOVE_PRESCRIPTION, {
    onCompleted: () => {
      Alert.alert('Success', 'Prescription removed successfully!');
      refetch();
    },
    onError: (error) => Alert.alert('Error', error.message),
  });


  const handleAddPrescription = async () => {
   
    if (!consultationID) {
      Alert.alert('Validation Error', 'no Id');
      return;
    }
    const medical_staff_Id = await getDoctorIdFromToken();
    const patientId = consultation.patient._id;

    if (!medical_staff_Id) {
      Alert.alert('Validation Error', 'no medical staff Id');
      return;
    }
    if (!patientId) {
      Alert.alert('Validation Error', 'no patient Id');
      return;
    }

    try {
      await createPrescription({
        variables: {
          record: {
            ...newPrescription,
            consultation: consultationID,
            patient: patientId,
            createdBy: medical_staff_Id,
          },
        },
      });
      setNewPrescription((prevState) => ({
        ...prevState,
        contraindications: '',
        medication: '',
        dosage: '',
      }));
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };


  const handleDeletePrescription = (id) => {
    Alert.alert('Confirmation', 'Are you sure you want to delete this prescription?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removePrescription({ variables: { id } }) },
    ]);
  };

  const renderPrescriptionCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Medication: {item.medication || 'N/A'}</Text>
        <TouchableOpacity onPress={() => handleDeletePrescription(item._id)}>
        <Icon name="trash-can" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>Dosage: {item.dosage || 'N/A'}</Text>
      <Text style={styles.cardText}>
         Start Date: {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.cardText}>
         End Date: {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.cardText}>Contraindications: {item.contraindications || 'N/A'}</Text>
    </View>
  );


  const prescriptions = data?.prescriptionMany || [];


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("HomeTabs")}
      >
      <Ionicons name="home" size={30} color="black" />
     </TouchableOpacity>

       {prescriptions.length > 0 ? (
        <FlatList
          data={prescriptions}
          keyExtractor={(item) => item._id}
          renderItem={renderPrescriptionCard}
        />
      ) : (
        <Text style={styles.noDataText}>No prescriptions yet</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      ><Text style={styles.addButtonText}>Add Prescription</Text>
      </TouchableOpacity>

      {/* Modal for Adding Medication */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Prescription</Text>

          <TextInput
            style={styles.input}
            placeholder="Medication"
            value={newPrescription.medication}
            onChangeText={(text) =>
              setNewPrescription({ ...newPrescription, medication: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Contraindications"
            value={newPrescription.contraindications}
            onChangeText={(text) =>
              setNewPrescription({ ...newPrescription, contraindications: text })
            }
          />
         
          <TextInput
            style={styles.input}
            placeholder="Dosage"
            value={newPrescription.dosage}
            onChangeText={(text) =>
              setNewPrescription({ ...newPrescription, dosage: text })
            }
          />

           <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
         <Text>
           Start Date: {newPrescription.start_date.toLocaleDateString()}
         </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
  <DateTimePicker
    value={newPrescription.start_date || new Date()}
    mode="date"
    display="default"
    onChange={onStartDateChange}
  />
)}
           <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
         <Text>
            End Date: {newPrescription.end_date.toLocaleDateString()}
         </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
  <DateTimePicker
    value={newPrescription.end_date || new Date()}
    mode="date"
    display="default"
    onChange={onEndDateChange}
  />
)}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddPrescription}
            disabled={mutationLoading}
          >
            <Text style={styles.submitButtonText}>
              {mutationLoading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.submitButtonText}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
}

export default PrescriptionScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#3C58C1',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  homeButton: {
    width: 50, // Taille du cercle
    height: 50, // Taille du cercle
    borderRadius: 25, // Moitié de la taille pour un cercle parfait
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom:12,
    marginLeft:3,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFF',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4169E1', //bleu royal
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedMedication: {
    backgroundColor: '#e0f7fa',
  },
  medicationOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  medicationName: {
    fontWeight: 'bold',
  },
  medicationDescription: {
    fontSize: 12,
    color: '#555',
  },
  cancelButton:{
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#ddd',
    marginBottom: 10,
    borderRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})