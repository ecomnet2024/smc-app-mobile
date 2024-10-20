import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'


const NotificationsScreen = () => {
  return (
    <GestureHandlerRootView>
       <SafeAreaView>
    <View>
      <Text>NotificationsScreen</Text>
    </View>
     </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({})