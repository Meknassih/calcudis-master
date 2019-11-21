var express = require('express');
var router = express.Router();

router.get('/algorithm', function (req, res) {
  res.send('respond with a resource');
});

router.get('/slug', function (req, res) {
  res.send('respond with a resource');
});

router.get('/batch', function (req, res) {
  res.send('respond with a resource');
});

router.post('/foundKey', function (req, res) {
  res.send('respond with a resource');
});

router.post('/badBatch', function (req, res) {
  res.send('respond with a resource');
});

module.exports = router;
