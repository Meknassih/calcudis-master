const algorithm = require('./algorithm');
const config = require('./config');

class Batch {
  constructor(keyRangeId, message, fromKey, toKey) {
    this.keyRangeId = keyRangeId;
    this.message = message;
    this.fromKey = fromKey;
    this.toKey = toKey;
  }

  // Marks batch as being worked on, avoids batch being sent to multiple clients
  async stall() {
    const sqlite = require('sqlite');
    const db = await sqlite.open('./data.db', { Promise });
    try {
      await db.run('UPDATE keyRange SET tried = 1 WHERE id = ?', [this.keyRangeId]);
      console.info('Stalling keyRange ' + this.keyRangeId);
    } catch (e) {
      console.error('Batch.stall() could not stall keyRange');
      console.error(e);
    }
    await db.close();
  }

  // Marks batch as available to be worked on if for some reason a client takes too long to respond
  async scheduleUnstall() {
    const sqlite = require('sqlite');
    const db = await sqlite.open('./data.db', { Promise });
    this.unstallTimer = setTimeout(async () => {
      const range = await db.get('SELECT * FROM keyRange WHERE id = ?', [this.keyRangeId]);
      if (range.tried === 1) {
        try {
          await db.run('UPDATE keyRange SET tried = 0 WHERE id = ?', [this.keyRangeId]);
          console.info('Unstalled keyRange ' + range.id);
        } catch (e) {
          console.error('Batch.scheduleUnstall() could not unstall keyRange');
          console.error(e);
        }
      }
      await db.close();
    }, config.maxBatchStallMs);
  }

  toString() {
    return {
      keyRangeId: this.keyRangeId,
      message: this.message,
      fromKey: this.fromKey,
      toKey: this.toKey
    }
  }
}

class Solution {
  constructor(id, encrypted, decrypted, secret) {
    this.id = id;
    this.encrypted = encrypted;
    this.decrypted = decrypted;
    this.secret = secret;
  }

  verify() {
    return algorithm.stringTransposition(this.encrypted, +this.secret) === this.decrypted;
  }
}

module.exports = { Batch, Solution };