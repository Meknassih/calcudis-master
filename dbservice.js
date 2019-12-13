const sqlite = require('sqlite');
const openDb = sqlite.open('./data.db', { Promise });

async function getBatches() {
  const db = await openDb;
  return await db.all('SELECT job.*, keyRange.id as keyRange_id, keyRange.fromKey, keyRange.toKey, keyRange.tried \
    FROM job INNER JOIN keyRange ON job.id = keyRange.job_id \
    WHERE job.status = 0 AND keyRange.tried = 0 \
    ORDER BY job.priority ASC;');
}

module.exports = { getBatches };