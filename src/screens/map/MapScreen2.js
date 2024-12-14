import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { TileLayer } from 'react-native-maps';
import { fetch } from 'react-native-fetch';
import { Select } from '@/components/ui/select';

const MapScreen = () => {
  const [mapId, setMapId] = useState(null);
  const [urlFormat, setUrlFormat] = useState(null);
  const [analysis, setAnalysis] = useState('rainfall');

  useEffect(() => {
    const fetchMapId = async () => {
      try {
        const response = await fetch(`http://192.168.15.241:4000/api/gee/${analysis}`);
        const data = await response.json();
        setMapId(data.mapId.mapid);
        setUrlFormat(data.mapId.urlFormat);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMapId();
  }, [analysis]);

  return (
    <View style={styles.container}>
      <Select
        selectedValue={analysis}
        onValueChange={(itemValue) => setAnalysis(itemValue)}
      >
        <Select.Item label="Rainfall" value="rainfall" />
        <Select.Item label="Temperature" value="temperature" />
        <Select.Item label="Vegetation" value="vegetation" />
      </Select>
      {mapId && urlFormat && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 36.2841,
            longitude: -112.8598,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <TileLayer
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <TileLayer
            urlTemplate={urlFormat}
            attribution="Map data &copy; Google Earth Engine"
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;