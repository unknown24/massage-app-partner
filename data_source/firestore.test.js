const fs = require('./firestore.fn');

fs.listenToPesanan('p4', (r) => {
  console.log(r);
});
