const jwt = require('jsonwebtoken');
const request = require('request');
const asPublicKeyUrl = 'localhost:3010/'; // Testing purposes

const tokenExists = function (req, res, next) {
  if (!req.header('authorization')) {
    res.status(401);
    res.setHeader('Content-type', 'application/json');
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.send(JSON.stringify({ message: 'You must specify a Bearer authentication token in the headers.' }));
  }
  const [authType, authValue] = req.header('authorization').split(' ');

  if (authType === 'Bearer' && typeof authValue === 'string') {
    req.token = authValue;
    next();
  } else {
    res.status(401);
    res.setHeader('Content-type', 'application/json');
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.send(JSON.stringify({ message: 'You must specify a proper Bearer authentication token in the headers.' }));
  }
}

const tokenValid = function (req, res, next) {
  let asPublicKey;
  request('http://' + asPublicKeyUrl + 'auth/publicKey', function (err, response, body) {
    if (err) {
      console.error(err);
      res.status(503);
      res.setHeader('Content-type', 'application/json');
      return res.send(JSON.stringify({ message: 'The Authorization Server is not responding at the moment.' }));
    } else {
      asPublicKey = JSON.parse(body).key;
      jwt.verify(
        req.token,
        asPublicKey,
        { issuer: 'monsieurleserveurdauthentification' },
        function (err, decoded) {
          if (err) {
            console.error(err);
            res.status(403);
            res.setHeader('Content-type', 'application/json');
            return res.send(JSON.stringify({ message: 'The authorization token is not valid.' }));
          } else {
            req.tokenDecoded = decoded;
            next();
          }
        });
    }
  });
}

module.exports = { tokenExists, tokenValid };