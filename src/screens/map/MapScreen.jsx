import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Button } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { HStack, Icon, Image, Link, LinkText, Card, Text, Heading, ArrowRightIcon } from '@/components/ui';

const MapScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const openInAppBrowser = async () => {
    setIsLoading(true);
    try {
      const url = 'https://fuadagussalim.users.earthengine.app/view/florasense';
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'partialCurl',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
          headers: {
            'my-custom-header': 'my custom header value'
          },
        });
      } else {
        // Fallback to WebView or other handling
        console.log('InAppBrowser is not available');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card className="p-5 rounded-lg max-w-[360px] m-3">
        <Image
          source={require('@/src/assets/paramling.png')}
          className="mb-6 h-[240px] w-full rounded-md aspect-[263/240]"
          alt="image"
        />
        <Text className="text-sm font-normal mb-2 max-w-[280px] text-typography-700">
          Peta Curah Hujan, Temperatur,  pH Tanah, dan Jenis Tanah
        </Text>
        
        <Heading size="md" className="mb-4">
          Peta Parameter Lingkungan
        </Heading>
        <Link href="" isExternal onPress={() => navigation.navigate('EarthEngineMap', { mode: 'advance' })}>
          <HStack className="items-center">
            <LinkText
              size="sm"
              className="font-semibold text-info-600 no-underline"
            >
              Buka Google Earth Engine
            </LinkText>
            <Icon
              as={ArrowRightIcon}
              size="sm"
              className="text-info-600 mt-0.5 ml-0.5"
            />
          </HStack>
        </Link>
      </Card>
      
      {isLoading && (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#0000ff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
});

export default MapScreen;
