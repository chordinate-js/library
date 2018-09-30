// @flow

/**
 * Javascript port of SQLite Archives algorithms.
 *
 * https://sqlite.org/sqlar.html#managing_sqlite_archives_from_application_code
 * https://sqlite.org/src/file/ext/misc/sqlar.c
 */

const zlib = require('zlib');
const Stream = require('stream');

const compress = async (data: Buffer): Promise<Buffer> => {
  if (!isSqliteBlob(data)) {
    return data;
  }

  return new Promise((resolve, reject) => {
    zlib.deflate(data, (err, result) => {
      if (err) reject(err);

      return (result.byteLength < data.byteLength)
        ? resolve(result)
        : resolve(data);
    });
  });
};

const uncompress = async (data: Buffer, size: number): Promise<Buffer> => {
  if (size <= 0 || data.byteLength === size) {
    return data;
  }

  return new Promise((resolve, reject) => {
    zlib.inflate(data, (err, result) => {
      if (err) {
        console.error(err);
        return resolve(data);
      }

      resolve(result);
    });
  });
};

const sqlite3Types = Object.freeze({
  SQLITE_BLOB: 'BLOB',
  SQLITE_FLOAT: 'FLOAT',
  SQLITE_INTEGER: 'INTEGER',
  SQLITE_NULL: 'NULL',
  SQLITE_TEXT: 'TEXT',
});

const isSqliteBlob = (value: *): bool => {
  // @todo Implement this method according to the SQLite specs.
  // if( sqlite3_value_type(argv[0])==SQLITE_BLOB )
  return true;
};

module.exports = {
  compress,
  uncompress,
};
