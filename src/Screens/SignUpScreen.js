import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native'
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
import { CREATE_USERS } from '../../src/Screens/graphql/Mutation';
import { GET_ROLES } from '../../src/Screens/graphql/Queries';
import { Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUpScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('M'); // Default to 'M'
  const [selectedRole, setSelectedRole] = useState(null);

  const [createUser, { loading, error, data }] = useMutation(CREATE_USERS);
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useQuery(GET_ROLES);
  //const [createUser, { loading: createLoading, error: createError }] = useMutation(CREATE_USERS);

    const handleLogin = ()=>{
      navigation.navigate("Login");
      };
    
    const validateFields = () => {
        if (!email || !password || !firstName || !lastName || !phone || !country || !address|| !selectedRole) {
          Alert.alert('Validation Error', 'All fields are required.');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Alert.alert('Validation Error', 'Invalid email format.');
          return false;
        }
        if (password.length < 5) {
          Alert.alert('Validation Error', 'Password must be at least 5 characters.');
          return false;
        }
        if (!/^\+?[0-9]{7,15}$/.test(phone)) {
          Alert.alert('Validation Error', 'Invalid phone number.');
          return false;
        }
        return true;
      };

      const handleSignUp = async () => {
        if (!validateFields()) return;
    
        try {
          const response = await createUser({
            variables: {
              record: {
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                country: country,
                address: address,
                gender,
                role: selectedRole,
              },
            },
          });
    
          const result = response.data.userCreateOne;
          // if (result.error) {
          //   const validationError = result.error.message;
          //   console.error('Validation Error:', validationError);
          //   Alert.alert('Validation Error', validationError);
          //   return;
          // }

          Alert.alert('Success', 'User created successfully! Now you can login');
            navigation.navigate('Login');
    
        } catch (err) {
          console.error('Error:', err.message);
          Alert.alert('Error', err.message);
        }
      };
  


      if (rolesLoading) {
        return <ActivityIndicator size="large" color="#3C58C1" />;
      }
    
      if (rolesError) {
        return <Text>Error fetching roles: {rolesError.message}</Text>;
      }



  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()} >
        <Ionicons name="chevron-back-circle" size={36} color="gray" />
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

       {/* Gender */}
       <View style={styles.formContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="male-female" size={24} color="black" />
                <TextInput
                  style={styles.TextInput}
                  placeholder="M or F"
                  value={gender}
                  onChangeText={setGender}
                />
              </View>
            </View>

         {/* Role Selection */}
         <View style={styles.formContainer}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedRole}
                  onValueChange={(itemValue) => setSelectedRole(itemValue)}
                >
                  <Picker.Item label="Select Role" value={null} />
                  {rolesData.roleMany.map((role) => (
                    <Picker.Item key={role._id} label={role.name} value={role._id} />
                  ))}
                </Picker>
              </View>
            </View>


      <View style={styles.formContainer}>
      <Text style={styles.label}>Phone</Text>
         <View style={styles.inputContainer}>
         <Entypo name="phone" size={24} color="black" />

           <TextInput style={styles.TextInput} 
          placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
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
       <Text style={styles.Text}> I already have an account
 </Text>
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
    marginTop: 6,
    marginHorizontal: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 10,
  },
  formContainer:{
    marginTop:27,
  },
  inputContainer:{
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection:"row",
    alignItems:"center",
  },
  TextInput:{
    flex:1,
    paddingHorizontal:10,
    fontWeight:"light",
  },
  backButton: {
    left: 4,
    zIndex: 2,
  },
  bannerButton: {
    width: '106%',
    height: 125,
    marginBottom: 18, // Espace entre la bannière et le formulaire
    borderRadius: 25, 
    overflow: 'hidden', 
    backgroundColor:"#3C58C1",
    alignItems:'center',
    alignSelf: 'center',
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
    fontSize: 19,
    fontWeight:"semibold",
    color:"#3C58C1",
  },
  signUpButton: {
    backgroundColor: "#3C58C1",
    paddingVertical: 11,
    paddingHorizontal:10,
    marginHorizontal: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical:9,
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
    marginBottom:20,
  },

})