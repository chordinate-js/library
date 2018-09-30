// @flow

const sqlite = require('sqlite');
const FileDAO = require('./daos/FileDAO');
const FileManager = require('./managers/FileManager');

class Library {
  _db: sqlite.Database;
  constructor (db: sqlite.Database) {
    this._db = db;
  }

  async initialize (): Promise<void> {
    await this._db.migrate();
  }

  async close (): Promise<void> {
    await this._db.close();
  }

  _fileManager: ?FileManager;
  get files (): FileManager {
    return this._fileManager = this._fileManager || new FileManager(new FileDAO(this._db));
  }
}

module.exports = {
  Library,
};
