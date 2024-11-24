import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import PlantIdentifier from './PlantIdentifier'; // Adjust the path as necessary

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PlantIdentifier />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
