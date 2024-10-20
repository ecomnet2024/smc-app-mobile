import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'

const SettingsScreen = () => {
  return (
    <GestureHandlerRootView>
    <SafeAreaView>
    <View>
      <Text>SettingsScreen</Text>
    </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({})