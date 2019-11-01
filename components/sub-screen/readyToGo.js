import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Text, Content, Header, View, Card, CardItem, Body, Left, Button,
} from 'native-base';
import Image from 'react-native-remote-svg';

const bayarDulu = require('../../assets/images/payment-method.svg');
const segera = require('../../assets/images/cycling.svg');
const terimaKasih = require('../../assets/images/cycling.svg');

const data = {
  waiting: {
    caption: 'Tunggu pemesan bayar dulu ya',
    image: bayarDulu,
  },
  ready: {
    caption: 'Silahkan segera menuju ke pelanggan ...',
    image: segera,
  },
  finish: {
    caption: 'Terima kasih silahkan klik kembli untuk menerima orderan ...',
    image: terimaKasih,
  },
};

class WatingPayment extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    const {
      navigation, onSelesaiPijat, nama, alamat, kontak,
    } = this.props;
    const tipe = navigation.getParam('tipe');

    let label = '';
    let image = '';
    const keys = Object.keys(data);
    const finded = keys.find((key) => {
      if (key === tipe) {
        label = data[key].caption;
        image = data[key].image;

        return true;
      }
      return false;
    });

    if (typeof finded === 'undefined') {
      return (<View><Text> Something Wrong </Text></View>);
    }

    return (
      <Container>
        <Header />
        <Content contentContainerStyle={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 19 }}>{label}</Text>
            <Image
              style={{ width: 200, height: 200, marginTop: 25 }}
              source={image}
            />
            {tipe === 'ready' ? <Button onPress={onSelesaiPijat}><Text>Selesai</Text></Button> : ''}
          </View>
          <Card style={{ marginLeft: 10, marginRight: 10 }}>
            <CardItem bordered first>
              <Left><Text>Nama</Text></Left>
              <Body><Text>{nama}</Text></Body>
            </CardItem>
            <CardItem bordered>
              <Left><Text>Alamat</Text></Left>
              <Body>
                <Text>{alamat}</Text>
              </Body>
            </CardItem>
            <CardItem bordered last>
              <Left><Text>No Kontak</Text></Left>
              <Body><Text>{kontak}</Text></Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

WatingPayment.propTypes = {
  nama: PropTypes.string.isRequired,
  alamat: PropTypes.string.isRequired,
  kontak: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
  onSelesaiPijat: PropTypes.func.isRequired,
};

// WatingPayment.defaultProps = {
//     tipe : 'ready' // waiting, ready, finish
// }

export default WatingPayment;
