import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Alert } from 'react-native';
import { CREATE_ALLERGY, REMOVE_ALLERGY } from '../../../src/Screens/graphql/Mutation';
import { GET_ALLERGY } from '../../../src/Screens/graphql/Queries';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/utils/color';

const AllergyScreen = ({ route }) => {

  const { consultation } = route.params;
  console.log('id de la consultation',consultation._id);
  const navigation = useNavigation();

  const consultationID = consultation._id;
  const patientId = consultation?.patient?._id;

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
  const [newAllergy, setNewAllergy] = useState({
    substance: '',
    description: '',
  });
  
  // Apollo Queries and Mutations
  const { data, loading, error, refetch } = useQuery(GET_ALLERGY, {
    variables: { filter: { consultation: consultationID } },
  });
  console.log('Data from GET_ALLERGY:', data);

  const [createAllergy, { loading: mutationLoading }] = useMutation(
    CREATE_ALLERGY,
    {
      onCompleted: (data) => {
        console.log("Mutation Response:", data);
        setModalVisible(false);
        Alert.alert('Success', 'Allergy added successfully!');
        refetch();
      },
      onError: (error) => {
        console.error("Mutation Error:", error.message);
        Alert.alert('Error', error.message);
      },
    }
  );

  const [removeAllergy] = useMutation(REMOVE_ALLERGY, {
    onCompleted: () => {
      Alert.alert('Success', 'Allergy removed successfully!');
      refetch(); // Rafraîchir la liste après suppression
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });
  

  const handleAddAllergy = async () => {
    if (!newAllergy.substance.trim() || !newAllergy.description.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!consultation) {
      Alert.alert('Validation Error', 'no Id');
      return;
    }
    const medical_staff_Id = await getDoctorIdFromToken();

    if (!medical_staff_Id) {
      Alert.alert('Validation Error', 'no medical staff Id');
      return;
    }
    if (!patientId) {
      Alert.alert('Validation Error', 'no patient Id');
      return;
    }

    try {
      await createAllergy({
        variables: {
          record: {
            ...newAllergy,
            patient: patientId,
            consultation: consultationID,
            medical_staff: medical_staff_Id,
            createdBy: medical_staff_Id,
          },
        },
      });
      setNewAllergy((prevState) => ({
        ...prevState,
        substance: '',
        description: '',
      }));
    } catch (err) {
      Alert.alert('Error', err.message);
      Alert.alert('Error', 'Failed to add allergy.');
    }
  };

  const handleDeleteAllergy = (id) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this allergy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeAllergy({ variables: { id } });
          },
        },
      ],
    );
  };
  

  const renderAllergyCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.substance}</Text>
        <TouchableOpacity onPress={() => handleDeleteAllergy(item._id)}>
          <Icon name="trash-can" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>Description: {item.description}</Text>
      <Text style={styles.cardText}>Created At: {new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );


  if (loading) {
    return <SafeAreaView style={styles.container}>
    <ActivityIndicator size="large" color="#3C58C1" />
   </SafeAreaView>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("HomeTabs")}
      >
      <Ionicons name="home" size={30} color="black" />
     </TouchableOpacity>

      {/* Display allergies or no data message */}
      {data?.allergyMany?.length > 0 ? (
        <FlatList
          data={data.allergyMany}
          keyExtractor={(item) => item._id}
          renderItem={renderAllergyCard}
        />
      ) : (
        <Text style={styles.noDataText}>No allergies found</Text>
      )}

       {/* Button to add allergy */}
       <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      ><Text style={styles.addButtonText}>Add Allergy</Text>
      </TouchableOpacity>

      {/* Modal for adding allergy */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Allergy</Text>
          <TextInput
            style={styles.input}
            placeholder="Substance"
            value={newAllergy.substance}
            onChangeText={(text) =>
              setNewAllergy({ ...newAllergy, substance: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newAllergy.description}
            onChangeText={(text) =>
              setNewAllergy({ ...newAllergy, description: text })
            }
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddAllergy}
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

export default AllergyScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
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
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom:5,
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
});