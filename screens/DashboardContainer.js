import React from 'react';
import PropsTypes from 'prop-types';
import * as Permissions from 'expo-permissions'; // eslint-disable-line
import * as TaskManager from 'expo-task-manager';
import { ToastAndroid, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { connect } from 'react-redux';
import Dashboard from './Location';
import { dbh } from '../library/firebase/firebase';
import { getLastString } from '../library/String';
import { TOGGLE_AKTIF, UPDATE_PESANAN, UPDATE_LOCATION } from '../constants/ActionTypes';
import { TASK, TIMER } from '../constants/others';
import { toggleData } from '../src/actions/ActionCreators';


class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_second: TIMER,
      isDisplayDialog: false,
    };
  }


  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      ToastAndroid.show('Oops, this will not work on Sketch in an Android emulator. Try it on your device', ToastAndroid.SHORT);
    } else {
      this._getLocationAsync();
    }
  }


  async componentDidMount() {
    await this._listenToPesanan();
    await this._getAllTask();
  }


  _getLocationAsync = async () => {
    const { dispatch } = this.props;
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT);
    }

    /**
    * @typedef {Object} coords
    * @property {*} accuracy - 87.5999984741211.
    * @property {*} altitude - 0.
    * @property {*} heading - 0.
    * @property {*} latitude - -6.8116553.
    * @property {*} longitude - 107.9185063.
    * @property {*} speed - 0.
    */

    /**
    * @typedef {Object} location
    * @property {coords} coords -
    * @property {*} mocked - false.
    * @property {*} timestamp - 1572669469270.
    */

    /**
     * @type {location} location
     */
    const location = await Location.getCurrentPositionAsync({});
    dispatch({
      type: UPDATE_LOCATION,
      payload: location,
    });
  }

  handleUpdateData = () => {
    const { dispatch } = this.props;

    dispatch(toggleData());
  }

  handleTolakPesanan = () => {
    clearInterval(this.int);
    this.setState({
      isDisplayDialog: false,
    });
  }


  _listenToPesanan() {
    const { pid, dispatch } = this.props;
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
              dispatch({
                type: UPDATE_PESANAN,
                payload: pesanan[0],
              });
              this.setState({ isDisplayDialog: true });
              this.int = setInterval(() => {
                const { current_second } = this.state;
                if (current_second > 0) {
                  this.setState({
                    current_second: current_second - 1,
                  });
                } else {
                  clearInterval(this.int);
                  this.setState({
                    isDisplayDialog: false,
                  });
                }
              }, 1000);

            } else {
              console.log('Tidak ada pesanan');
            }
          }
        });
      });
  }


  async _getAllTask() {
    const { dispatch } = this.props;
    this.allTask = await TaskManager.getRegisteredTasksAsync();
    this.updateLocationTask = this.allTask.filter((task) => task.taskName === TASK);

    if (this.updateLocationTask.length) {
      dispatch({
        type: TOGGLE_AKTIF,
        payload: true,
      });
    } else {
      dispatch({
        type: TOGGLE_AKTIF,
        payload: false,
      });
    }
  }


  static navigationOptions = {
    header: null,
  }


  render() {
    const { current_second, isDisplayDialog } = this.state;
    return (
      <Dashboard
        displayDialogBox={isDisplayDialog}
        onAktifkan={this.handleUpdateData}
        onTolak={this.handleTolakPesanan}
        second={current_second}
        {...this.props} // eslint-disable-line 
      />
    );
  }
}

DashboardContainer.propTypes = {
  pid: PropsTypes.string.isRequired,
  dispatch: PropsTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  pid: state.partner_id,
  taskname: state.status_aktif ? 'update-location' : 'none',
  valueToggleAktifkan: state.status_aktif,
});

export default connect(mapStateToProps)(DashboardContainer);
