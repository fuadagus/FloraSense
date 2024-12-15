import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Alert, } from 'react-native';
import { WebView } from 'react-native-webview';
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon";
import { HStack } from '@/components/ui';

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
import { Divider } from '@/components/ui';


const EarthEngineMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState('rainfall'); // Initial analysis value
  const [showBandSelection, setShowBandSelection] = useState(false);
  const [query, setQuery] = useState('rainfall');

  const [band, setBand] = useState('b0');
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  const [rasterValue, setRasterValue] = useState(null);


  useEffect(() => {
    // Logic for handling WebView load success or failure can be added here

    if (latLng.lat && latLng.lng) {
      console.log('Fetching raster value:', `http://192.168.15.241:4000/api/${analysis}-value?lat=${latLng.lat}&lon=${latLng.lng}&bandName=${band}`);

      fetch(`http://192.168.15.241:4000/api/${analysis}-value?lat=${latLng.lat}&lon=${latLng.lng}&bandName=${band}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let value;
            switch (analysis) {
            case 'rainfall':
              value = data.value.precipitation;
              break;
            case 'temperature':
              value = data.value.LST_Day_1km;
              break;
            case 'soil-type':
              value = data.value[band];
            case 'soil-ph':
              value = data.value[band];
              break;
            case 'elevation':
              value = data.value.elevation;
              break;
            default:
              value = null;
            }
            setRasterValue(value);
            console.log(`Nilai ${analysis} pada kedalaman ${band}: ${value}`);
        })
        .catch((err) => console.error('Error fetching raster value:', err));
    }
  }, [latLng, band]);

  const onNavigationStateChange = (navState) => {
    if (navState.loading === false) {
      setLoading(false); // Set loading to false when the WebView finishes loading
    }
  };

  const handleAnalysisChange = (value) => {
    setAnalysis(value);
    setQuery(value);
    setLoading(true);
    if (value === 'soil-type' || value === 'soil-ph') {
      setShowBandSelection(true);
      setQuery(`${analysis}?bandName=b0`);
    } else {
      setShowBandSelection(false);
    }
  };

  const handleBandChange = (value) => {

    setBand(value);
    setQuery(`${analysis}?bandName=${value}`);
  };

  const mapHTML = `
  <!DOCTYPE html>
  <html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

      <style>
        #map-container {
          height: 100%;
          width: 100%;
          background-color: #eee;
        }
        body{
          margin: 0;
          padding: 0;
          height: 100vh;
        }
        .leaflet-control-locate {
          background-color: white;
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 4px;
          cursor: pointer;
          padding: 5px;
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

          const embeddedMap = L.map(mapContainerEl).setView([-2.5489, 118.0149], 3); // Zoom to Indonesia

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(embeddedMap);

          const tileSource = new ee.layers.EarthEngineTileSource({
            mapId
          });
          L.tileLayer(urlFormat).addTo(embeddedMap);
          
          const marker = L.marker([-2.5489, 118.0149], { draggable: true }).addTo(embeddedMap);
          marker.on('dragend', function (e) {
            const { lat, lng } = e.target.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
          });

          // Add geolocation control
          const locateControl = L.control({ position: 'topright' });
          locateControl.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'leaflet-control-locate');
            div.innerHTML = '📍';
            div.onclick = function() {
              if (location.protocol === 'https:' || location.hostname === 'localhost') {
                map.locate({ setView: true, maxZoom: 16 });
              } else {
                alert('Geolocation is only available on secure origins (HTTPS) or localhost.');
              }
            };
            return div;
          };
          locateControl.addTo(embeddedMap);

          embeddedMap.on('locationfound', function(e) {
            const { lat, lng } = e.latlng;
            marker.setLatLng(e.latlng);
            window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
          });

          embeddedMap.on('locationerror', function(e) {
            alert(e.message);
          });
        };

        fetch("http://192.168.15.241:4000/api/gee/${query}")
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
        className='h-full'
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.webview}
        onNavigationStateChange={onNavigationStateChange}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data); // Parse the data received
          console.log('Latitude:', data.lat, 'Longitude:', data.lng);
          
          
          // You can use the data here, e.g., updating state
          setLatLng(data);
        }}
      />
      {/* <HStack className='p-5'>
  <Text>Latitude: {latLng.lat !== null ? latLng.lat.toFixed(4) : 'N/A'}, </Text>
  <Text>Longitude: {latLng.lng !== null ? latLng.lng.toFixed(4) : 'N/A'}</Text>
</HStack> */}

      <Divider className='my-5' />
      <HStack className='px-3'>

      <Text >
        {analysis === 'rainfall' && ' Curah Hujan'}
        {analysis === 'temperature' && ' Suhu'}
        {analysis === 'soil-type' && ' Jenis Tanah'}
        {analysis === 'soil-ph' && ' pH Tanah'}
        {analysis === 'elevation' && ' Ketinggian'}
      </Text>
      <Text > :  </Text>
      <Text>{rasterValue === null ?'N/A':  analysis === 'soil-type'? '': rasterValue.toFixed(2)}</Text>
      <Text >
        {analysis === 'rainfall' && ' mm/tahun'}
        {analysis === 'temperature' && ' °C'}
        {analysis === 'soil-ph' && ' H2O'}
        {analysis === 'soil-type' && rasterValue === 1 && 'Cl'}
        {analysis === 'soil-type' && rasterValue === 2 && 'SiCl'}
        {analysis === 'soil-type' && rasterValue === 3 && 'SaCl'}
        {analysis === 'soil-type' && rasterValue === 4 && 'ClLo'}
        {analysis === 'soil-type' && rasterValue === 5 && 'SiClLo'}
        {analysis === 'soil-type' && rasterValue === 6 && 'SaClLo'}
        {analysis === 'soil-type' && rasterValue === 7 && 'Lo'}
        {analysis === 'soil-type' && rasterValue === 8 && 'SiLo'}
        {analysis === 'soil-type' && rasterValue === 9 && 'SaLo'}
        {analysis === 'soil-type' && rasterValue === 10 && 'Si'}
        {analysis === 'soil-type' && rasterValue === 11 && 'LoSa'}
        {analysis === 'soil-type' && rasterValue === 12 && 'Sa'} 
        {analysis === 'elevation' && ' m'}

      </Text>
      </HStack>

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
          <SelectPortal >
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Curah Hujan" value="rainfall" />
              <SelectItem label="Suhu Permukaan" value="temperature" />
              <SelectItem label="Jenis Tanah" value="soil-type" />
              <SelectItem label="pH Tanah" value="soil-ph" />
              <SelectItem label="Ketinggian" value="elevation" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <FormControlHelper>
          <FormControlHelperText>Pilih citra yang akan ditampilkan</FormControlHelperText>
        </FormControlHelper>
        <FormControlError><FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Wajib diisi</FormControlErrorText></FormControlError>
      </FormControl>

      {/* Conditional band selection */}
      {showBandSelection && (
        <FormControl isRequired className='m-5'>
          <FormControlLabel>
            <FormControlLabelText>Pilih Kedalaman</FormControlLabelText>
          </FormControlLabel>
          <Select onValueChange={handleBandChange}>
            <SelectTrigger>
              <SelectInput placeholder="Pilih kedalaman" className="flex-1 py-2" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectItem label="Permukaan" value="b0" />
                <SelectItem label="10 cm" value="b10" />
                <SelectItem label="30 cm" value="b30" />
                <SelectItem label="60 cm" value="b60" />
                <SelectItem label="100 cm" value="b100" />
                <SelectItem label="200 cm" value="b200" />
              </SelectContent>
            </SelectPortal>
          </Select>
          <FormControlHelper>
            <FormControlHelperText>Pilih kedalaman yang akan dianalisis</FormControlHelperText>
          </FormControlHelper>
          <FormControlError><FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>Wajib diisi</FormControlErrorText></FormControlError>
        </FormControl>
      )}

      {/* Loading indicator */}
      {/* {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )} */}

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

export default EarthEngineMap;
