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
import { USER_LOGIN } from './graphql/Mutation';



const LoginScreen = () => {

        const [password, setPassword] = useState('');
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
      
        const handleHome = () => {
          console.log("handleHome called");
          let formErrors = {};
          if (!email) formErrors.email = 'Veuillez entrer le nom d\'utilisateur';
          if (!password) formErrors.password = 'Le mot de passe est obligatoire';
          setErrors(formErrors);
          // Si pas d'erreurs, on peut faire autre chose (comme envoyer les données)
          if (Object.keys(formErrors).length === 0) {
            console.log('Données valides, prêt à soumettre');

            loginUser({
              variables: {
                email: email,
                password: password,
              }
            })
            .then(response => {
              const { success, message } = response.data.userLogin;
        
              if (success) {
                Alert.alert('Success', 'Login successful!');
                // Redirige vers la page Home et passe l'email de l'utilisateur ou d'autres infos
                navigation.navigate('Home', { userEmail: email });
              } else {
                Alert.alert('Login Failed', message);
              }
            })
            .catch(err => {
              console.error('Error:', err.message);
              Alert.alert('Error', 'An error occurred during login.');
            });
          }
        };
      


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
      <Text style={styles.label}>Username or email</Text>
         <View style={styles.inputContainer}>
         <AntDesign name="user" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter user name or email'  value={email} onChangeText={setEmail} keyboardType="email-address" />
         </View>
         {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Password</Text>
         <View style={styles.inputContainer}>
         <MaterialIcons name="key" size={24} color="black" />

           <TextInput style={styles.TextInput} 
           placeholder='Enter your password' secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)} />
         </View>
         {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      </View>

     <TouchableOpacity>
      <Text style={styles.forgetPass} onPress={handleForgot}> Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={handleHome}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

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
       <Text style={styles.Text}> Don't you have an account? </Text>
      <TouchableOpacity>
       <Text style={{color:"#3C58C1", fontSize: 16}} onPress={handleSignUp}> Sign Up </Text>
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
  forgetPass:{
    color:"#3C58C1",
    marginVertical:8,
  },
  title: {
    fontSize: 20,
    fontWeight:"semibold",
    color:"#3C58C1",
  },
  signInButton: {
    backgroundColor: "#3C58C1",
   paddingVertical: 10,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

})