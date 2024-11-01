import { StyleSheet, Text, View , ScrollView, Pressable, Platform, Alert} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { GET_CONSULTATION } from '../src/Screens/graphql/Queries'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';


const Testconsult = () => {

// Requête GraphQL pour récupérer les consultations
   const { loading, error, data } = useQuery(GET_CONSULTATION);
   const [searchQuery, setSearchQuery] = useState('');
   const navigation = useNavigation();
 // Gérer l'affichage pendant le chargement ou en cas d'erreur
    if(loading){
        return <View><Text>is loading ...</Text></View>
    }else{
        console.log("Error ", error)
    }

    console.log("data ", data)
 
    // Récupérer les consultations de la réponse GraphQL
   const consultations = data?.consultationMany || [];

// Filtrer les consultations en fonction de searchQuery
const filteredConsultations = consultations.filter((item) => {
  const patientData = item.patient;
  let patientName = "Unknown";

 // Extraction manuelle du nom avec une regex
 const nameMatch = patientData.match(/name:\s?'([^']+)'/);
 if (nameMatch && nameMatch[1]) {
     patientName = nameMatch[1];
 }

 // Vérification si le nom du patient contient la recherche
 return patientName.toLowerCase().includes(searchQuery.toLowerCase());
});



const renderConsultation = ({ item }) => {
  let patientName = "Unknown";
  const patientData = item.patient;

  // Extraction manuelle du nom avec une regex
  const nameMatch = patientData.match(/name:\s?'([^']+)'/);
  if (nameMatch && nameMatch[1]) {
      patientName = nameMatch[1];
  }


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <TouchableOpacity 
        onPress={() => navigation.navigate('Details', { consultation: item })}
        style={styles.consultationCard}
    >
        <Text style={styles.title}>Patient: {patientName}</Text>
        <Text>Complain: {item.complain}</Text>
        <Text>Medications: {item.medications}</Text>
        <Text>Dosage: {item.dosage}</Text>
        <Text>Date: {item.date}</Text>
        
    </TouchableOpacity>
    </SafeAreaView>
   </GestureHandlerRootView>
);
};

 return (
  <View style={styles.container}>
         <View style={styles.searchContainer}>
         <Ionicons name="search" size={20} color="gray" />
            <TextInput
                style={styles.searchInput}
                placeholder="Search by patient name"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
          </View>
          <View>
             <FlatList
               data={filteredConsultations}
               renderItem={renderConsultation}
               keyExtractor={(item) => item._id}
               ListEmptyComponent={<Text style={styles.emptyText}>No consultations found</Text>}
            />
          </View>
   </View>
      );
  };

export default Testconsult

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 5,
    marginHorizontal: 8,
    color:"#B8DFF3",
  },
  consultationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 4,
    borderRadius: 10,
    elevation: 3, // For Android shadow
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
  searchInput: {
    marginLeft: 5,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 7,
    marginBottom: 6,
  },

})