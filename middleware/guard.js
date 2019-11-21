const tokenExists = function (req, res, next) {
  const [authType, authValue] = req.header('authorization').split(' ');

  if (authType === 'Bearer' && typeof authValue === 'string')
    next();
  else {
    res.status(401);
    res.setHeader('Content-type', 'application/json');
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.send(JSON.stringify({ message: 'You must specify a Bearer authentication token in the headers.' }));
  }
}

module.exports = { tokenExists };