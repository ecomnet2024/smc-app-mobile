import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { USER_LOGIN } from '../../src/Screens/graphql/Mutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialIcons";
import { colors } from '../assets/utils/color';



const LoginScreen = () => {

        const [password, setPassword] = useState('');
        const [isPasswordVisible, setPasswordVisible] = useState(false);

        const [errors, setErrors] = useState({});
        const [email, setEmail] = useState('');
        // Utilise la mutation USER_LOGIN
  const [loginUser, { loading, error }] = useMutation(USER_LOGIN);

  const navigation = useNavigation();

  const handleForgot = ()=>{
    navigation.navigate("Forgot");
    };
    const handleSignUp = ()=>{
      navigation.navigate("SignUp");
      };
      
   const handleHome = async () => {
          console.log("handleHome called");
          let formErrors = {};
          if (!email) formErrors.email = 'Your email is required';
          if (!password) formErrors.password = 'Please enter your password';

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            Alert.alert('Validation Error', 'Invalid email format.');
            return false;
          }
          if (password.length < 5) {
            Alert.alert('Validation Error', 'Password must be at least 5 characters.');
            return false;
          }

          setErrors(formErrors);
          // Si pas d'erreurs, on peut faire autre chose (comme envoyer les données)
          if (Object.keys(formErrors).length === 0) {
            console.log('Données valides, prêt à soumettre');
            
            try {
              const response = await loginUser({
                variables: {
                  email: email,
                  password: password,
                },
              });
                console.log('Response:', response);  // Vérifie la structure ici

                const userData = response.data.userLogin;
            if (userData.success) {
            const email = userData.user.email;  // Vérifie la structure de la réponse
            const token = userData.token;       // Vérifie un token
               console.log('User email:', email);
                console.log('User token:', token);
              
                if (email && token ) {
                  try {
                    await AsyncStorage.setItem('userEmail', email);
                    await AsyncStorage.setItem('userToken', token);
                    console.log('Email, token was saved successfully');
                    navigation.replace('Home');
                  } catch (e) {
                    console.log('Error saving data:', e);
                  }
                } else {
                  console.log('Email or token is missing');
                }

              } else {
                Alert.alert('Login failed','Bad email or password, try again' );
              }
            } catch (e) {
              console.error('Error during login:', e);
              Alert.alert('Login Error', e.message + 'An error occurred, please try again later.');
            }
          }
        };

        const checkStoredData = async () => {
          try {
            const email = await AsyncStorage.getItem('userEmail');
            const token = await AsyncStorage.getItem('userToken');
        
            if (email !== null && token !== null && expiresIn !== null ) {
              console.log('Stored email:', email);
              console.log('Stored token:', token);
            } else {
              console.log('No data found');
            }
          } catch (e) {
            console.log('Error retrieving data:', e);
          }
        };
        
        
        const saveTokenData = async (token) => {
          try {
            await AsyncStorage.setItem('userToken', token);
            console.log('Token saved successfully.');
          } catch (error) {
            console.log('Error saving token data:', error);
          }
        };

        checkStoredData();
        saveTokenData();



  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <View>

     <TouchableOpacity style={styles.bannerButton}>
        <Image 
          source={require('../assets/Group 13.png')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </TouchableOpacity> 

      <Text style={styles.title}> Let's Sign You In</Text>
      <Text style={styles.label}> Welcome back </Text>

{/* Formulaire */}
      <View style={styles.formContainer}>
      <Text style={styles.label}>Email</Text>
         <View style={styles.inputContainer}>
         <AntDesign name="mail" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your email'  value={email} onChangeText={setEmail} keyboardType="email-address" />
         </View>
         {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Password</Text>
         <View style={styles.inputContainer}>
         <MaterialIcons name="key" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your password' secureTextEntry={!isPasswordVisible} value={password} onChangeText={(text) => setPassword(text)} />
           <TouchableOpacity
        onPress={() => setPasswordVisible(!isPasswordVisible)}
        style={styles.iconContainer}
      >
        <Icon
          name={isPasswordVisible ? "visibility" : "visibility-off"}
          size={24}
          color="#888"
        />
      </TouchableOpacity>
         </View>
         
         {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      </View>

     <TouchableOpacity>
      <Text style={styles.forgetPass} onPress={handleForgot}> Forget password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={handleHome}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.Text}> OR </Text>

        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.GoogleButton} 
        onPress={() => Alert.alert("", "This feature is not available yet.", [{ text: "OK" }])}
        >
          <Image source={require('../assets/chrome.png')} style={styles.icon} />
          <Text style={styles.buttonText2}>Google</Text>
       </TouchableOpacity>

        <TouchableOpacity style= {styles.AppleButton} 
        onPress={() => Alert.alert("", "This feature is not available yet.", [{ text: "OK" }])}>
          <MaterialIcons name="apple" size={24} color="black" />
          <Text style={styles.buttonText2}>Apple</Text>
        </TouchableOpacity>
       </View>

       <View style={styles.TextContainer}>
       <Text style={styles.Text}> Don't you have an account? </Text>
      <TouchableOpacity>
       <Text style={{color: colors.primary, fontSize: 17}} onPress={handleSignUp}> Sign Up </Text>
      </TouchableOpacity>
       </View>

    </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop: 11,
    marginHorizontal: 12,
  },
  formContainer:{
    marginTop:38,
  },
  inputContainer:{
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection:"row",
    alignItems:"center",
    marginTop: 5,
    marginHorizontal: 3,
  },
  TextInput:{
    flex:1,
    paddingHorizontal:10,
    fontWeight:"light",
  },
  bannerButton: {
    width: '100%',
    height: 135,
    marginBottom: 20, // Espace entre la bannière et le formulaire
    borderRadius: 25, 
    overflow: 'hidden', 
    backgroundColor: colors.primary,
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
    marginHorizontal: 9,
  },
  forgetPass:{
    color: colors.primary,
    marginVertical:8,
  },
  title: {
    fontSize: 20,
    fontWeight:"semibold",
    color: colors.primary,
  },
  signInButton: {
    backgroundColor: colors.primary,
   paddingVertical: 11,
    marginHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 7,
    marginBottom: 18,
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
    marginVertical:8,
  },
  buttonContainer: {           
    flexDirection: 'row',  
    justifyContent: 'space-evenly',
    width: '80%',  
    alignItems: 'center',      
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
    marginHorizontal: 28,
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
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  iconContainer: {
    marginLeft: 10,
  },

})