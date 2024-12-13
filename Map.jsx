import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing tokens
import MapboxGL from '@rnmapbox/maps';
import { Dropdown } from 'react-native-element-dropdown'; // You can use this or FlatList
import Config from "react-native-config";

const PUBLIC_ACCESS_TOKEN = Config.PUBLIC_ACCESS_TOKEN;

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
  const [geojson, setGeojson] = useState(null); // GeoJSON data
  const [loading, setLoading] = useState(false); // Loading indicator
  const [commonNames, setCommonNames] = useState([]); // Dropdown data
  const [selectedCommonName, setSelectedCommonName] = useState(null); // Selected common name
  const [scientificName, setScientificName] = useState(''); // To store scientific name fetched

  // Fetch unique common names
  const fetchCommonNames = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch('http://192.168.0.100:3000/api/taxonomy/common-names', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCommonNames(
        data.data.map((name) => ({
          label: name, // Dropdown display label
          value: name, // Dropdown value
        }))
      );
    } catch (error) {
      console.error("Error fetching common names:", error);
      Alert.alert("Error", error.message || "Failed to fetch common names.");
    }
  };

  // Fetch scientific name by common name
  const fetchScientificName = async (commonName) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`http://192.168.0.100:3000/api/taxonomy/scientific-name?commonName=${commonName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.scientificName;
    } catch (error) {
      console.error("Error fetching scientific name:", error);
      Alert.alert("Error", error.message || "Failed to fetch scientific name.");
      return null;
    }
  };

  // Fetch observations by scientific name
  const fetchObservationsByName = async (scientificName) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Retrieve token from storage
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`http://192.168.0.100:3000/api/observations?scientificName=${scientificName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token to header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const geojsonData = {
        type: "FeatureCollection",
        features: data.data.map((observation) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [observation.longitude, observation.latitude], // Correct order
          },
          properties: {
            id: observation.id,
            scientificName: observation.scientificName,
            commonName: observation.commonName,
          },
        })),
      };
      setGeojson(geojsonData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching observations by name:", error);
      Alert.alert("Error", error.message || "Failed to fetch observation data.");
      setLoading(false);
    }
  };

  // Fetch common names on initial load
  useEffect(() => {
    fetchCommonNames();
  }, []);

  // When common name is selected, fetch the corresponding scientific name and load observations
  useEffect(() => {
    if (selectedCommonName) {
      setLoading(true);
      fetchScientificName(selectedCommonName).then((scientificName) => {
        if (scientificName) {
          setScientificName(scientificName); // Set scientific name
          fetchObservationsByName(scientificName); // Fetch observations by scientific name
        } else {
          setLoading(false);
        }
      });
    }
  }, [selectedCommonName]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Dropdown for selecting common name */}
          <Dropdown
            style={styles.dropdown}
            data={commonNames}
            labelField="label"
            valueField="value"
            placeholder="Select Common Name"
            value={selectedCommonName}
            onChange={(item) => setSelectedCommonName(item.value)} // Update selected value
          />

          {/* Mapbox Map */}
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[110.3777, -7.7709]} // Adjust as per your data
            />

            {/* Render filtered GeoJSON data */}
            {geojson && (
              <MapboxGL.ShapeSource id="observations" shape={geojson}>
                <MapboxGL.CircleLayer
                  id="observations-layer"
                  style={{
                    circleRadius: 6,
                    circleColor: "#007cbf",
                  }}
                />
              </MapboxGL.ShapeSource>
            )}
          </MapboxGL.MapView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    margin: 10,
  },
});

export default Map;
