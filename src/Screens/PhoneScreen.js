import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler'


const contacts = [
  { id: '1', name: 'Jean', phone: '+123456789' },
  { id: '2', name: 'Marie', phone: '+987654321' },
  { id: '3', name: 'Paul', phone: '+102938475' },
];

const PhoneScreen = () => {
  return (
    <GestureHandlerRootView>
       <SafeAreaView style={styles.container}>
       <View>
      <Text style={styles.header}>Contacts</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
     </SafeAreaView>
    </GestureHandlerRootView>
    
  )
}

export default PhoneScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 18,
  },

});