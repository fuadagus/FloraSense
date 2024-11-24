import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import PlantIdentifier from './PlantIdentifier'; // Adjust the path as necessary
import TabNavigation from './TabNavigation';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <PlantIdentifier /> */}
      <TabNavigation />
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
