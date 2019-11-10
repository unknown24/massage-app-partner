const db = require('./firestore.init');

module.exports.listenToPesanan = function listenToPesanan(pid, callback) {
  db.collection('pesanan').where('partner_id', '==', pid)
    .onSnapshot((querySnapshot) => {
      const result = [];
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          result.push({ data: change.doc.data(), name: change.doc.id });
        }
      });
      callback(result);
    });
};
