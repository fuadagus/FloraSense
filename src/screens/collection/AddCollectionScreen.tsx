import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_API_URL = 'http://192.168.15.241:4000/auth/user';

const CreateArboretumForm = ({ navigation }) => {
  const [arboretumName, setArboretumName] = useState('');
  const [arboretumLocation, setArboretumLocation] = useState('');
  const [arboretumDescription, setArboretumDescription] = useState('');
  const [userData, setUserData] = useState(null); // Store fetched user data
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const getUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get token from AsyncStorage
      if (token) {
        const response = await axios.get(USER_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data); // Set user data to state
      } else {
        Alert.alert("Token not found, please login.");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Failed to fetch user data');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleSubmit = async () => {
    if (!arboretumName || !arboretumLocation || !arboretumDescription) {
      Alert.alert('All fields are required.');
      return;
    }
    if (!userData) {
      Alert.alert('User data is not loaded yet. Please try again later.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      console.log('User data:', userData);
      const response = await fetch('http://192.168.15.241:4000/api/arboretums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: arboretumName,
          location: arboretumLocation,
          description: arboretumDescription,
          userId: userData.user.id // Ensure userId is correctly passed
        })
      });

      if (response.ok) {
        Alert.alert('Arboretum created successfully!');
        navigation.goBack(); // Go back to the previous screen
      } else {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        Alert.alert('Failed to create arboretum');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Failed to create arboretum');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.title}>Create Arboretum</Text>
        <TextInput
          label="Nama Koleksi"
          style={styles.input}
          value={arboretumName}
          onChangeText={setArboretumName}
          mode="outlined"
          theme={{ colors: { primary: '#4CAF50' } }}
        />
        <TextInput
          label="Lokasi"
          style={styles.input}
          value={arboretumLocation}
          onChangeText={setArboretumLocation}
          mode="outlined"
          theme={{ colors: { primary: '#4CAF50' } }}
        />
        <TextInput
          label="Deskripsi"
          style={styles.input}
          value={arboretumDescription}
          onChangeText={setArboretumDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: '#4CAF50' } }}
        />
        <Button
          icon="content-save"
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          theme={{ colors: { primary: '#FFA500' } }} // Set the button background color to orange
          loading={loading} // Show loading spinner when submitting
          disabled={loading} // Disable button when loading
        >
          Save Arboretum
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollViewContainer: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  submitButton: {
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CreateArboretumForm;
