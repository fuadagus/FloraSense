import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, ActivityIndicator, FlatList } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const PlantIdentifier = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const API_KEY = '2b10qZDQL5xzHdc9c2b5mKZ4ku'; // Replace with your API key
  const API_URL = 'https://my-api.plantnet.org/v2/identify/all';

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (result.assets && result.assets[0]) {
      setSelectedImage(result.assets[0]);
    }
  };

  // Function to identify the plant using Pl@ntNet API
  const identifyPlant = async () => {
    if (!selectedImage) return alert('Please select an image first!');

    setLoading(true);

    const formData = new FormData();
    formData.append('images', {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName || `photo.${selectedImage.type.split('/')[1]}`,
    });
    formData.append('organs', 'leaf'); // Specify the plant part (e.g., leaf, flower, fruit)

    try {
      const response = await axios.post(`${API_URL}?api-key=${API_KEY}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error identifying plant:', error);
      alert('Failed to identify the plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identifikasi Tanaman</Text>
      <Button title="Pilih gambar tanaman" onPress={pickImage} />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={styles.imagePreview}
        />
      )}
      <Button title="Identifikasi tanaman" onPress={identifyPlant} />
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              {item.species && item.species.scientificName}
            </Text>
            <Text style={styles.resultText}>
              Confidence: {(item.score * 100).toFixed(2)}%
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },
  result: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
  },
});

export default PlantIdentifier;
