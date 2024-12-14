import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing tokens
import MapboxGL from '@rnmapbox/maps';
import { Dropdown } from 'react-native-element-dropdown'; // You can use this or FlatList
import Config from "react-native-config";

const PUBLIC_ACCESS_TOKEN = Config.PUBLIC_ACCESS_TOKEN;

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
 

  return (
    <View style={styles.container}>
     
          {/* Mapbox Map */}
          <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={[110.3777, -7.7709]} // Adjust as per your data
            />
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
