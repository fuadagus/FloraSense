import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
// import {PUBLIC_ACCESS_TOKEN } from '@env';
import Config from "react-native-config";

const PUBLIC_ACCESS_TOKEN  = Config.PUBLIC_ACCESS_TOKEN ;
const API_KEY = Config.API_KEY; 

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
  console.log('PUBLIC_ACCESS_TOKEN:', PUBLIC_ACCESS_TOKEN);
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
