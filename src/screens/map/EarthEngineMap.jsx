import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, } from 'react-native';
import { WebView } from 'react-native-webview';
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon";

import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";


const Map = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState('rainfall'); // Initial analysis value

  useEffect(() => {
    // Logic for handling WebView load success or failure can be added here
  }, []);

  const onNavigationStateChange = (navState) => {
    if (navState.loading === false) {
      setLoading(false); // Set loading to false when the WebView finishes loading
    }
  };

  const handleAnalysisChange = (value) => {
    setAnalysis(value);
    setLoading(true);
  };

  const mapHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        #map-container {
          height: 1000px;
          width: 100%;
          background-color: #eee;
        }
        body{
          margin: 0;
          padding: 0;
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

          const embeddedMap = L.map(mapContainerEl).setView([-2.5489, 118.0149], 5); // Zoom to Indonesia

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(embeddedMap);

          const tileSource = new ee.layers.EarthEngineTileSource({
            mapId
          });
          L.tileLayer(urlFormat).addTo(embeddedMap);
        };

        fetch("http://192.168.15.241:4000/api/gee/${analysis}")
          .then((response) => response.json())
          .then((data) => initialize(data.mapId.mapid, data.mapId.urlFormat))
          .catch((err) => console.error('Error loading map:', err));
      </script>
    </body>
  </html>
`;

  return (
    <View style={styles.container}>


      {/* WebView to display map */}
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.webview}
        onNavigationStateChange={onNavigationStateChange}
      />

      {/* Dropdown to select analysis type */}
      <FormControl isRequired className='m-5'>
        <FormControlLabel>
          <FormControlLabelText>Pilih citra</FormControlLabelText>
        </FormControlLabel>
        <Select onValueChange={handleAnalysisChange}>
          <SelectTrigger>
            <SelectInput placeholder="Pilihan citra" className="flex-1 py-2" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Curah Hujan" value="rainfall" />
                <SelectItem label="Suhu Permukaan" value="temperature" />
                <SelectItem label="Jenis Tanah" value="soiltype" />
                <SelectItem label="pH Tanah" value="soilph" isDisabled={true} />
                <SelectItem label="Ketinggian" value="elevation" />
              </SelectContent>
          </SelectPortal>
        </Select>
        <FormControlHelper>
          <FormControlHelperText>You can only select one option</FormControlHelperText>
        </FormControlHelper>
        <FormControlError><FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>Mandatory field</FormControlErrorText></FormControlError>
      </FormControl>
      {/* Loading indicator */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Error message */}
      {error && (
        <View style={styles.error}>
          <Text>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  loader: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] },
  error: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  select: { margin: 10 }, // Add some margin for the select component
});

export default Map;
