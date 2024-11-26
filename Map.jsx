import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Picker } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Config from "react-native-config";

const PUBLIC_ACCESS_TOKEN = Config.PUBLIC_ACCESS_TOKEN;

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
  const [geojson, setGeojson] = useState(null); // State to store GeoJSON data
  const [loading, setLoading] = useState(true); // State to show loading indicator
  const [commonNames, setCommonNames] = useState([]); // State to store unique common names
  const [selectedCommonName, setSelectedCommonName] = useState(''); // Selected common name for filtering

  // Fetch observations and convert to GeoJSON
  const fetchObservations = async () => {
    try {
      const response = await fetch('https://flora-sense-backend-1cju0ogz9.vercel.app/api/observations');
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
            coordinates: [observation.longitude, observation.latitude], // Ensure correct order: [long, lat]
          },
          properties: {
            id: observation.id,
            scientificName: observation.scientificName,
            commonName: observation.commonName, // Store common name
          },
        })),
      };
      setGeojson(geojsonData); // Set GeoJSON data
      setLoading(false); // Stop loading indicator
    } catch (error) {
      console.error("Error fetching observations:", error);
      Alert.alert("Error", "Failed to fetch observation data.");
      setLoading(false);
    }
  };

  // Fetch unique common names
  const fetchCommonNames = async () => {
    try {
      const response = await fetch('https://flora-sense-backend-1cju0ogz9.vercel.app/api/taxonomy/common-names');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCommonNames(data.data); // Store common names
    } catch (error) {
      console.error("Error fetching common names:", error);
      Alert.alert("Error", "Failed to fetch common names.");
    }
  };

  // Filter observations by selected common name
  const filteredGeojson = geojson
    ? {
        type: "FeatureCollection",
        features: geojson.features.filter(
          (feature) => feature.properties.commonName === selectedCommonName
        ),
      }
    : null;

  // Fetch data on component mount
  useEffect(() => {
    fetchObservations(); // Fetch observation data
    fetchCommonNames(); // Fetch unique common names
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
      ) : (
        <View style={{ flex: 1 }}>
          {/* Dropdown for selecting common name */}
          <Picker
            selectedValue={selectedCommonName}
            onValueChange={(itemValue) => setSelectedCommonName(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Common Name" value="" />
            {commonNames.map((commonName, index) => (
              <Picker.Item key={index} label={commonName} value={commonName} />
            ))}
          </Picker>

          {/* Mapbox Map */}
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[110.3777, -7.7709]} // Adjust to fit your data
            />

            {/* Render filtered GeoJSON data as a layer */}
            {filteredGeojson && (
              <MapboxGL.ShapeSource id="observations" shape={filteredGeojson}>
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
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default Map;
