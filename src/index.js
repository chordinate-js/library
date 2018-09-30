// @flow

const sqlite = require('sqlite');
const { Library } = require('./Library');

const openLibrary = async (filename: string): Promise<Library> => {
  const db = await sqlite.open(filename);

  const library = new Library(db);
  await library.initialize();

  return library;
};

module.exports = openLibrary;
