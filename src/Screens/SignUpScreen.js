import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USERS } from './graphql/Mutation';
import { Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const SignUpScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [createUser, { loading, error, data }] = useMutation(CREATE_USERS);

    const handleLogin = ()=>{
      navigation.navigate("Login");
      };

    const handleSignUp = () => {
      createUser({
          variables: {
            record: {
              email: email,
              password: password,
              first_name: firstName,   
              last_name: lastName ,
              phone:  phone,
              country: country ,
              address: address,
            }
          }
        }).then((response) => {
          if (response.data.userCreateOne.error) {
            const validationError = response.data.userCreateOne.error.message;
            console.error('Validation Error:', validationError); 
            Alert.alert('Validation Error', validationError);
          } else {
            console.log('User email:', email); 
            Alert.alert('Success', 'User created successfully!');
            navigation.navigate('Home', { userEmail: email });
          }
        }).catch((err) => {
          console.error('Error:', err.message);
          Alert.alert('Error', err.message);
        });
      };
    


  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

      <Text style={styles.title}> Let's Sign You Up</Text>
      <Text style={styles.label}> Welcome for you </Text>

{/* Formulaire */}
      <View style={styles.formContainer}>
      <Text style={styles.label}>Email</Text>
         <View style={styles.inputContainer}>
         <AntDesign name="mail" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your email'  value={email} onChangeText={setEmail} keyboardType="email-address" />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Password</Text>
         <View style={styles.inputContainer}>
         <MaterialIcons name="key" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your password' value={password} onChangeText={setPassword} secureTextEntry={true} />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>First name</Text>
         <View style={styles.inputContainer}>
         <FontAwesome name="user" size={24} color="black" />

           <TextInput style={styles.TextInput} 
             placeholder="First Name" value={firstName} onChangeText={setFirstName} />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Last name</Text>
         <View style={styles.inputContainer}>
         <FontAwesome name="user" size={24} color="black" />

           <TextInput style={styles.TextInput} 
          placeholder="Last Name" value={lastName} onChangeText={setLastName} />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Phone</Text>
         <View style={styles.inputContainer}>
         <Entypo name="phone" size={24} color="black" />

           <TextInput style={styles.TextInput} 
          placeholder="Phone" value={phone} onChangeText={setPhone} />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Country</Text>
         <View style={styles.inputContainer}>
         <Ionicons name="location-sharp" size={24} color="black" />

           <TextInput style={styles.TextInput} 
          placeholder="Country" value={setCountry} onChangeText={setCountry} />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Address</Text>
         <View style={styles.inputContainer}>
         <Ionicons name="location-sharp" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder="Address" value={setAddress} onChangeText={setAddress} />
         </View>
      </View>

      <TouchableOpacity style= {styles.signUpButton} onPress={handleSignUp} >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

        <Text style={styles.Text}> OR </Text>

        <View style={styles.buttonContainer}>
        <TouchableOpacity style= {styles.GoogleButton}>
        <Image source={require('../assets/chrome.png')} style={styles.icon} />
          <Text style={styles.buttonText2}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style= {styles.AppleButton}>
          <MaterialIcons name="apple" size={24} color="black" />
          <Text style={styles.buttonText2}>Apple</Text>
        </TouchableOpacity>
       </View>

       <View style={styles.TextContainer}>
       <Text style={styles.Text}> Do you already have an account? </Text>
      <TouchableOpacity>
       <Text style={{color:"#3C58C1", fontSize: 16}} onPress={handleLogin}> Sign In </Text>
      </TouchableOpacity>
       </View>

    </View>
    </ScrollView>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Permet à ScrollView de s'étendre pour tout le contenu
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  container:{
    flex: 1,
    marginTop: 10,
    marginHorizontal: 8,
  },
  formContainer:{
    marginTop:30,
  },
  inputContainer:{
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 9,
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
    marginTop:4,
    justifyContent:'center',
  },
  bannerImage: {
    width: '46%',
    height: '46%',
  },
  formContainer: {
    marginTop: 10, // Espace entre la bannière et le formulaire
    marginVertical:1,
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
  signUpButton: {
    backgroundColor: "#3C58C1",
    paddingVertical: 11,
    paddingHorizontal:15,
    marginHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical:4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight:'semibold',
  },
  buttonText2: {
    color: '#000000',
    fontSize: 15,
    fontWeight:'semibold',
  },
  Text:{
    fontSize: 16,
    alignSelf: 'center',
    marginVertical:5,
  },
  buttonContainer: {           
    flexDirection: 'row',  
    justifyContent: 'space-between',
    width: '80%',        
  },
  GoogleButton:{
    marginLeft:20,
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal:30,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection:'row',

  },
  AppleButton:{
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal:30,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection:'row',
  },
  icon: {
    width: 22, // Largeur de l'image
    height: 22, // Hauteur de l'image
    marginRight: 10, // Espacement entre l'image et le texte
  },
  TextContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:8,
  },

})