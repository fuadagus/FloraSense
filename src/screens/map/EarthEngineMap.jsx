import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

const PUBLIC_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

MapboxGL.setAccessToken(PUBLIC_ACCESS_TOKEN);

const Map = () => {
  const [tileUrl, setTileUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.15.241:4000/gee/test")
      .then((response) => response.json())
      .then((data) => {
        setTileUrl(data.tile_url);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tile URL:", error);
        setLoading(false);
      });
  }, []);

 
console.log("Tile URL: ", tileUrl);


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={2} centerCoordinate={[0, 0]} />
          <MapboxGL.RasterSource id="gee" tileUrlTemplates={[tileUrl]}>
            <MapboxGL.RasterLayer id="gee-layer" />
          </MapboxGL.RasterSource>
        </MapboxGL.MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default Map;
