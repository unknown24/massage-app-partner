import React from 'react';
import {
  View, Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container, Header, Content, Card, CardItem, Text, Right, Body,
} from 'native-base';
import Dialog from 'react-native-dialog';
import Image from 'react-native-remote-svg';


const online_image = require('../assets/images/online.svg');
const offline_image = require('../assets/images/offline.svg');


export default function Dashboard(props) {
  const {
    pid,
    taskname,
    displayDialogBox,
    valueToggleAktifkan,
    second,
    onTerima,
    onTolak,
    onAktifkan,
  } = props;

  const title = `Ada Pesanan (${second})`;
  let statusImage;
  let statusText;

  if (valueToggleAktifkan) {
    statusText = 'Kamu Online';
    statusImage = online_image;
  } else {
    statusText = 'Kamu Offline';
    statusImage = offline_image;
  }

  return (
    <Container>
      <Header />
      <Content contentContainerStyle={{ flex: 1 }}>
        <Card>
          <CardItem>
            <Body><Text>Aktifkan Fitur Pemijat </Text></Body>
            <Right><Switch onValueChange={onAktifkan} value={valueToggleAktifkan} /></Right>
          </CardItem>
          <CardItem bordered style={{ backgroundColor: '#e8e8e8' }}>
            <Text>Debug Menu</Text>
          </CardItem>
          <CardItem>
            <Body><Text>PID </Text></Body>
            <Right><Text>{ pid }</Text></Right>
          </CardItem>
          <CardItem>
            <Body><Text>Background Processing </Text></Body>
            <Right><Text>{taskname}</Text></Right>
          </CardItem>
        </Card>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Image
            source={statusImage}
            style={{ width: 200, height: 150 }}
          />
          <Text style={{ fontSize: 20 }}>{statusText}</Text>
        </View>
      </Content>
      <Dialog.Container visible={displayDialogBox}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
            Apakah anda ingin menerima pesanan ini?
        </Dialog.Description>
        <Dialog.Button
          label="Terima"
          onPress={onTerima}
        />
        <Dialog.Button
          label="Tolak"
          onPress={onTolak}
        />
      </Dialog.Container>
    </Container>
  );
}

Dashboard.propTypes = {
  pid: PropTypes.string,
  taskname: PropTypes.string,
  displayDialogBox: PropTypes.bool,
  valueToggleAktifkan: PropTypes.bool,
  onTerima: PropTypes.func,
  onTolak: PropTypes.func,
  onAktifkan: PropTypes.func,
  second: PropTypes.number,
};

Dashboard.defaultProps = {
  pid: '23',
  taskname: 'dsadsa',
  displayDialogBox: false,
  valueToggleAktifkan: false,
  second: 20,
  onTerima: () => console.log(34),
  onTolak: () => console.log(34),
  onAktifkan: () => console.log(34),
};
