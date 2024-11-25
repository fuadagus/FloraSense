import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import Config from "react-native-config";

const API_URL = Config.API_URL;
const API_KEY = Config.API_KEY;

const AdvanceScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState('id'); // Default language
  const [organ, setOrgan] = useState('leaf'); // Default organ

  const languages = [
    { label: 'Bahasa Indonesia', value: 'id' },
    { label: 'English', value: 'en' },
  ];

  const organs = [
    { label: 'Leaf', value: 'leaf' },
    { label: 'Flower', value: 'flower' },
    { label: 'Fruit', value: 'fruit' },
    { label: 'Bark', value: 'bark' },
  ];

  // Function to pick images from the gallery
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 5 });
    if (result.assets) {
      setSelectedImages(result.assets.map(image => ({ ...image, organ: 'leaf' })));
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 1 });
    if (result.assets) {
      setSelectedImages(result.assets.map(image => ({ ...image, organ: 'leaf' })));
    }
  };

  // Function to identify the plant using Pl@ntNet API
  const identifyPlant = async () => {
    if (selectedImages.length === 0) return alert('Please select images first!');

    setLoading(true);

    const formData = new FormData();
    selectedImages.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || `photo${index}.${image.type.split('/')[1]}`,
      });
      console.log('organ image:', image.organ);
      formData.append('organs', image.organ); // Specify the plant part for each image
    });

    const params = {
      'include-related-images': true, // Include related images
      'no-reject': false, // Show results even if reject class matches
      'nb-results': 10, // Maximum number of species in the results
      lang: language, // Use selected language
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}?api-key=${API_KEY}&${queryString}`;

    try {
      const response = await axios.post(url, formData, {
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
      <View>
        <Dropdown
          style={styles.dropdown}
          data={languages}
          labelField="label"
          valueField="value"
          placeholder="Pilih Bahasa"
          value={language}
          onChange={(item) => setLanguage(item.value)}
        />

        <Button title="Pilih gambar tanaman" onPress={pickImage} />
      </View>

      <ScrollView>
        {selectedImages.length > 0 && selectedImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: image.uri }}
              style={styles.imagePreview}
            />
            <Dropdown
              style={styles.dropdown}
              data={organs}
              labelField="label"
              valueField="value"
              placeholder="Pilih Organ"
              value={image.organ}
              onChange={(item) => {
                const newSelectedImages = [...selectedImages];
                newSelectedImages[index].organ = item.value;
                setSelectedImages(newSelectedImages);
              }}
            />
          </View>
        ))}
      </ScrollView>
      <Button title="Identifikasi tanaman" onPress={identifyPlant} />
      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.result}>
            {item.images && item.images.length > 0 && (
              <Image
                source={{ uri: item.images[0].url.s }}
                style={styles.resultImage}
              />
            )}
            <Text style={styles.resultText}>
              Nama ilmiah: {item.species && item.species.scientificName}
            </Text>
            <Text style={styles.resultText}>
              Nama umum:{' '}
              {item.species && item.species.commonNames.length > 0
                ? item.species.commonNames.join(', ')
                : '-'}
            </Text>
            <Text style={styles.resultText}>
              Skor kepercayaan: {(item.score * 100).toFixed(2)}%
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
  dropdown: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  result: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
});

export default AdvanceScreen;
