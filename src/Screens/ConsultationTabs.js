import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Page principale avec les détails de la consultation
const MainDetails = ({ route }) => {
  const { consultation } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Details</Text>
      <Text>Complain: {consultation.complain}</Text>
      <Text>Blood Pressure: {consultation.blood_pressure}</Text>
      <Text>Pulse: {consultation.pulse}</Text>
      <Text>Temperature: {consultation.temperature}</Text>
      <Text>Status: {consultation.status}</Text>
    </View>
  );
};

// Exemple de page pour Vaccinations
const Vaccinations = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Vaccinations</Text>
    <Text>No data yet.</Text>
  </View>
);

// Exemple de page pour Prescriptions
const Prescriptions = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Prescriptions</Text>
    <Text>No data yet.</Text>
  </View>
);

const ConsultationTabs = ({ route }) => {
  const { consultation } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Details" component={MainDetails} initialParams={{ consultation }} />
      <Tab.Screen name="Vaccinations" component={Vaccinations} />
      <Tab.Screen name="Prescriptions" component={Prescriptions} />
    </Tab.Navigator>
  );
};

export default ConsultationTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
