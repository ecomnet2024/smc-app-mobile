import { StyleSheet, Text, View , ScrollView, Pressable, Platform, Alert} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { GET_CONSULTATION } from '../src/Screens/graphql/Queries'
import { useQuery } from '@apollo/client'
import { FlatList } from 'react-native-gesture-handler'


const Testconsult = () => {

    const { loading, error, data } = useQuery(GET_CONSULTATION);

    if(loading){
        return <View><Text>is loading ...</Text></View>
    }else{
        console.log("Error ", error)
    }

    console.log("data ", data)
 

    const consultations = data.consultationMany || [];

    const renderConsultation = ({ item }) => {
      return (
        <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
        <View style={styles.consultationCard}>
          <Text style={styles.title}>Consultation for Patient ID: {item.patient}</Text>
          <Text>Complain: {item.complain}</Text>
          <Text>Medications: {item.medications}</Text>
          <Text>Dosage: {item.dosage}</Text>
        </View>
        </SafeAreaView>
    </GestureHandlerRootView>
      );
    };
  
    return (
      <FlatList
        data={consultations}
        renderItem={renderConsultation}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No consultations found</Text>}
      />
    );
  };

export default Testconsult

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 12,
    marginHorizontal: 10,
    color:"#B8DFF3",
  },
  consultationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3, // For Android shadow
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },

})