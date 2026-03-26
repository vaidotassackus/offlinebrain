export const CREATE_PACKS_TABLE = `
CREATE TABLE IF NOT EXISTS packs (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL,
  version     TEXT NOT NULL,
  is_required INTEGER DEFAULT 0,
  is_installed INTEGER DEFAULT 0,
  installed_at INTEGER,
  updated_at  INTEGER
);`;

export const CREATE_ARTICLES_TABLE = `
CREATE TABLE IF NOT EXISTS articles (
  id          TEXT PRIMARY KEY,
  pack_id     TEXT NOT NULL REFERENCES packs(id),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT,
  tags        TEXT,
  is_critical INTEGER DEFAULT 0,
  read_time   INTEGER,
  created_at  INTEGER,
  updated_at  INTEGER
);`;

export const CREATE_ARTICLES_FTS = `
CREATE VIRTUAL TABLE IF NOT EXISTS articles_fts USING fts5(
  title,
  content,
  tags,
  content='articles',
  content_rowid='rowid'
);`;

export const CREATE_FTS_TRIGGER_INSERT = `
CREATE TRIGGER IF NOT EXISTS articles_ai AFTER INSERT ON articles BEGIN
  INSERT INTO articles_fts(rowid, title, content, tags)
  VALUES (new.rowid, new.title, new.content, new.tags);
END;`;

export const CREATE_FTS_TRIGGER_DELETE = `
CREATE TRIGGER IF NOT EXISTS articles_ad AFTER DELETE ON articles BEGIN
  INSERT INTO articles_fts(articles_fts, rowid, title, content, tags)
  VALUES ('delete', old.rowid, old.title, old.content, old.tags);
END;`;

export const CREATE_HISTORY_TABLE = `
CREATE TABLE IF NOT EXISTS history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id  TEXT NOT NULL REFERENCES articles(id),
  viewed_at   INTEGER NOT NULL
);`;

export const CREATE_BOOKMARKS_TABLE = `
CREATE TABLE IF NOT EXISTS bookmarks (
  article_id  TEXT PRIMARY KEY REFERENCES articles(id),
  saved_at    INTEGER NOT NULL
);`;

export const CREATE_CHAT_MESSAGES_TABLE = `
CREATE TABLE IF NOT EXISTS chat_messages (
  id          TEXT PRIMARY KEY,
  role        TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);`;

export const CREATE_ARTICLE_EMBEDDINGS_TABLE = `
CREATE TABLE IF NOT EXISTS article_embeddings (
  article_id     TEXT PRIMARY KEY REFERENCES articles(id),
  embedding      BLOB NOT NULL,
  model_version  TEXT NOT NULL
);`;

export const CREATE_MAP_REGIONS_TABLE = `
CREATE TABLE IF NOT EXISTS map_regions (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  bounds_json      TEXT NOT NULL,
  size_bytes       INTEGER NOT NULL,
  download_status  TEXT NOT NULL DEFAULT 'available',
  downloaded_at    INTEGER
);`;
