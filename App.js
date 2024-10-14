
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler'
import SignUpScreen  from '../smc-mobile/src/Screens/SignUpScreen';
import  LoginScreen from '../smc-mobile/src/Screens/LoginScreen';
import React, { useEffect } from 'react';
import { Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import ForgotScreen from '../smc-mobile/src/Screens/ForgotScreen';
import HomeScreen from '../smc-mobile/src/Screens/HomeScreen';
import NewConsultationScreen from '../smc-mobile/src/Screens/NewConsultationScreen';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";


const Stack = createNativeStackNavigator();

function SplashScreen({ navigation }) {
  // Rediriger vers la page d'accueil après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('GetStarted'); // Remplace l'écran Splash par GetStarted
    }, 3000); // 3000 ms = 3 secondes

    return () => clearTimeout(timer); // Nettoyage du timer
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image 
        source={require('../smc-mobile/src/assets/Group 13.png')} // Exemple d'icône
        style={styles.logo} resizeMode='contain'
      />
    </View>
  );
}

function GetStartedScreen({ navigation }) {
  return (
    <GestureHandlerRootView>
    <View style={styles.getStartedContainer}>
      <Image 
        source={require('../smc-mobile/src/assets/consultation.png')} // Exemple d'icône
        style={styles.logo} resizeMode='contain'/>

      <Text style={styles.getStartedText}>Welcome to the App!</Text>
      <TouchableOpacity 
        style={styles.getStartedButton} 
        onPress={() => navigation.replace('Login')} // Redirige vers la page Login
      >
        <Text style={styles.getStartedButtonText}>Get Started </Text>
        <View style={styles.iconContainer}>
        <AntDesign name="right" size={24} color="gray" style={styles.icon} />
        <AntDesign name="right" size={24} color="black" style={styles.icon} />
        <AntDesign name="right" size={24} color="black" style={styles.icon} />
        </View>

      </TouchableOpacity>
    </View>
    </GestureHandlerRootView>
  );
}



export default function App() {


  const client= new ApolloClient({
    cache: new InMemoryCache(),
    uri:"http://5.182.33.47:4000/graphql"
  })


  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen name='SignUp' options={{headerShown:false}} component={SignUpScreen} />
      <Stack.Screen name='Login' options={{headerShown:false}} component={LoginScreen} />
      <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen}  />
      <Stack.Screen name="GetStarted" options={{ headerShown: false }} component={GetStartedScreen}/>
      <Stack.Screen name='Forgot' options={{headerShown:false}} component={ForgotScreen} />
      <Stack.Screen name='Home' options={{headerShown:false}} component={HomeScreen} />
      <Stack.Screen name='NewConsultation' options={{headerShown:false}} component={NewConsultationScreen} />

    </Stack.Navigator>
    </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C58C1', // Bleu en fond d'écran
  },
  logo: {
    width: '90%',
    height: '90%', // Dimensions de l'icône
  },
  getStartedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fond blanc pour la page Get Started
  },
  getStartedText: {
    fontSize: 24,
    fontWeight: 'semibold',
    marginBottom: 40,
    bottom:60,
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 35, // Positionne le bouton en bas de l'écran
    backgroundColor: '#D3D3D3',
    flexDirection:'row',
    borderWidth:1,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 100,
    alignSelf:'center',
    borderColor:'#D4D4D4'
  },

  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
  },

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',   
  },
  icon: {
    marginRight: -10,
  },

});
