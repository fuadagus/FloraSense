import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Modal,
    Button,
    ActivityIndicator,
    StyleSheet,
    Alert,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import HomeScreen from './HomeScreen';

const OneClickScreen = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const API_KEY = '2b10qZDQL5xzHdc9c2b5mKZ4ku'; // Replace with your actual API key
    const API_URL = 'https://my-api.plantnet.org/v2/identify/all';

    useEffect(() => {
        handleCameraLaunch();
    }, []);

    const handleCameraLaunch = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.didCancel) {
            Alert.alert('Dibatalkan', 'Anda perlu mengambil foto untuk mengidentifikasi.');
            // Back to home stack
            navigation.navigate('Home'); // Assuming you have a navigation prop and a 'Home' route
        } else if (result.assets) {
            setSelectedImages(result.assets);
            identifyPlant(result.assets);
        } else {
            Alert.alert('Error', 'Failed to access the camera. Please try again.');
        }
    };

    const identifyPlant = async (images) => {
        setLoading(true);

        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append('images', {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `photo${index}.${image.type.split('/')[1]}`,
            });
        });

        // Adding the organs array to FormData
        formData.append('organs', 'auto'); // Adjust the value based on the API requirements

        // Other parameters (like language) can also be added if required in the request body
        // formData.append('lang', 'en'); // Example of adding another parameter

        const url = `${API_URL}?api-key=${API_KEY}`; // Only the API key as a query parameter

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResults(response.data.results || []);
            setModalVisible(true);
        } catch (error) {
            console.error('Error identifying plant:', error);
            alert('Failed to identify the plant. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.container}>
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
                                    Scientific Name: {item.species?.scientificName || 'N/A'}
                                </Text>
                                <Text style={styles.resultText}>
                                    Common Names:{' '}
                                    {item.species?.commonNames?.length
                                        ? item.species.commonNames.join(', ')
                                        : 'N/A'}
                                </Text>
                                <Text style={styles.resultText}>
                                    Confidence Score: {(item.score * 100).toFixed(2)}%
                                </Text>
                            </View>
                        )}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
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

export default OneClickScreen;
