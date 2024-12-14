import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const EEMap = () => {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          #map-container {
            height: 100%;
            width: 100%;
            background-color: #eee;
          }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>
        <div id="map-container"></div>
        <script src="https://ajax.googleapis.com/ajax/libs/earthengine/0.1.226/earthengine-api.min.js"></script>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const initialize = (mapId, urlFormat) => {
            const mapContainerEl = document.getElementById("map-container");

            const embeddedMap = L.map(mapContainerEl).setView([36.2841, -112.8598], 9);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(embeddedMap);

            const tileSource = new ee.layers.EarthEngineTileSource({
              mapId
            });
            L.tileLayer(urlFormat).addTo(embeddedMap);
          };

          fetch("http://192.168.15.241:4000/api/gee/test")
            .then((response) => response.json())
            .then((data) => initialize(data.mapId.mapid, data.mapId.urlFormat));
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.webView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default EEMap;
