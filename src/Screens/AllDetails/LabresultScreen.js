import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_LAB_RESULT, REMOVE_LAB_RESULT } from '../../../src/Screens/graphql/Mutation';
import { GET_LAB_RESULT } from '../../../src/Screens/graphql/Queries';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const LabResultScreen = ({ route }) => {
  const { consultation } = route.params;

  const consultationID = consultation._id;

  const navigation = useNavigation();

  const getDoctorIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwtDecode(String(token));
        return decodedToken.user_id;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newLabResult, setNewLabResult] = useState({
    date: '',
    result: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_LAB_RESULT, {
    variables: { filter: { consultation: consultationID } },
  });

  const [createLabResult, { loading: mutationLoading }] = useMutation(
    CREATE_LAB_RESULT,
    {
      onCompleted: () => {
        setModalVisible(false);
        Alert.alert('Success', 'Lab result added successfully!');
        refetch();
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    }
  );

  const handleAddLabResult = async () => {
    const medical_staff_Id = await getDoctorIdFromToken();
    const patientId = consultation.patient._id;

    if (!newLabResult.date || !newLabResult.result) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      await createLabResult({
        variables: {
          record: {
            ...newLabResult,
            consultation: consultationID,
            createdBy: medical_staff_Id,
            patient: patientId,
            medical_staff: medical_staff_Id,
          },
        },
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderLabResultCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Result: {item.result}</Text>
      </View>
      <Text style={styles.cardText}>Date: {item.date || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const labResults = data?.labResultMany || [];

  return (

    
    <View style={styles.container}>

<TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")} >
        <Ionicons name="chevron-back-circle" size={40} color="gray" />
      </TouchableOpacity>

      {labResults.length > 0 ? (
        <FlatList
          data={labResults}
          keyExtractor={(item) => item._id}
          renderItem={renderLabResultCard}
        />
      ) : (
        <Text style={styles.noDataText}>No lab results yet</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Lab Result</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Lab Result</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {newLabResult.date
                ? new Date(newLabResult.date).toLocaleDateString()
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={newLabResult.date ? new Date(newLabResult.date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setNewLabResult({
                    ...newLabResult,
                    date: selectedDate.toISOString().split('T')[0],
                  });
                }
              }}
            />
          )}

          <TextInput
            style={styles.textArea}
            placeholder="Result"
            value={newLabResult.result}
            multiline
            numberOfLines={6}
            onChangeText={(text) =>
              setNewLabResult({ ...newLabResult, result: text })
            }
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddLabResult}
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
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default LabResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  addButton: {
    backgroundColor: '#3C58C1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 17,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardText: {
    color: '#555',
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#aaa',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
  },
  cancelButtonText: {
    color: '#fff',
  },
  textArea: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 25,
    marginBottom: 14,
    backgroundColor: '#f9f9f9',
  },
});
