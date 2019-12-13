const dbservice = require('../dbservice');
const { Batch, Solution } = require('../model');
const algorithm = require('../algorithm');

let CLIENT_COUNT = 0;

module.exports = (io) => {
  io.on('connection', function (socket) {
    console.log(`Client connected (${++CLIENT_COUNT})`);

    socket.on('disconnect', function () {
      console.log(`Client disconnected (${--CLIENT_COUNT})`);
    });

    socket.on('getAlgorithm', function (lang) {
      try {
        socket.emit('algorithm', { code: algorithm.getAlgorithm(lang) });
      } catch (e) {
        socket.emit('unsupported', { supported: algorithm.supportedClients });
      }
    });

    socket.on('getSlug', function () {
      socket.emit('slug', { slug: 'abc' });
    });

    socket.on('getBatch', async function () {
      console.log('a user requests a batch');
      try {
        const batches = await dbservice.getBatches();
        if (batches.length > 0) {
          const batch = new Batch(batches[0].keyRange_id, batches[0].crypted, batches[0].fromKey, batches[0].toKey, batches[0].plain);
          await batch.stall();
          socket.emit('batch', batch);
          await batch.scheduleUnstall();
        } else {
          socket.emit('noBatches', { message: "All jobs done." });
        }
      } catch (e) {
        console.error(e);
        socket.emit('error', { message: 'Internal server error while retrieving batches.' });
      }
    });

    socket.on('postFoundKey', function (body) {

    });

    socket.on('postBadBatch', function (body) {

    });
  });


}