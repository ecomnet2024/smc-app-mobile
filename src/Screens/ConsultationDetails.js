import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import React from 'react'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { REMOVE_CONSULTATION } from '../../src/Screens/graphql/Mutation';
import { GET_CONSULTATION_BY_PATIENT } from '../../src/Screens/graphql/Queries';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


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

const handleDeleteConsultation = (id) => {
  Alert.alert('Confirmation', 'Are you sure you want to delete this prescription?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => remove({ variables: { id } }) },
  ]);
};

console.log('Navigating with:', { 
  patient: patient, 
  patientData: consultation.patient, 
  patientId: consultation.patient._id 
});

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} >
        <Ionicons name="chevron-back-circle" size={39} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate("HomeTabs")} >
         <Ionicons name="home" size={39} color="black" />
      </TouchableOpacity>
      </View>

     
      {!loading && !error && data?.consultationMany && data.consultationMany.length > 0 ? (
      <ScrollView>
      {data.consultationMany.map((consultation) => (
    <View key={consultation._id} style={styles.detailCard}>
      <Text style={styles.title}>Details consultation for Patient: {consultation.patient.sn}</Text>
          
      <Text style={styles.label}>Complain: <Text style={styles.value}> {consultation.complain}</Text></Text>
      <Text style={styles.label}>Status: <Text style={styles.value}> {consultation.status}</Text></Text> 
      <Text style={styles.label}>Created at: <Text style={styles.value}> {new Date(consultation.createdAt).toISOString().split("T")[0]}</Text></Text>
      
       {/* Rendre les images spécifiques à chaque consultation */}
    <View>
      {consultation.photo_material && consultation.photo_material.length > 0 ? (
        consultation.photo_material.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))
      ) : (
        <Text style={styles.noPhotoText}>No photos available</Text>
      )}
    </View>


         {/* Bouton "Afficher" */}
         <View style={styles.headerContainer}>
    <TouchableOpacity
      style={styles.viewButton}
      onPress={() => navigation.navigate('ConsultationTabs', { consultation })}>
      <Text style={styles.buttonText}>Show All</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleRemoveConsultation(consultation._id)}>
        <AntDesign name="delete" size={28} color="red" />
    </TouchableOpacity>
    </View>

      </View>
      ))}
    </ScrollView>
     ) : (
      !loading && !error && <Text style={styles.noData}>No consultations available for this patient.</Text>
    )}

         <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('NewConsultation', { patient: patient ,
                patientData: consultation.patient, patientId:consultation.patient._id})}>
              <Text style={styles.buttonText}>Add Consultation</Text>
         </TouchableOpacity>

    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ConsultationDetails

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    flex: 1,
    marginTop:5
   },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  detailCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    marginTop:20,
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
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  maxWidth: 400,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
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
  backgroundColor: '#2ecc71',
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
dateButton: {
  padding: 15,
  backgroundColor: '#ddd',
  marginBottom: 10,
  borderRadius: 5,
},
modalText: {
  fontSize: 16,
  color: '#333',
  marginBottom: 10,
},
image: { width: '100%', height: 300, marginTop: 20 },
noPhoto: {
  fontSize: 12,
  color: 'gray',
},
photo: {
  width: '100%',
  height: 200,
  resizeMode: 'cover',
  marginVertical: 10,
},
noPhotoContainer: {
  marginVertical: 0,
  alignItems: 'center',
  justifyContent: 'center',
  height: 'auto', // Permet au conteneur de s'adapter uniquement au contenu
},
noPhoto: {
  textAlign: 'center',
  color: '#888',
  fontSize: 14,
  marginVertical: 0, // Réduit toute marge supplémentaire
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
photoButtonText: { color: '#000000', fontSize: 16 },
imagePreview: { width: '100%', height: 200, marginBottom: 20 },
noPhotoText: { color: '#999', marginBottom: 20, fontStyle: 'italic' },
viewButton: {
  backgroundColor: '#1abc9c',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  alignItems: 'center',
},


})