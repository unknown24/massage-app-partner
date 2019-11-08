import React, { Component } from 'react';

import { AsyncStorage, View, Text } from 'react-native';

export default class Test extends Component {
  async componentDidMount() {
    console.log('s');
    await AsyncStorage.setItem('satu', 'dua');

    console.log('e');
    console.log(await AsyncStorage.getItem('satu'));
  }

  render() {
    return (
      <View>
        <Text>juara</Text>
      </View>
    );
  }
}
