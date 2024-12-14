// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Modal,
    Button,
    ActivityIndicator,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { HStack, Icon, Image, Link, LinkText, Card, Text, Heading, ArrowRightIcon } from '@/components/ui';
// import { API_KEY, API_URL } from '@env';

import Config from "react-native-config";
import ThumbnailCard from '../../components/cards/ThumbnailCard';

const API_URL = Config.API_URL;
const API_KEY = Config.API_KEY;


const HomeScreen = ({ navigation }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // const API_KEY = '2b10qZDQL5xzHdc9c2b5mKZ4ku'; // Replace with your actual API key
    // const API_URL = 'https://my-api.plantnet.org/v2/identify/all';

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
            <Card className="p-5 rounded-lg max-w-[360px] m-3">
                <TouchableOpacity

                    onPress={() => handleCameraLaunch()}
                >
                    <Image
                        source={require('@/src/assets/Identification.webp')}
                        className="mb-6 h-[240px] w-full rounded-md aspect-[263/240]"
                        alt="image"
                    />
                </TouchableOpacity>
                <Text className="text-sm font-normal mb-2 text-typography-700 max-w-[280px]">
                    Kenali tanaman di sekitar Anda dengan cepat dan mudah menggunakan teknologi AI
                </Text>
                <Link href="" onPress={() => navigation.navigate('AdvanceScreen', { mode: 'advance' })} isExternal >
                    <HStack className="items-center">
                        <LinkText
                            size="sm"
                            className="font-semibold text-info-600 no-underline"
                        >
                            Mode Lanjut
                        </LinkText>
                        <Icon
                            as={ArrowRightIcon}
                            size="sm"
                            className="text-info-600 mt-0.5 ml-0.5"
                        />
                    </HStack>
                </Link>
                <Heading size="md" className="mb-4">
                    Identifikasi Tanaman
                </Heading>
            </Card>


            {/* <Text style={styles.title}>Identifikasi Tanaman</Text> */}

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalStyles.container}>
                    <FlatList
                        data={results}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={modalStyles.result}>
                                {item.images && item.images.length > 0 && (
                                    <Image
                                        source={{ uri: item.images[0].url.s }}
                                        style={modalStyles.resultImage}
                                    />
                                )}
                                <Text style={modalStyles.resultText}>
                                    Scientific Name: {item.species?.scientificName || 'N/A'}
                                </Text>
                                <Text style={modalStyles.resultText}>
                                    Common Names:{' '}
                                    {item.species?.commonNames?.length
                                        ? item.species.commonNames.join(', ')
                                        : 'N/A'}
                                </Text>
                                <Text style={modalStyles.resultText}>
                                    Confidence Score: {(item.score * 100).toFixed(2)}%
                                </Text>
                            </View>
                        )}
                    />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
            {loading && <ActivityIndicator size="large" color="#00ff00" />}

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modeSelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
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

const modalStyles = StyleSheet.create({
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

export default HomeScreen;
