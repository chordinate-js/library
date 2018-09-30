-- Up

CREATE TABLE IF NOT EXISTS sqlar (
    name TEXT PRIMARY KEY,  -- name of the file
    mode INT,               -- access permissions
    mtime INT,              -- last modification time
    sz INT,                 -- original file size
    data BLOB               -- compressed content
);

-- Down

DROP TABLE sqlar;
