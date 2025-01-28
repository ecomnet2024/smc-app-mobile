import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { CREATE_VACCINATION, REMOVE_VACCINATION } from '../../../src/Screens/graphql/Mutation';
import { GET_VACCINATION } from '../../../src/Screens/graphql/Queries';
import {jwtDecode} from 'jwt-decode';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';


const VaccinationScreen = ({ route }) => {

  const { consultation } = route.params;
  const navigation = useNavigation();
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
  

  // States
  const [isModalVisible, setModalVisible] = useState(false);
  const [vaccine, setVaccine] = useState('');
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  
  // Apollo Queries and Mutations

  const [createVaccination, { loading: mutationLoading }] = useMutation(CREATE_VACCINATION);
  const { data, loading, error, refetch } = useQuery(GET_VACCINATION, {
    variables: {
      filter: {
        consultation: consultationID,
      },
    },
  });
  console.log("VACCINATION DATA: ", data);

  const [removeVaccination] = useMutation(REMOVE_VACCINATION, {
    onCompleted: () => {
      Alert.alert('Success', 'Vaccination removed successfully!');
      refetch();
    },
    onError: (error) => Alert.alert('Error', error.message),
  });



  const handleAddVaccination = async () => {
    if (!vaccine || !date) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    if (!consultationID) {
      Alert.alert('Validation Error', 'no Id');
      return;
    }
    const medical_staff_Id = await getDoctorIdFromToken();
    const patientId = consultation.patient?._id;

    if (!medical_staff_Id) {
      Alert.alert('Validation Error', 'no medical staff Id');
      return;
    }
    if (!patientId) {
      Alert.alert('Validation Error', 'no patient Id');
      return;
    }

    try {
      await createVaccination({
        variables: {
          record: {
            vaccine,
            date,
            consultation: consultationID,
            medical_staff: medical_staff_Id,
            patient: patientId,
            createdBy: medical_staff_Id,
          },
        },
      });
      setModalVisible(false); // Close modal
      setVaccine('');
      setDate('');
      refetch(); // Refresh vaccination data
      Alert.alert('Success', 'Vaccination added successfully!');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDeleteVaccination = (id) => {
    if (!id) {
      Alert.alert('Error', 'Invalid Vaccination ID.');
      return;
    }
    Alert.alert('Confirmation', 'Are you sure you want to delete this vaccination?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeVaccination({ variables: { id } })
            .then(() => {
              Alert.alert('Success', 'Vaccination removed successfully!');
              refetch();
            })
            .catch((error) => {
              Alert.alert('Error', error.message);
            });
        },
      },
    ]);
  };
  


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("HomeTabs")}
      >
      <Ionicons name="home" size={30} color="black" />
     </TouchableOpacity>

      {/* Vaccination List */}
      {loading ? (
        <SafeAreaView style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
         <ActivityIndicator size="large" color="#3C58C1" />
        </SafeAreaView>
      ) : error ? (
        <Text style={styles.errorText}>Error fetching data</Text>
      ) : data?.vaccinationMany?.length === 0 ? (
        <Text style={styles.noDataText}>No vaccination yet</Text>
      ) : (
        <FlatList
          data={data?.vaccinationMany}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.vaccinationItem}>
              <Text style={styles.vaccinationText}>Vaccine: {item.vaccine}</Text>
              <Text style={styles.vaccinationText}>Date: {new Date(item.date).toISOString().split("T")[0]}</Text>
              <View style={styles.trashButton}>
              <TouchableOpacity onPress={() => handleDeleteVaccination(item._id)}>
              <Icon name="trash-can" size={24} color="red" />
              </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Add Vaccination Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Vaccination</Text>
      </TouchableOpacity>

      {/* Add Vaccination Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Vaccination</Text>
            <TextInput
              style={styles.input}
              placeholder="Vaccine Name"
              value={vaccine}
              onChangeText={setVaccine}
            />

            <TouchableOpacity
       style={styles.input}
        onPress={() => setShowDatePicker(true)}
              >
          <Text>{date ? new Date(date).toLocaleDateString() : 'Select Date'}</Text>
         </TouchableOpacity>
       {showDatePicker && (
        <DateTimePicker
            value={date ? new Date(date) : new Date()}
                mode="date"
              display="default"
              onChange={(event, selectedDate) => {
      setShowDatePicker(false); // Ferme le picker
      if (selectedDate) {
        setDate(selectedDate.toISOString().split('T')[0]); // Met à jour la date au format YYYY-MM-DD
      }
    }}
  />
)}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddVaccination}
                disabled={mutationLoading}
              >
                <Text style={styles.submitButtonText}>
                  {mutationLoading ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
}

export default VaccinationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#3C58C1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  vaccinationItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  vaccinationText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center', // Centrer le texte
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#3C58C1',
  },
  cancelButtonText: {
    color: '#333',
  },
  submitButtonText: {
    color: '#fff',
  },
  trashButton:{
    marginTop:5,
    marginLeft:240,
  }
})