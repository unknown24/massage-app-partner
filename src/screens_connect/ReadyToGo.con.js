import { connect } from 'react-redux';
import ReadyToGo from '../../components/sub-screen/readyToGo';
import { selesaikanPesanan } from '../actions/ActionCreators';

const mapStateToProps = (state) => {
  return {
    nama: state.current_client.nama,
    alamat: JSON.stringify(state.current_client.alamat),
    kontak: state.current_client.no_kontak,
  };
};

const mapDispatchToProps = {
  onSelesaiPijat: (res) => selesaikanPesanan(res),
};

export default connect(mapStateToProps, mapDispatchToProps)(ReadyToGo);
