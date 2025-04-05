import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import React from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { REMOVE_CONSULTATION } from '../../src/Screens/graphql/Mutation';
import { GET_CONSULTATION_BY_PATIENT } from '../../src/Screens/graphql/Queries';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../assets/utils/color'


const ConsultationDetails = ({ route }) => {

  const navigation = useNavigation();

   // Récupérer la consultation passée en paramètre
   const { consultation, patient } = route.params;
   console.log("Consultation Details Patient :", consultation.patient); 
   console.log("Consultation Details Consultation:", consultation);
   console.log("Received consultation data:", consultation);
   console.log("Photo material:", consultation.photoMaterial);

   console.log(consultation);
   console.log(patient);

   let patientId= consultation.patient._id;
   console.log("Consultation Details PatientID :", patientId);

   const consultationId= consultation._id;
   console.log('Consultation ID to remove:', consultationId);
   console.log('Consultation ID:', consultationId);

   
  const { loading, error, data, refetch } = useQuery(GET_CONSULTATION_BY_PATIENT, {
    variables: { patientId },
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Rafraîchir les données à chaque fois que la page est affichée
      console.log('Data refreshed on focus');
    }, [refetch])
  );

  const [removeConsultation, { loading: removeLoading, error: removeError }] = useMutation(REMOVE_CONSULTATION, {
    onCompleted: () => {
      refetch();  // Recharger les données de consultations
    },
  });
  console.log('Consultation ID to remove:', consultationId);


  const handleRemoveConsultation = async (consultationId) => {
    try {
      // Afficher une alerte de confirmation avant de supprimer
      Alert.alert(
        'Confirmation',
        'Are you sure you want to remove this consultation?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              // Si l'utilisateur confirme, procéder à la suppression
              console.log('Consultation ID to remove:', consultationId);
              const { data } = await removeConsultation({ variables: { id: consultationId } });
              
              // Actualiser la liste des consultations après suppression
              if (data?.consultationRemoveById?.recordId) {
                Alert.alert('Success', 'Consultation successfully removed.');
              } else {
                Alert.alert('Error', 'Failed to remove consultation.');
              }
              // Rafraîchir les données lorsque la page devient active
              useFocusEffect(
                React.useCallback(() => {
                  refetch();
                }, [])
              );
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error('Error while removing consultation:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

console.log('Navigating with:', { 
  patient: patient, 
  patientData: consultation.patient, 
  patientId: consultation.patient._id 
});

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
      {/* Header avec le titre */}
      <View style={styles.pageHeader}>
        <Text style={styles.headerTitle}>ALL PATIENT'S CONSULTATIONS</Text>
      </View>

    {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
      <Ionicons name="home" size={30} color="black" />
     </TouchableOpacity>
    </View>

     
      {!loading && !error && data?.consultationMany && data.consultationMany.length > 0 ? (
      <ScrollView>
      {data.consultationMany.map((consultation) => (
    <View key={consultation._id} style={styles.detailCard}>
      <Text style={styles.title}>Consultation Details for Patient: {consultation.patient.name}</Text>
          
      <Text style={styles.label}>Complain: <Text style={styles.value}> {consultation.complain}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}> {consultation.status}</Text></Text> 
      <Text style={styles.label}>Created at: <Text style={styles.value}> {new Date(consultation.createdAt).toISOString().split("T")[0]}</Text></Text>
      


         {/* Bouton "Afficher" */}
         <View style={styles.headerContainer}>
    <TouchableOpacity
      style={styles.viewButton}
      onPress={() => navigation.navigate('ConsultationTabs', { consultation })}>
      <Text style={styles.buttonText}>+ Add Details</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleRemoveConsultation(consultation._id)}>
        <AntDesign name="delete" size={24} color="red" />
    </TouchableOpacity>
    </View>

      </View>
      ))}
    </ScrollView>
     ) : (
      !loading && !error && <Text style={styles.noData}>No consultations available for this patient.</Text>
    )}


    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ConsultationDetails

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    flex: 1,
    marginTop:4
   },
   pageHeader: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
  },
  title: { fontSize: 19, fontWeight: 'bold', marginBottom: 10 },
  detailCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 4,
},
value: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#333',
},
button: {
  backgroundColor: '#3498db',
  padding: 12,
  borderRadius: 8,
  marginTop: 15,
  alignItems: 'center',
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
homeButton: {
  width: 51, // Taille du cercle
  height: 51, // Taille du cercle
  borderRadius: 26, // Moitié de la taille pour un cercle parfait
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000", 
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 8,
  marginBottom: 15,
  fontSize: 16,
},
submitButton: {
  backgroundColor: '#24A5E8',
  padding: 12,
  width: 185,
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 10,
  alignSelf: 'center',
},
cancelButton: {
  backgroundColor: '#e74c3c',
  padding: 12,
  width: 185,
  alignSelf: 'center',
  borderRadius: 25,
  alignItems: 'center',
  marginTop: 10,
},
cancelButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
noData: {
  textAlign: 'center',
  fontSize: 16,
  color: '#888',
  marginTop: 20,
},
deleteButton: {
  backgroundColor: '#fff',
  padding: 8,
  paddingLeft:10,
  borderRadius: 8,
  marginTop: 10,
  alignItems: 'flex-end',
},
headerContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 10,
  marginVertical: 10,
},
photoButton: {
  backgroundColor: '#ddd',
  padding: 12,
  borderRadius: 13,
  marginBottom: 10,
  alignItems: 'center',
},
viewButton: {
  backgroundColor: '#318CE7',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  alignItems: 'center',
},

})