import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { GestureHandlerRootView, TouchableOpacity, TextInput, ScrollView } from 'react-native-gesture-handler'
import React from 'react'

const ConsultationDetails = ({ route }) => {

  // Récupérer la consultation passée en paramètre
  const { consultation } = route.params;

   // Extraction manuelle du nom du patient avec regex
  const patientData = consultation.patient;
    const nameMatch = patientData.match(/name:\s?'([^']+)'/);
    const patientName = nameMatch && nameMatch[1] ? nameMatch[1] : 'Unknown';


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
      <ScrollView>
    <View style={styles.detailCard}>
    <Text style={styles.title}>Details consultation for Patient: {patientName}</Text>
          
      <Text style={styles.label}>Complain: <Text style={styles.value}> {consultation.complain}</Text></Text>
      <Text style={styles.label}>Medications: <Text style={styles.value}> {consultation.medications}</Text></Text>
      <Text style={styles.label}>Dosage:<Text style={styles.value}> {consultation.dosage}</Text></Text>
      <Text style={styles.label}>Blood Pressure: <Text style={styles.value}> {consultation.blood_pressure}</Text></Text>
      <Text style={styles.label}>Pulse: <Text style={styles.value}> {consultation.pulse}</Text></Text>
      <Text style={styles.label}>Temperature: <Text style={styles.value}> {consultation.temperature}</Text></Text> 
      <Text style={styles.label}>Date:<Text style={styles.value}> {consultation.date}</Text></Text>
      
    </View>
    </ScrollView>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ConsultationDetails

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  detailCard: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    elevation: 3, // For Android shadow
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
})