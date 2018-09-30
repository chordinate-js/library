// @flow

import type sqlite from 'sqlite';
import type { File } from '../daos/FileDAO';

const FileDAO = require('../daos/FileDAO');

class FileManager {
  _dao: FileDAO;
  constructor(dao: FileDAO) {
    this._dao = dao;
  }

  async load (filename: string): Promise<File> {
    return await this._dao.findByName(filename);
  }

  async save (file: File): Promise<void> {
    // @todo Handle underlying directory structure.
    const exists = await this._dao.exists(file.name);
    if (exists) {
      await this._dao.update(file);
    } else {
      await this._dao.create(file);
    }
  }
}

module.exports = FileManager;
