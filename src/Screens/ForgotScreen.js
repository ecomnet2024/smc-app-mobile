import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const ForgotScreen = () => {
    const navigation = useNavigation();

    return (
      <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
      <View>
  
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()} >
          <Ionicons name="chevron-back-circle" size={35} color="gray" />
        </TouchableOpacity>
  
       <TouchableOpacity style={styles.bannerButton}>
          <Image 
            source={require('../assets/Group 13.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </TouchableOpacity> 

        <Text style={styles.title}> Forgotten password</Text>
        <Text style={styles.label}> Welcome for you </Text>

        {/* Formulaire */}
      <View style={styles.formContainer}>
      <Text style={styles.label}>Email</Text>
         <View style={styles.inputContainer}>
           <AntDesign name="mail" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your email' keyboardType="email-address" />
         </View>
      </View>

      <TouchableOpacity style= {styles.ValidateButton}>
          <Text style={styles.buttonText}>Validate</Text>
        </TouchableOpacity>

     </View>
     </SafeAreaView>
      </GestureHandlerRootView>

    )
}

export default ForgotScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 20,
    marginHorizontal: 10,
  },
  formContainer:{
    marginTop:35,
  },
  inputContainer:{
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection:"row",
    alignItems:"center",
  },
  TextInput:{
    flex:1,
    paddingHorizontal:10,
    fontWeight:"light",
  },
  backButton: {
    left: 5,
    zIndex: 2,
  },
  bannerButton: {
    width: '100%',
    height: 125,
    marginBottom: 20, // Espace entre la bannière et le formulaire
    borderRadius: 25, 
    overflow: 'hidden', 
    backgroundColor:"#3C58C1",
    alignItems:'center',
    marginTop:10,
   justifyContent:'center',
  },
  bannerImage: {
    width: '46%',
    height: '46%',
  },
  formContainer: {
    marginTop: 18, // Espace entre la bannière et le formulaire
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight:"semibold",
    color:"#3C58C1",
  },
  ValidateButton: {
    backgroundColor: "#3C58C1",
    paddingVertical: 11,
    paddingHorizontal:15,
    marginHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical:30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight:'semibold',
  },
})