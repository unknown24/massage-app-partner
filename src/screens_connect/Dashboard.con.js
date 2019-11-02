import { connect } from 'react-redux';
import DashboardContainer from '../../screens/DashboardContainer';
import { tampilkanDialogPemesanan, updateLocation, togglePemijat, } from '../actions/ActionCreators';

const mapStateToProps = (state) => ({
  pid: state.partner_id,
  taskname: 'dsadsa',
  displayDialogBox: false,
  valueToggleAktifkan: false,
});

const mapDispatchToProps = {
  onAdaPesanan: tampilkanDialogPemesanan,
  onGetLocation: updateLocation,
  onAktifkan: togglePemijat,
  onGetTask: updateStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
