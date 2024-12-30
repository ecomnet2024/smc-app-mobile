import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Modal,Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Alert } from 'react-native';
import { ADD_FEEDBACK } from '../../../src/Screens/graphql/Mutation';
import { GET_FEDDBACK } from '../../../src/Screens/graphql/Queries';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';


const FeedbackScreen = ({ route }) => {

  const { consultation } = route.params;
  const consultationID = consultation._id;
 // States
 const [newFeedback, setNewFeedback] = useState('');
 //const [selectedFeedbackType, setSelectedFeedbackType] = useState('doctor_feedback');
 const [tableData, setTableData] = useState([]);
 const [currentUserId, setCurrentUserId] = useState(null);

 const selectedFeedbackType = 'doctor_feedback';

 
 // Queries and Mutations
 const { data, loading, error, refetch } = useQuery(GET_FEDDBACK, {
   variables: { id: consultationID },
 });

 console.log('Fetched data:', data?.consultationById);

 const [addFeedback, { loading: mutationLoading }] = useMutation(ADD_FEEDBACK, {
   onCompleted: () => {
     Alert.alert('Success', 'Feedback added successfully!');
     refetch();
   },
   onError: (err) => {
     Alert.alert('Error', err.message);
     console.log('Error adding feedback:', err.message);
   },
 });

 useEffect(() => {
  if (data?.consultationById) {
    const combinedFeedback = [
      ...(data.consultationById.doctor_feedback || []),
      ...(data.consultationById.call_center_feedback || []).map(feedback => ({
        ...feedback,
      user: feedback.user || { first_name: 'Anonymous' },
    })),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    setTableData(combinedFeedback);
  }
}, [data]);


const getDoctorIdFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log("Token_present",token);
    if (token) {
      const tokenString = String(token)
      const decodedToken = jwtDecode(tokenString);
      const doctorId = decodedToken.user_id;
      console.log("token decode",decodedToken);
      return doctorId;
    } else {
      console.error("Token not found");
      return null;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

useEffect(() => {
  const fetchCurrentUserId = async () => {
    const userId = await getDoctorIdFromToken(); // Récupère l'ID de l'utilisateur connecté
    setCurrentUserId(userId);
    console.log("Current User ID:", userId);
  };
  fetchCurrentUserId();
}, []);


 const handleAddFeedback = async () => {
   if (!newFeedback.trim()) {
     Alert.alert('Validation Error', 'Please enter a feedback message.');
     return;
   }
   const medical_staff_Id = await getDoctorIdFromToken();

   if (!medical_staff_Id || !consultationID) {
    Alert.alert('Error', 'User or Consultation ID is missing or invalid.');
    return;
  }
  if (!medical_staff_Id.match(/^[a-f\d]{24}$/i)) {
    Alert.alert('Error', 'Invalid user ID.');
    return;
  }

  const existingFeedback = data?.consultationById?.[selectedFeedbackType]?.map(({ __typename, user, ...rest }) => ({
    ...rest,
    user: user?._id || null, // Assurez-vous que seuls les IDs sont envoyés
  })) || [];

  console.log("medical_staff_Id:", medical_staff_Id);
  console.log(' data corrigees:', existingFeedback);

  const newFeedbackObject = {
    comment: newFeedback,
    createdAt: new Date().toISOString(),
    user: medical_staff_Id,
  };


  console.log("Payload for mutation:", {
    id: consultationID,
    record: {
      [selectedFeedbackType]: [...existingFeedback, newFeedbackObject],
    },
  });  

  try {
    await addFeedback({
      variables: {
        id: consultationID,
        record: {
          [selectedFeedbackType]: [...existingFeedback, newFeedbackObject],
        },
      },
    });
    setNewFeedback(''); // Réinitialiser le champ d'entrée après ajout

  } catch (err) {
    console.error(err.message);
    Alert.alert('Error', error.message);
  }
 };

 const renderFeedback = ({ item }) => {

  // Vérifiez si l'utilisateur connecté a envoyé le message
  const isCurrentUser = item.user?._id === currentUserId;
  console.log('User Data:', item.user);

  console.log("Feedback User ID:", item.user?._id, "isCurrentUser:", isCurrentUser);
  const userImageUri = item.user?.image
    ? item.user.image
    : 'https://via.placeholder.com/50'; // Image par défaut si aucune n'est définie


  return (
    <View style={[styles.feedbackCard, isCurrentUser && styles.currentUserFeedbackCard]}>
      <View style={styles.feedbackHeader}>
        <Image
          source={{ uri: userImageUri }} // Remplacez par l'URL réelle
          style={styles.userImage}
          onError={(error) => console.error('Image Load Error:', error.nativeEvent.error)}
        />
        <Text style={[styles.userName, isCurrentUser && styles.currentUserFeedbackText]}>
          {item.user?.first_name || 'Anonymous'}
        </Text>
      </View>
      <Text style={[styles.feedbackComment, isCurrentUser && styles.currentUserFeedbackText]}>
        {item.comment}
      </Text>
      <Text style={[styles.feedbackDate, isCurrentUser && styles.currentUserFeedbackDate]}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );
 };


 if (loading) return <View><Text>Loading...</Text></View>;
 if (error) return <View><Text>Error: {error.message}</Text></View>;



 return (
   <View style={styles.container}>
     <FlatList
       data={tableData}
       keyExtractor={(item, index) => `${item.createdAt}-${index}`}
       renderItem={(item) => {
        console.log("FlatList item:", item);
        return renderFeedback(item);
      }}
       ListEmptyComponent={<Text style={styles.noDataText}>No feedback yet</Text>}
     />

     <View style={styles.inputContainer}>
       <TextInput
         style={styles.input}
         placeholder="Write here..."
         value={newFeedback}
         onChangeText={setNewFeedback}
       />
       <TouchableOpacity
         style={styles.addButton}
         onPress={handleAddFeedback}
         disabled={mutationLoading}
       >
         <Text style={styles.addButtonText}>{mutationLoading ? 'Adding...' : 'Add'}</Text>
         <FontAwesome name="paper-plane" size={18} color="#fff" />
       </TouchableOpacity>
     </View>
   </View>
 );
};


export default FeedbackScreen

const styles = StyleSheet.create({ 
  container: {
  flex: 1,
  padding: 10,
  backgroundColor: '#f9f9f9',
},
feedbackCard: {
  backgroundColor: '#fff',
  padding: 15,
  borderRadius: 10,
  marginBottom: 10,
  elevation: 2,
},
feedbackHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
userImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
  borderWidth: 1,
  borderColor: '#ccc', // Optionnel : ajout d'une bordure
  backgroundColor: '#f0f0f0', // Couleur de fond par défaut si l'image ne charge pas
},
userName: {
  fontSize: 16,
  fontWeight: 'bold',
},
feedbackComment: {
  fontSize: 14,
  color: '#333',
  marginBottom: 5,
},
feedbackDate: {
  fontSize: 12,
  color: '#999',
  textAlign: 'right',
},
noDataText: {
  textAlign: 'center',
  color: '#999',
  marginTop: 20,
},
inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderTopWidth: 1,
  borderTopColor: '#ccc',
},
input: {
  flex: 1,
  backgroundColor: '#fff',
  padding: 10,
  borderRadius: 5,
  marginRight: 10,
},
addButton: {
  backgroundColor: '#4CAF50',
  padding: 10,
  borderRadius: 5,
},
addButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
currentUserFeedbackCard: {
  backgroundColor: '#D9F1FF', // Bleu ciel léger
  borderColor: '#87CEEB',
  borderWidth: 1,
},
currentUserFeedbackText: {
  color: '#000000', // Texte noir
},
currentUserFeedbackDate: {
  color: '#333333', // Date légèrement grisée
},
})