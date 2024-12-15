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
    PermissionsAndroid
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { HStack, Icon, Image, Link, LinkText, Card, Text, Heading, ArrowRightIcon } from '@/components/ui';

import Config from "react-native-config";
import { Geolocation } from '@capacitor/geolocation';

const API_URL = Config.API_URL;
const API_KEY = Config.API_KEY;

const HomeScreen = ({ navigation }) => {
    const [locations, setLocations] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Fungsi untuk meminta izin lokasi
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Geolocation Permission',
                    message: 'Can we access your location?',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error('Error requesting location permission:', err);
            return false;
        }
    };

    const getLocation = async () => {
        console.log('Requesting location permission...');

        const permissionGranted = await requestLocationPermission();
        if (permissionGranted) {
            console.log('Permission granted. Fetching location...');
            const coordinates = await Geolocation.getCurrentPosition();
            // Geolocation.getCurrentPosition(
            //     position => {
            //         setLocations(position.coords);
            //         console.log('Location fetched successfully:', position.coords);
            //     },
            //     error => {
            //         console.error('Error fetching location:', error.code, error.message);
            //         Alert.alert('Error', `Unable to fetch location: ${error.message}`);
            //     },
            //     { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
            // );
            // Geolocation.getLocation(
            //     position => {
            //         console.log('Location updated:', position.coords);
            //         setLocations(position.coords);
            //     },
            //     error => {
            //         console.error('Error watching position:', error.code, error.message);
            //         Alert.alert('Error', `Unable to fetch location: ${error.message}`);
            //     },
            //     { enableHighAccuracy: true, distanceFilter: 0 }
            // );
            

            console.log('Current position:', coordinates);
            
        } else {
            console.log('Permission denied.');
            Alert.alert('Permission Denied', 'Location permission is required to fetch location.');
        }
    };
    
    // Fungsi untuk meluncurkan kamera
    const handleCameraLaunch = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.didCancel) {
            Alert.alert('Cancelled', 'Camera action cancelled.');
        } else if (result.assets) {
            setSelectedImages(result.assets);
            identifyPlant(result.assets);
        } else {
            Alert.alert('Error', 'Failed to access the camera.');
        }
    };

    // Fungsi untuk identifikasi tanaman
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

        formData.append('organs', 'auto');

        if (locations) {
            formData.append('latitude', locations.latitude);
            formData.append('longitude', locations.longitude);
        }

        const url = `${API_URL}?api-key=${API_KEY}`;

        try {
            const response = await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setResults(response.data.results || []);
            setModalVisible(true);
        } catch (error) {
            console.error('Error identifying plant:', error);
            Alert.alert('Error', 'Failed to identify the plant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Card variant='outline' className="p-5 rounded-lg max-w-[360px] m-3">
                <TouchableOpacity onPress={handleCameraLaunch}>
                    <Image
                        source={require('@/src/assets/Identification.webp')}
                        className="mb-6 h-[240px] w-full rounded-md aspect-[263/240]"
                        alt="image"
                    />
                </TouchableOpacity>
                <Text className="text-sm font-normal mb-2 text-typography-700 max-w-[280px]">
                    Kenali tanaman di sekitar Anda dengan cepat dan mudah menggunakan teknologi AI
                </Text>
                <Link
                    href=""
                    onPress={() => navigation.navigate('AdvanceScreen', { mode: 'advance' })}
                    isExternal
                >
                    <HStack className="items-center">
                        <LinkText size="sm" className="font-semibold text-info-600 no-underline">
                            Mode Lanjut
                        </LinkText>
                        <Icon as={ArrowRightIcon} size="sm" className="text-info-600 mt-0.5 ml-0.5" />
                    </HStack>
                </Link>
                <Heading size="md" className="mb-4">
                    Identifikasi Tanaman
                </Heading>
            </Card>

            <View style={styles.locationContainer}>
                <Button title="Get Location" onPress={getLocation} />
                {locations && (
                    <>
                        <Text>Latitude: {locations.latitude}</Text>
                        <Text>Longitude: {locations.longitude}</Text>
                    </>
                )}
            </View>

            <Modal visible={modalVisible} transparent={false} animationType="slide">
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
                                <Text>Scientific Name: {item.species?.scientificName || 'N/A'}</Text>
                                <Text>Common Names: {item.species?.commonNames?.join(', ') || 'N/A'}</Text>
                                <Text>Confidence Score: {(item.score * 100).toFixed(2)}%</Text>
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
    container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
    locationContainer: { marginTop: 20, padding: 10 },
});

const modalStyles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    result: { padding: 10, marginVertical: 5, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
    resultImage: { width: '100%', height: 200, resizeMode: 'contain' },
});

export default HomeScreen;
