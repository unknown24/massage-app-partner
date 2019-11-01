import React from 'react';
import PropsTypes from 'prop-types';
import Dashboard from './Location';
import initApp from '../library/firebase/firebase';
import { getLastString } from '../library/String';

const firebase = initApp();
const dbh = firebase.firestore();

class DashboardContainer extends React.Component {
  componentDidMount() {
    console.log('');
  }

  _listenToPesanan() {
    const { pid, onAdaPesanan } = this.props;
    dbh.collection('pesanan').where('partner_id', '==', pid)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const pesanan = [];
            querySnapshot.forEach((doc) => {
              pesanan.push({
                id_pesanan: getLastString(doc._document.proto.name),
                user_id: doc.data().user_id,
                lokasi: doc.data().user_location,
                payment: doc.data().payment,
              });
            });

            if (pesanan.length > 0) {
              onAdaPesanan(pesanan[0]);
            } else {
              console.log('Tidak ada pesanan');
            }
          }
        });
      });
  }

  render() {
    return <Dashboard {...this.props} />; // eslint-disable-line
  }
}

DashboardContainer.propTypes = {
  pid: PropsTypes.string.isRequired,
  onAdaPesanan: PropsTypes.func.isRequired,
};

export default DashboardContainer;
