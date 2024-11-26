import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Config from "react-native-config";

const PUBLIC_ACCESS_TOKEN = Config.PUBLIC_ACCESS_TOKEN;

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
  const [geojson, setGeojson] = useState(null); // State to store GeoJSON data
  const [loading, setLoading] = useState(true); // State to show loading indicator

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

  useEffect(() => {
    fetchObservations(); // Fetch data on component mount
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
      ) : (
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={[110.3777, -7.7709]} // Adjust to fit your data
          />

          {/* Render GeoJSON data as a layer */}
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
});

export default Map;
