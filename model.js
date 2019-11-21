const algorithm = require('./algorithm');

class Batch {
  constructor(message, fromKey, toKey) {
    this.message = message;
    this.fromKey = fromKey;
    this.toKey = toKey;
  }
}

class Solution {
  constructor(encrypted, decrypted, secret) {
    this.encrypted = encrypted;
    this.decrypted = decrypted;
    this.secret = secret;
  }

  verify() {
    return algorithm.stringTransposition(this.encrypted, +this.secret) === this.decrypted;
  }
}

module.exports = { Batch, Solution };