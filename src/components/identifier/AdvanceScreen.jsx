import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';

const AdvanceScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState('id'); // Default language
  const [imageCount, setImageCount] = useState(1); // Default to one image
  const [mode, setMode] = useState(''); // Mode selection
  const [organ, setOrgan] = useState('leaf'); // Default organ

  const API_KEY = '2b10qZDQL5xzHdc9c2b5mKZ4ku'; // Replace with your API key
  const API_URL = 'https://my-api.plantnet.org/v2/identify/all';

  const languages = [
    { label: 'Bahasa Indonesia', value: 'id' },
    { label: 'English', value: 'en' },
  ];

  const imageCounts = [
    { label: '1 Image', value: 1 },
    { label: '5 Images', value: 5 },
  ];

  const organs = [
    { label: 'Leaf', value: 'leaf' },
    { label: 'Flower', value: 'flower' },
    { label: 'Fruit', value: 'fruit' },
    { label: 'Bark', value: 'bark' },
  ];

  // Function to pick images from the gallery
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: imageCount });
    if (result.assets) {
      setSelectedImages(result.assets);
    }
  };

  // Function to take a photo using the camera
  const takePhoto = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 1 });
    if (result.assets) {
      setSelectedImages(result.assets);
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
    });
    formData.append('organs', organ); // Specify the plant part

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

      console.log('Respons API Lengkap:', response.data.results[0]);

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

      {mode === '' && (
        <View style={styles.modeSelection}>
          <TouchableOpacity style={styles.card} onPress={() => { setMode('oneClick'); setImageCount(1); setOrgan('leaf'); }}>
            <Text style={styles.cardText}>One Click</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setMode('advance')}>
            <Text style={styles.cardText}>Advance</Text>
          </TouchableOpacity>
        </View>
      )}

      {mode === 'oneClick' && (
        <View>
          <Button title="Take Photo" onPress={takePhoto} />
          <Button title="Pick Image from Gallery" onPress={pickImage} />
          <Button title="Back" onPress={() => setMode('')} />
        </View>
      )}

      {mode === 'advance' && (
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

          <Dropdown
            style={styles.dropdown}
            data={imageCounts}
            labelField="label"
            valueField="value"
            placeholder="Pilih Jumlah Gambar"
            value={imageCount}
            onChange={(item) => setImageCount(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={organs}
            labelField="label"
            valueField="value"
            placeholder="Pilih Organ"
            value={organ}
            onChange={(item) => setOrgan(item.value)}
          />

          <Button title="Pilih gambar tanaman" onPress={pickImage} />
          <Button title="Back" onPress={() => setMode('')} />
        </View>
      )}

      {selectedImages.length > 0 && selectedImages.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.uri }}
          style={styles.imagePreview}
        />
      ))}
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
  resultImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
  modeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  card: {
    width: '40%',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdvanceScreen;