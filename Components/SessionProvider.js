import React, { createContext, useEffect, useState, useRef } from 'react';
import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(59 * 60); 
  const navigation = useNavigation();
  const logoutTimer = useRef(null); // Utilise une référence mutable pour gérer le timer


  const TOKEN_EXPIRATION_TIME = 58 * 60 * 1000; // 58 minutes en millisecondes

   // Fonction pour déconnecter l'utilisateur
   const handleLogout = async () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current); // Arrête le timer
    setIsSessionExpired(true);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    Alert.alert(
      "Session Expired",
      "Your session has expired. Please log in again.",
      [
        {
          text: "OK",
          onPress: () => {
            setIsSessionExpired(false);
            navigation.navigate("Login"); // Redirige vers l'écran de login
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Fonction pour démarrer le minuteur
  const startSessionTimer = async () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current); // Réinitialise le timer si nécessaire
    setRemainingTime(59 * 60); // Réinitialise le temps restant à 59 minutes

    const expirationTime = Date.now() + TOKEN_EXPIRATION_TIME;
    await AsyncStorage.setItem('sessionExpiration', expirationTime.toString());

    logoutTimer.current = setTimeout(() => {
      handleLogout();
    }, TOKEN_EXPIRATION_TIME);
  };
  // Réinitialiser le minuteur lorsque l'utilisateur interagit avec l'application
  const resetSessionTimer = () => {
    startSessionTimer();
  };


   // Vérifier l'expiration de la session quand l'application revient en avant-plan
   const checkSessionExpiration = async () => {
    const storedExpiration = await AsyncStorage.getItem('sessionExpiration');
    if (storedExpiration) {
      const expirationTime = parseInt(storedExpiration, 10);
      if (Date.now() >= expirationTime) {
        handleLogout();
      } else {
        // Redémarrer le minuteur avec le temps restant
        const remainingTime = expirationTime - Date.now();
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
        logoutTimer.current = setTimeout(() => {
          handleLogout();
        }, remainingTime);
      }
    }
  };
  // Surveiller l'état de l'application
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkSessionExpiration();
      }
    });
    return () => subscription.remove();
  }, []);




// Affiche un log toutes les 5 minutes
useEffect(() => {
    const logInterval = setInterval(() => {
      console.log(`Temps restant avant déconnexion: ${Math.floor(remainingTime / 60)} min`);
    }, 10 * 60 * 1000); // Toutes les 10 minutes

    return () => clearInterval(logInterval); // Nettoie l'intervalle lorsque le composant est démonté
  }, [remainingTime]);

  // Gestion de l'effet global pour démarrer ou arrêter le minuteur
  useEffect(() => {
    startSessionTimer();

    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);


  return (
    <SessionContext.Provider value={{ resetSessionTimer, handleLogout }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
