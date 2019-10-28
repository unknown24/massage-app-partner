import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import {
  Platform, StatusBar, StyleSheet, View, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import Roboto from './resource/Fonts/Roboto.ttf';
import RobotoMedium from './resource/Fonts/Roboto_medium.ttf';

import rootReducer from './src/reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
  ),
);

const gif = require('./assets/images/splash.png');
const splash = require('./assets/images/splash.png');
const robotDev = require('./assets/images/robot-dev.png');
const robotProd = require('./assets/images/robot-prod.png');
const spaceMono = require('./assets/fonts/SpaceMono-Regular.ttf');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const cacheSplashResourcesAsync = async () => Asset.fromModule(gif).downloadAsync();

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

async function loadResourcesAsync(setLoadingComplete) {
  SplashScreen.hide();
  await Promise.all([
    Asset.loadAsync([
      robotDev,
      robotProd,
    ]),
    Font.loadAsync({
      ...Ionicons.font,
      'space-mono': spaceMono,
      Roboto,
      Roboto_medium: RobotoMedium,
    }),
  ]);
  setLoadingComplete(true);
}

// export default LinksScreen;
export default function App() {
  const [isSplashReady, setSplashReady] = useState(false);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (isSplashReady === false && isLoadingComplete === false) {
    return (
      <AppLoading
        startAsync={() => {
          cacheSplashResourcesAsync();
        }}
        onError={handleLoadingError}
        onFinish={() => {
          setSplashReady(true);
        }}
        autoHideSplash={false}
      />
    );
  }

  if (isLoadingComplete === false && isSplashReady === true) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{
            flex: 1,
            resizeMode: 'contain',
            width: 'auto',
          }}
          source={splash}
          onLoad={() => {
            loadResourcesAsync(setLoadingComplete);
          }}
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    </Provider>
  );
}
