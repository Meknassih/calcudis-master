const express = require('express');
const router = express.Router();
const algorithm = require('../algorithm');
const { Batch, Solution } = require('../model');

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

router.get('/batch', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  res.status(200);
  res.send(JSON.stringify(new Batch('bcd', -2, 2)));
});

router.post('/foundKey', function (req, res) {
  res.setHeader('Content-type', 'application/json');
  if (!req.body.encrypted || !req.body.decrypted || !req.body.secret) {
    res.status(400);
    return res.send(JSON.stringify({ message: 'Solution must contain keys "encrypted", "decrypted" and "secret".' }));
  }

  if (new Solution(req.body.encrypted, req.body.decrypted, req.body.secret).verify()) {
    res.status(200);
    return res.send(JSON.stringify({ message: 'Thank you.' }));
  } else {
    res.status(409);
    return res.send(JSON.stringify(new Batch('bcd', -2, 2)));
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
