import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_MEDICATION, REMOVE_MEDICATION } from '../../../src/Screens/graphql/Mutation';
import { GET_MEDICATION } from '../../../src/Screens/graphql/Queries';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const MedicationScreen = ({ route }) => {

  const { consultation } = route.params;
  console.log('id de la consultation',consultation._id);

  const consultationID = consultation._id;

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

  const navigation = useNavigation();

  // States
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    description: '',
    dosage: '',
    start_date: '',
    end_date: '',
  });
  
  const handlepress = () => {
    navigation.navigate('Labresult'); // Remplace "TargetPage" par le nom de la page cible
  };
  
  // Apollo Queries and Mutations
  // Requête Apollo avec filtre
  const { data, loading, error, refetch } = useQuery(GET_MEDICATION, {
    variables: { filter: { consultation: consultationID } },
  });
  console.log('Data from GET_ALLERGY:', data);


  const [createMedication, { loading: mutationLoading }] = useMutation(
    CREATE_MEDICATION,
    {
      onCompleted: (data) => {
        console.log("Mutation Response:", data);
        setModalVisible(false);
        Alert.alert('Success', 'Medication added successfully!');
        refetch().then(({ data }) => {
          console.log("Updated Data After Refetch:", data.medicationMany);
        });
      },
      onError: (error) => {
        console.error("Mutation Error:", error.message);
      },
    }
  );

  const [removeMedication] = useMutation(REMOVE_MEDICATION, {
    onCompleted: () => {
      Alert.alert('Success', 'Medication removed successfully!');
      refetch(); // Rafraîchit la liste après suppression
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });
  

  const handleAddMedication = async () => {
   
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
      await createMedication({
        variables: {
          record: {
            ...newMedication,
            consultation: consultationID,
            patient: patientId,
            createdBy: medical_staff_Id,
          },
        },
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDeleteMedication = (id) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeMedication({ variables: { id } });
          },
        },
      ],
    );
  };

  const renderMedicationCard = ({ item }) => (
    <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleDeleteMedication(item._id)}>
        <Icon name="trash-can" size={24} color="red" />
      </TouchableOpacity>
    </View>
    <Text style={styles.cardText}>Description: {item.description || 'N/A'}</Text>
    <Text style={styles.cardText}>Dosage: {item.dosage || 'N/A'}</Text>
    <Text style={styles.cardText}>Start Date: {item.start_date || 'N/A'}</Text>
    <Text style={styles.cardText}>End Date: {item.end_date || 'N/A'}</Text>
  </View>
  );
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  
  const medications = data?.medicationMany || [];



  return (
    <View style={styles.container}>

       {medications.length > 0 ? (
        <FlatList
          data={medications}
          keyExtractor={(item) => item._id}
          renderItem={renderMedicationCard}
        />
      ) : (
        <Text style={styles.noDataText}>No medication yet</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      ><Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>

      {/* Modal for Adding Medication */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Medication</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newMedication.name}
            onChangeText={(text) =>
              setNewMedication({ ...newMedication, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newMedication.description}
            onChangeText={(text) =>
              setNewMedication({ ...newMedication, description: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Dosage"
            value={newMedication.dosage}
            onChangeText={(text) =>
              setNewMedication({ ...newMedication, dosage: text })
            }
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={newMedication.start_date}
            onChangeText={(text) =>
              setNewMedication({ ...newMedication, start_date: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={newMedication.end_date}
            onChangeText={(text) =>
              setNewMedication({ ...newMedication, end_date: text })
            }
          /> */}

         <TouchableOpacity
                style={styles.input}
                onPress={() => setShowStartDatePicker(true)}
          >
       <Text>{newMedication.start_date ? new Date(newMedication.start_date).toLocaleDateString() : 'Select Start Date'}</Text>
                     </TouchableOpacity>
                   {showStartDatePicker && (
            <DateTimePicker
                 value={newMedication.start_date ? new Date(newMedication.start_date) : new Date()}
            mode="date"
            display="default"
             onChange={(event, selectedDate) => {
               setShowStartDatePicker(false); // Ferme le picker
               if (selectedDate) {
               setNewMedication({
                  ...newMedication,
                   start_date: selectedDate.toISOString().split('T')[0], // Formate la date en YYYY-MM-DD
                });
                }
              }}
           />
          )}
           
           <TouchableOpacity
            style={styles.input}
             onPress={() => setShowEndDatePicker(true)}
               >
             <Text>{newMedication.end_date ? new Date(newMedication.end_date).toLocaleDateString() : 'Select End Date'}</Text>
          </TouchableOpacity>
              {showEndDatePicker && (
               <DateTimePicker
               value={newMedication.end_date ? new Date(newMedication.end_date) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false); // Ferme le picker
                   if (selectedDate) {
                 setNewMedication({
                       ...newMedication,
                         end_date: selectedDate.toISOString().split('T')[0], // Formate la date en YYYY-MM-DD
                       });
                   }
                 }}
               />
            )}



          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddMedication}
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

export default MedicationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#3C58C1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
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
    fontSize: 18,
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
    padding: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFF',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center', // Centrer le texte
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton:{
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
})