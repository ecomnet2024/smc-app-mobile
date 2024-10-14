import { StyleSheet, Text, View , ScrollView} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView, TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'


const NewConsultationScreen = () => {

  const navigation = useNavigation();


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


{/* Formulaire */}
      <View style={styles.formContainer}>
      <Text style={styles.label}>Nom du patient</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Entrer le nom du patient' />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Groupe Sanguin</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Groupe Sanguin' />
         </View>
      </View>

      <View style={styles.formContainer}>
      <Text style={styles.label}>Pression sanguine</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Pression sanguine' />
         </View>
      </View>

       <View style={styles.formContainer}>
      <Text style={styles.label}>Glycemie</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Glycemie'  />
         </View>
      </View>

       <View style={styles.formContainer}>
      <Text style={styles.label}>Date de naissance</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Date de naissance' />
         </View>
      </View>

       <View style={styles.formContainer}>
      <Text style={styles.label}>Temperature</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Temperature' />
         </View>
      </View>

       <View style={styles.formContainer}>
      <Text style={styles.label}>Frequence respiratoire</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Frequence respiratoire' />
         </View>
      </View>

       <View style={styles.formContainer}>
      <Text style={styles.label}>Poids</Text>
         <View style={styles.inputContainer}>

           <TextInput style={styles.TextInput} 
           placeholder='Poids' secureTextEntry={true} />
         </View>
      </View>

      <TouchableOpacity style= {styles.signInButton}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>

    </View>
    </ScrollView>
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default NewConsultationScreen

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // Permet à ScrollView de s'étendre pour tout le contenu
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
      },
  container:{
    flex: 1,
    marginTop: 15,
    marginHorizontal: 10,
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
    backgroundColor:'#f8f8f8',
    borderColor:'#f8f8f8',
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
  formContainer: {
    marginTop: 12, // Espace entre la bannière et le formulaire
    marginVertical:2,
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
  signInButton: {
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
  TextContainer:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:8,
  },

})