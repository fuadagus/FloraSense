import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiZnVhZGFndXNzYWxpbSIsImEiOiJjbGcyZ2Q1ZXMwMHZ2M2RuMW9uOHZ0cDNoIn0.odEIHnmRUwKd2wUq_nBowQ');

const Map = () => {
  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
      {/* <Text>Map</Text> */}

        <MapboxGL.Camera
          zoomLevel={12}
          centerCoordinate={[ 110.3777, -7.7709]} // Replace with your coordinates
        />
        {/* Add layers, markers, or shapes here */}
      </MapboxGL.MapView>
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
