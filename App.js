
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler'
import SignUpScreen  from './src/Screens/SignUpScreen';
import  LoginScreen from './src/Screens/LoginScreen';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import ForgotScreen from './src/Screens/ForgotScreen';
import HomeScreen from './src/Screens/HomeScreen';
import PhoneScreen from './src/Screens/PhoneScreen';
import NotificationScreen from './src/Screens/NotificationScreen';
import SettingScreen from './src/Screens/SettingScreen';
import NewConsultationScreen from './src/Screens/NewConsultationScreen';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Phone') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5 },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Phone" component={PhoneScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Setting" component={SettingScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}



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
        source={require('./src/assets/Group 13.png')} // Exemple d'icône
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
        source={require('./src/assets/consultation.png')} // Exemple d'icône
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



// Stack Navigator pour Login et Signup
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen name='SignUp' options={{headerShown:false}} component={SignUpScreen} />
      <Stack.Screen name='Login' options={{headerShown:false}} component={LoginScreen} />
      <Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen}  />
      <Stack.Screen name="GetStarted" options={{ headerShown: false }} component={GetStartedScreen}/>
      <Stack.Screen name='Forgot' options={{headerShown:false}} component={ForgotScreen} />
      <Stack.Screen name='Home' options={{headerShown:false}} component={HomeScreen} />
      <Stack.Screen name='NewConsultation' options={{headerShown:false}} component={NewConsultationScreen} />
      <Stack.Screen name="HomeTabs" options={{ headerShown: false }} component={HomeTabNavigator} />

    </Stack.Navigator>
  );
}


// Création du client Apollo
const createApolloClient = (token) => {
  const httpLink = new HttpLink({
    uri: "http://5.182.33.47:4000/graphql", // Mettre l'URL de ton serveur GraphQL
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('userToken');
    console.log("Token récupéré:", token);

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '', // Ajoute le token à l'en-tête Authorization
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};




export default function App() {

  /*const client= new ApolloClient({
    cache: new InMemoryCache(),
    uri: authLink.concat("http://5.182.33.47:4000/graphql"),
  })*/

  const [client, setClient] = useState(null);

  useEffect(() => {
    const initializeApolloClient = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Récupérer le token ici
      setClient(createApolloClient(token)); // Créer le client Apollo avec le token
    };

    initializeApolloClient(); // Initialiser le client Apollo
  }, []);

  if (!client) {
    return null; // Ou tu peux afficher un écran de chargement
  }



  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
       <AuthStack />
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
