import { StyleSheet, Text, View , RefreshControl} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { GET_CONSULTATION } from '../src/Screens/graphql/Queries'
import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';


const Testconsult = () => {

  const BATCH_SIZE = 6; // Nombre d'éléments à afficher par lot

  const { loading, error, data, refetch } = useQuery(GET_CONSULTATION);
  const [allConsultations, setAllConsultations] = useState([]);
  const [displayedConsultations, setDisplayedConsultations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBatch, setCurrentBatch] = useState(1); // Indice du lot actuel
  const [refreshing, setRefreshing] = useState(false);

   const navigation = useNavigation();

   // Charger toutes les données initiales
   useEffect(() => {
    if (data?.consultationMany) {
      setAllConsultations(data.consultationMany);
      setDisplayedConsultations(data.consultationMany.slice(0, BATCH_SIZE)); // Charger le premier lot
    }
  }, [data]);

 // Gérer l'affichage pendant le chargement ou en cas d'erreur
    if(loading){
        return <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3C58C1" />
       </SafeAreaView>;
    }else{
        console.log("Error fetching consultations:", error)
    }
    console.log("data ", data)


    // Fonction pour charger le lot suivant
  const loadMoreData = () => {
    const nextBatchStart = currentBatch * BATCH_SIZE;
    const nextBatchEnd = nextBatchStart + BATCH_SIZE;

    if (nextBatchStart < allConsultations.length) {
      setDisplayedConsultations((prev) => [
        ...prev,
        ...allConsultations.slice(nextBatchStart, nextBatchEnd),
      ]);
      setCurrentBatch((prev) => prev + 1);
    }
  };


  // Fonction pour gérer la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Si la barre de recherche est vide, afficher les consultations par lots
      setDisplayedConsultations(allConsultations.slice(0, currentBatch * BATCH_SIZE));
    } else {
      // Appliquer la recherche sur toutes les consultations
      const filteredResults = allConsultations.filter((item) => {
        const patientName = item.patient?.name || "Unknown";
        const patientSN = item.patient?.sn || "Unknown";
       return patientName.toLowerCase().includes(searchQuery.toLowerCase()) || patientSN.toLowerCase().includes(searchQuery.toLowerCase()) ;
      });
      setDisplayedConsultations(filteredResults); // Afficher uniquement les résultats de la recherche
    }
  }, [searchQuery, allConsultations, currentBatch]);


  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const refreshedData = await refetch();
      setAllConsultations(refreshedData.data.consultationMany);
      setDisplayedConsultations(refreshedData.data.consultationMany.slice(0, BATCH_SIZE));
      setCurrentBatch(1); // Réinitialiser les lots
    } catch (error) {
      console.error('Erreur lors du rafraîchissement :', error);
    } finally {
      setRefreshing(false);
    }
  };


 // Rendu d'un élément de la liste
const renderConsultation = ({ item }) => {
  const patientName = item.patient?.sn || "Unknown";

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <TouchableOpacity 
        onPress={() => navigation.navigate('Details', { consultation: item ,  patient: item,})}
        style={styles.consultationCard}
    >
        <Text style={styles.title}>Patient: {patientName}</Text>
        <Text>Complain: {item.complain}</Text>
        <Text>Created at: {new Date(item.createdAt).toISOString().split("T")[0]}</Text>
        <Text>Status:<Text style={{fontWeight:'bold', color: '#3C58C1'}}> {item.status}</Text></Text>

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
                placeholder="Search by name or serial number"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
          </View>
          {loading ? (
        <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3C58C1" />
        <Text>Loading...</Text>
       </SafeAreaView>
      ) : error ? (
        <Text>Error loading consultations</Text>
      ) : (
        <FlatList
        data={displayedConsultations}
        renderItem={renderConsultation}
        keyExtractor={(item) => item._id}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          searchQuery.trim() === '' &&
          displayedConsultations.length < allConsultations.length ? (
            <Text>Loading more...</Text>
          ) : (
            <Text>No more consultations</Text>
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      )}
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
  loadingText: {
    textAlign: 'center',
    padding: 10,
    color: 'grey',
  },

})