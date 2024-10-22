import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'


const notifications = [
  { id: '1', message: 'Your consultation has been approved.', date: '2024-10-17' },
  { id: '2', message: 'New message from Jean.', date: '2024-10-16' },
  { id: '3', message: 'Your profile was updated.', date: '2024-10-15' },
];

const NotificationsScreen = () => {
  return (
    <GestureHandlerRootView>
       <SafeAreaView style={styles.container}>
    <View>
    <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text>{item.message}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
     </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notificationItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
})