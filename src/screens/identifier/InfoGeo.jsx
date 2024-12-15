// Make a component to display the information of the plant and geolocation using capacitor geolocation
//
import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Text } from 'react-native-svg';
import { View } from 'lucide-react-native';
import { Alert } from '@/components/ui';

const InfoGeo = () => {
    const [location, setLocation] = useState({latitude: 0, longitude: 0});

    useEffect(() => {
        const getCurrentPosition = async () => {
            const coordinates = await Geolocation.getCurrentPosition();
            setLocation({
                latitude: coordinates.coords.latitude,
                longitude: coordinates.coords.longitude,
            });
        };

        getCurrentPosition();
    }, []);

    return (
        <View>
            <Alert title="Geolocation" message="This component displays the geolocation of the device." />
            {/* <h1>{plant.name}</h1>
            <p>{plant.description}</p> */}
            {location ? (
             
           
                <Text>
                    Geolocation: {location.latitude}, {location.longitude}
                </Text>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

export default InfoGeo;