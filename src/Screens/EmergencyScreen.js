import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQuery } from '@apollo/client';
import {  CREATE_EMERGENCY } from '../../src/Screens/graphql/Mutation';
import { GET_EMERGENCY ,GET_PATIENT } from '../../src/Screens/graphql/Queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import { Image } from 'react-native';


const EmergencyScreen = () => {


  const [doctorId, setDoctorId] = useState(null);

  const [emergencyData, setEmergencyData] = useState({
    name: '',
    complain: '',
    createdAt: new Date(),
  });


  const navigation = useNavigation();

  const [createEmergency, { loading: createLoading }] = useMutation(CREATE_EMERGENCY);

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

  const handleCallCenter = () => {
    Alert.alert('Feature Unavailable', 'Sorry, this feature is currently unavailable.', [{ text: 'OK', style: 'destructive' }]);
  };

  useEffect(() => {
    getDoctorIdFromToken();
  }, []);

  const { data: emergencyDataResponse, loading: emergencyLoading, error: emergencyError, refetch } = useQuery(GET_EMERGENCY , {
    variables: {
      filter: {
        createdBy: doctorId, // Utilisez l'ID du médecin comme filtre
      },
    },
  });
  // Exécution de la requête avec un filtre

  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Rafraîchir les données à chaque fois que la page est affichée
      console.log('Data refreshed on focus');
    }, [refetch])
  );


  const handleCreateEmergency = async () => {

    if (!emergencyData.name || !emergencyData.complain) {
      Alert.alert('Error', 'Please fill in all fields for the emergency.');
      return;
    }
    const medical_staff_Id = await getDoctorIdFromToken();

    if (!medical_staff_Id) {
      Alert.alert('Error', 'Missing doctor or patient information.');
      return;
    }

    try {
      const result = await createEmergency({
        variables: {
          record: {
            name: emergencyData.name,
            complain: emergencyData.complain,
            createdAt: emergencyData.createdAt,
            createdBy: medical_staff_Id,
          },
        },
      });

      if (result.data?.emergencyCreateOne?.record) {
        Alert.alert('Success', 'Your emergency has been send! Please wait you will receive a feedback as soon as possible');
        setEmergencyData({ name: '', complain: '', createdAt: new Date() });
        refetch();

      } else {
        const errorMsg = result.data?.emergencyCreateOne?.error?.message || 'Failed to create emergency.';
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('Error creating emergency:', error);
      Alert.alert('Error', 'An error occurred while creating the emergency.');
    }
  };


  if (emergencyLoading) return <Text>Loading emergencies...</Text>;
  if (emergencyError) {
    console.error('Error fetching emergencies:', emergencyError);
    return <Text>Failed to load emergencies. Please try again later.</Text>;
  }


  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={40} color="gray" />
        </TouchableOpacity>
        </View>

         {/* Images en arrière-plan */}
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
  <Image
    source={require('../assets/undraw_Software_engineer_re_tnjc.png')}
    style={[StyleSheet.absoluteFillObject, { bottom: 10,top:620, left: 0,right:50, width: 350, height: 140 }]}
  />
   <Image
    source={require('../assets/Vector 1_b.png')}
    style={[StyleSheet.absoluteFillObject, { bottom: 10,top:535, left: 145,right:50, width: 60, height: 60 }]}
  />
   <Image
    source={require('../assets/bottom1.png')}
    style={[StyleSheet.absoluteFillObject, { bottom: 0,top: 600, right: 50, width: 200, height: 200 }]}
  />
   <Image
    source={require('../assets/top1.png')}
    style={[StyleSheet.absoluteFillObject, { bottom: 50, left: 200, width: 300, height: 200 }]}
  />
</View>


<ScrollView>
          <Text style={styles.header}>Describe Your Emergency</Text>
          <TextInput
            placeholder="Name"
            value={emergencyData.name}
            style={styles.input}
            onChangeText={(text) => setEmergencyData({ ...emergencyData, name: text })}
          />
          <TextInput
            placeholder="Complaint"
            value={emergencyData.complain}
            style={styles.input}
            onChangeText={(text) => setEmergencyData({ ...emergencyData, complain: text })}
          />
          <Button title="Submit Emergency" onPress={handleCreateEmergency} disabled={createLoading} />

          <Text style={styles.header}>Existing Emergencies</Text>
          {emergencyDataResponse?.emergencyMany?.map((emergency) => (
            <View key={emergency.createdAt} style={styles.emergencyCard}>
              <Text style={styles.emergencyName}>{emergency.name}</Text>
              <Text style={styles.emergencyDetail}>{emergency.complain}</Text>
              <Text style={styles.emergencyDate}>{new Date(emergency.createdAt).toLocaleDateString()}</Text>
            </View>
          ))}
        </ScrollView>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default EmergencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  backButton: {
    marginBottom: 20,
    marginTop: 11,
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  formHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    color: '#333',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  callbutton: {
    width: 150,
    height: 120,
    backgroundColor: '#008000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal:5 ,
  },
  consultationbutton: {
    width: 150,
    height: 120,
    backgroundColor: '#318CE7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal:5 ,
  },
  text:{
    color:'#fff',
    fontWeight:'semibold',
  },
  backgroundImage: {
    position: 'absolute',
    width: 250,  // Largeur de l'image
    height: 250, // Hauteur de l'image
    zIndex: -2,  // Met les images derrière le contenu
  },
  image1: {
    top: 0,
    left: 8,
  },
  image2: {
    top: 200,
    right: 0,
    width: 300,  // Largeur de l'image
  },
  image3: {
    top: 300,
    right: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  emergencyCard: {
    padding: 15,
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    marginBottom: 10,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  emergencyDetail: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  emergencyDate: {
    fontSize: 12,
    color: '#777',
    textAlign: 'right',
  },
});
