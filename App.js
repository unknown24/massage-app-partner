import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import Roboto from './resource/Fonts/Roboto.ttf';
import RobotoMedium from './resource/Fonts/Roboto_medium.ttf';

import Test from './screens/Test'


// export default LinksScreen;
export default function App(props) {
  const [isSplashReady, setSplashReady] = useState(false);
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  if (isSplashReady == false && isLoadingComplete == false) {
    return (
      <AppLoading
        startAsync={()=> {
          _cacheSplashResourcesAsync()
        }}
        onError={handleLoadingError}
        onFinish={() => {
          setSplashReady(true)
        }}
        autoHideSplash={false}
      />
    );
  } else if (isLoadingComplete == false && isSplashReady== true){
    return (
      <View style={{ flex: 1 }}>
        <Image
          style        = {{
            flex      : 1,
            resizeMode: 'contain',
            width     : 'auto'
          }}
          source     = {require('./assets/images/splash.png')}
          onLoad     = {()=>{
            loadResourcesAsync(setLoadingComplete)
          }}
        />
    </View>
    )
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync(setLoadingComplete) {
  SplashScreen.hide()
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      'space-mono' : require('./assets/fonts/SpaceMono-Regular.ttf'),
      Roboto       ,
      Roboto_medium:RobotoMedium,
    }),
  ]);
  setLoadingComplete(true)
}

const _cacheSplashResourcesAsync = async () => {
  const gif = require('./assets/images/splash.png');
  return Asset.fromModule(gif).downloadAsync();
};

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
