// @flow

import type sqlite from 'sqlite';

const SQL = require('sql-template-strings');
const sqlar = require('../utils/sqlar');

export type File = {
  name: string,
  mode: number,
  lastModified: Date,
  size: number,
  contents: Buffer,
};

class FileDAO {
  _db: sqlite.Database;
  constructor (db: sqlite.Database) {
    this._db = db;
  }

  async findByName (filename: string): Promise<File> {
    const row = await this._db.get(SQL`
      SELECT mode, mtime, sz, data
      FROM sqlar
      WHERE name = ${filename}
    `);

    if (typeof(row) === 'undefined') {
      throw new Error(`File "${filename}" does not exist.`);
    }

    const data = Buffer.from(row.data);
    const contents = await sqlar.uncompress(data, row.sz);

    return {
      name: filename,
      mode: row.mode,
      lastModified: new Date(row.mtime * 1000),
      size: row.sz,
      contents: contents,
    };
  }

  async exists (filename: string): Promise<bool> {
    const row = await this._db.get(SQL`
      SELECT 1
      FROM sqlar
      WHERE name = ${filename}
    `);

    return typeof(row) !== 'undefined';
  }

  async create (file: File): Promise<void> {
    const mtime = Math.floor(file.lastModified.getTime() / 1000);

    let data = file.contents;
    try {
      data = await sqlar.compress(data);
    } catch (err) { console.error(err); }

    await this._db.run(SQL`
      INSERT INTO sqlar (name, mode, mtime, sz, data)
      VALUES (${file.name}, ${file.mode}, ${mtime}, ${file.size}, ${data})
    `);
  }

  async update (file: File): Promise<number> {
    const mtime = Math.floor(file.lastModified.getTime() / 1000);

    let data = file.contents;
    try {
      data = await sqlar.compress(data);
    } catch (err) { console.error(err); }

    const { changes } = await this._db.run(SQL`
      UPDATE sqlar
      SET mtime = ${mtime}, sz = ${file.size}, data = ${data}
      WHERE name = ${file.name}
    `);

    return changes;
  }
};

module.exports = FileDAO;
