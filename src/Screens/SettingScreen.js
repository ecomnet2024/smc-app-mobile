import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'

const SettingsScreen = () => {
  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <View>
    <Text style={styles.header}>Settings</Text>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Notification Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default SettingsScreen

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
  settingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
})