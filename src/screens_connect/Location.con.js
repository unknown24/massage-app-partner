import { connect } from 'react-redux';
import Location from '../../screens/Location';
import { goToPelanggan, terimaPesanan } from '../actions/ActionCreators';


const mapDispatchToProps = {
  onSelesaiPijat: goToPelanggan,
  onTerimaPesanan: terimaPesanan,
};

export default connect(null, mapDispatchToProps)(Location);
