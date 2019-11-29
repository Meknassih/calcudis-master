const sqlite = require('sqlite');
const express = require('express');
const router = express.Router();
const algorithm = require('../algorithm');
const { Batch, Solution } = require('../model');
const openDb = sqlite.open('./data.db', { Promise });

router.get('/algorithm', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  switch (req.query.lang) {
    case 'js':
    case 'ts':
    case 'javascript':
    case 'typescript':
    case undefined:
      res.status(200);
      res.send(JSON.stringify({ code: algorithm.stringTransposition.toString() }));
      break;

    default:
      res.status(404);
      res.send(JSON.stringify({ message: 'Client language not supported.' }));
      break;
  }
});

router.get('/slug', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  res.status(200);
  res.send(JSON.stringify({ slug: 'abc' }));
});

router.get('/batch', async function (req, res) {
  res.setHeader('Content-type', 'application/json');
  try {
    const db = await openDb;
    const batches = await db.all('SELECT job.*, keyRange.id as keyRange_id, keyRange.fromKey, keyRange.toKey, keyRange.tried \
    FROM job INNER JOIN keyRange ON job.id = keyRange.job_id \
    WHERE job.status = 0 AND keyRange.tried = 0 \
    ORDER BY job.priority ASC;');
    if (batches.length > 0) {
      res.status(200);
      const batch = new Batch(batches[0].keyRange_id, batches[0].crypted, batches[0].fromKey, batches[0].toKey);
      await batch.stall();
      res.send(JSON.stringify(batch.toString()));
      await batch.scheduleUnstall();
    } else {
      res.status(204);
      res.send(JSON.stringify({ message: "All jobs done." }));
    }
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(JSON.stringify({ message: "Internal error while retrieving jobs." }));
  }
});

router.post('/foundKey', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  if (req.body.keyRangeId === undefined || !req.body.encrypted || !req.body.decrypted || !req.body.secret) {
    res.status(400);
    return res.send(JSON.stringify({ message: 'Solution must contain keys "keyRangeId", "encrypted", "decrypted" and "secret".' }));
  }

  const solution = new Solution(req.body.keyRangeId, req.body.encrypted, req.body.decrypted, req.body.secret);
  if (solution.verify()) {
    solution.jobDone();
    res.status(200);
    return res.send(JSON.stringify({ message: 'Thank you.' }));
  } else {
    res.status(409);
    return res.send(JSON.stringify({ message: 'The suggested solution did not pass verification.' }));
  }
});

router.post('/badBatch', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  if (!req.body.message || !req.body.fromKey || !req.body.toKey) {
    res.status(400);
    return res.send(JSON.stringify({ message: 'Batch must specify from which key to which key it has been tested.' }));
  }
  //TODO: mark the bad batch as done
  res.send(JSON.stringify(new Batch('bcd', -2, 2)));
});

module.exports = router;
