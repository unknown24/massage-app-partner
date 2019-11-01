import { connect } from 'react-redux';
import DashboardContainer from '../../screens/DashboardContainer';
import { tampilkanDialogPemesanan } from '../actions/ActionCreators';


const mapDispatchToProps = {
  onAdaPesanan: tampilkanDialogPemesanan,
};

export default connect(null, mapDispatchToProps)(DashboardContainer);
