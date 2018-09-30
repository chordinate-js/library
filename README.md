# Chordinate Library Manager

Build and maintain your media library using the Chordinate Library Manager.

It's built on the [SQLite Archive](https://sqlite.org/sqlar.html) format, where
a single [SQLite](https://sqlite.org) database will act as a single-file container,
wrapping both your files and their metadata.

> See the [official documentation](https://sqlite.org/sqlar.html) for additional information.

## Quick API tour

### Initializing a library archive

```js
const openLibrary = require('@chordinate/library');

// Creating and loading your library.
const myLibrary = openLibrary('/path/to/my-library.sqlar');
```

### Adding a file to a library archive

```js
const { Buffer } = require('buffer');

const file = {
  name: 'my-file.pro',
  mode: 33188,
  lastModified: new Date(),
  size: 8, // contentsBuffer.byteLength;
  contents: Buffer.from('Hello world!'),
};

// Add the file to your library.
// Or overwrite an existing one that has the same name.
await myLibrary.files.save(file);
```

### Reading files from a library archive

```js
// Reading a file from your library.
const file = await library.files.load('my-file.pro');

console.log(
  file.contents.toString(), // 'Hello world!'
);
```

## Accessing files from the archive via CLI

Data can also be extracted via the [command line](https://sqlite.org/sqlar.html#managing_an_sqlite_archive_from_the_command_line).

```bash
# List files in an existing archive
$ sqlite3 /path/to/my-library.sqlar -Atv

# Extract all ChordPro files from an existing archive
$ sqlite3 /path/to/my-library.sqlar -Ax *.pro
```

See the [official documentation](https://sqlite.org/sqlar.html#managing_an_sqlite_archive_from_the_command_line)
for an overview of the available commands and additional information.
