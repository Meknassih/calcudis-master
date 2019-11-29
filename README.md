# Calcudis Application Server
## Getting started
### Install the dependencies
```bash
npm install
```
### Install SQLite 3
For Debian/Ubuntu :
```bash
sudo apt install sqlite3
```
For an other OS, check out the [official SQLite download page](https://sqlite.org/download.html).
### Create the database
```bash
sqlite3 data.db < schema.sql
```
### Start the server
```bash
npm run start
```

## Database models
Execute `example.sql` to start working quickly with a preloaded database with dummy data, or execute `schema.sql` if you wish to start with a clean database.
### Job
Describes an encrypted message and all the metadata associated with it.
- **crypted** : the encrypted data
- **plain** : the decrypted data, defaults to NULL
- **status**
  - 0 - new, default value
  - 1 - partially done
  - 2 - done and solved
  - 3 - done and unsolved
- **key** : the secret to decrypt *crypted* into *plain*, defaults to NULL
- **priority** : highest 0 to lowest 255, defaults to 255

### Key range
Describes a range of keys to test and from which test batches are generated for the clients.
- **job_id** : points to the job which this range of keys belongs to
- **fromKey** : low boundary key, included
- **toKey** : high boundary key, included
- **totalKeys** : equals *toKey* - *fromKey*
- **tried**
  - 0 - never tried, default value
  - 1 - a client is trying
  - 2 - tried