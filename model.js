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
    try {
      const sqlite = require('sqlite');
      const db = await sqlite.open('./data.db', { Promise });
      await db.run('UPDATE keyRange SET tried = 1 WHERE id = ?', [this.keyRangeId]);
      console.info('Stalling keyRange ' + this.keyRangeId);
      await db.close();
    } catch (e) {
      console.error('Batch.stall() could not stall keyRange');
      console.error(e);
    }
  }

  // Marks batch as available to be worked on if for some reason a client takes too long to respond
  async scheduleUnstall() {
    this.unstallTimer = setTimeout(async () => {
      const sqlite = require('sqlite');
      const db = await sqlite.open('./data.db', { Promise });
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
  constructor(keyRangeId, encrypted, decrypted, secret) {
    this.keyRangeId = keyRangeId;
    this.encrypted = encrypted;
    this.decrypted = decrypted;
    this.secret = secret;
  }

  verify() {
    console.info('Verifying ' + algorithm.stringTransposition(this.encrypted, +this.secret) + ' against ' + this.decrypted);
    return algorithm.stringTransposition(this.encrypted, +this.secret) === this.decrypted;
  }

  async jobDone() {
    const sqlite = require('sqlite');
    const db = await sqlite.open('./data.db', { Promise });
    try {
      await db.run('UPDATE keyRange SET tried = 2 WHERE id = ?', [this.keyRangeId]);
      const keyRange = await db.get('SELECT job_id FROM keyRange WHERE id = ?', [this.keyRangeId]);
      await db.run('UPDATE job SET status = 2, key = ? WHERE id = ?', [this.secret, keyRange.job_id]);
      await db.close();
      console.info('Job ' + keyRange.job_id + ' marked as done');
    } catch (e) {
      console.error('Solution.jobDone() could not mark job as done');
      console.error(e);
    }
  }
}

module.exports = { Batch, Solution };