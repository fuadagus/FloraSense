import React, { useContext } from 'react';
import "./global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { StyleSheet, SafeAreaView, ActivityIndicator, View } from 'react-native';
import { AuthContext, AuthProvider } from './src/context/AuthContext'; // Adjust the path if necessary
import TabNavigation from './TabNavigation'; // Adjust the path if necessary
import AuthScreen from './src/screens/auth/AuthScreen'; // Adjust the path if necessary

const AppContent = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GluestackUIProvider>{/* Add your app code here */}
    <SafeAreaView style={styles.container}>
      {user ? <TabNavigation /> : <AuthScreen />}
    </SafeAreaView>
    </GluestackUIProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
