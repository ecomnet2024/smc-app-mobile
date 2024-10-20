import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'

const PhoneScreen = () => {
  return (
    <GestureHandlerRootView>
       <SafeAreaView>
    <View>
      <Text>PhoneScreen</Text>
    </View>
     </SafeAreaView>
    </GestureHandlerRootView>
    
  )
}

export default PhoneScreen

const styles = StyleSheet.create({})