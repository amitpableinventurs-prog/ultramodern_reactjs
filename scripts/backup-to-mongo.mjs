/**
 * Copies the UltraModern CMS database (SQLite, umt-data/cms.sqlite) into MongoDB
 * as a backup. The website keeps running on SQLite; this is a read-only copy.
 *
 *   npm run backup:mongo
 *
 * Env overrides:
 *   MONGODB_URI   default mongodb://127.0.0.1:27017
 *   MONGO_DB      default ultramodern
 *   UMT_DATA_DIR  folder holding cms.sqlite (default ./umt-data)
 *
 * Each run replaces the collections projects / posts / jobs / admins with the
 * current SQLite contents and adds one row to the `backup_log` collection.
 * It then exports every collection of that database to
 * backups/mongo/<db>-<YYYY-MM-DD>/<collection>.json (mongoimport --jsonArray format).
 *
 * Single-collection mode:  npm run backup:mongo:single   (or add --single)
 *   Puts everything into ONE collection (default `cms_backup`, env MONGO_COLLECTION).
 *   Every document has `type` (project | post | job | admin) and `_id` "<type>:<slug or id>".
 *   Exports it to one file: backups/mongo/<db>-<collection>-<YYYY-MM-DD>.json
 *   Restore: mongoimport --db ultramodern --collection cms_backup --jsonArray --file <that file>
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient, BSON } from 'mongodb';

const { EJSON } = BSON;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.UMT_DATA_DIR || path.join(root, 'umt-data');
const sqlitePath = path.join(dataDir, 'cms.sqlite');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGO_DB || 'ultramodern';

if (!existsSync(sqlitePath)) {
  console.error(`SQLite database not found: ${sqlitePath}`);
  process.exit(1);
}

const sqlite = new DatabaseSync(sqlitePath, { readOnly: true });
const rows = (sql) => sqlite.prepare(sql).all();

function contentDoc(r) {
  let data;
  try { data = JSON.parse(r.data); } catch { data = { _raw: r.data }; }
  return {
    _id: r.slug,
    sqlite_id: r.id,
    slug: r.slug,
    published: Boolean(r.published),
    sort_order: r.sort_order,
    sort_date: r.sort_date,
    data,
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

const collections = {
  projects: rows('SELECT * FROM projects ORDER BY id').map(contentDoc),
  posts: rows('SELECT * FROM posts ORDER BY id').map(contentDoc),
  jobs: rows('SELECT * FROM jobs ORDER BY id').map(contentDoc),
  admins: rows('SELECT * FROM admins ORDER BY id').map((r) => ({
    _id: r.id,
    name: r.name,
    email: r.email,
    password_hash: r.password_hash,
    created_at: r.created_at,
    last_login_at: r.last_login_at,
  })),
};
sqlite.close();

const single = process.argv.includes('--single');
const singleName = process.env.MONGO_COLLECTION || 'cms_backup';
const typeOf = { projects: 'project', posts: 'post', jobs: 'job', admins: 'admin' };

const client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
try {
  const db = client.db(dbName);
  if (single) {
    const backedUpAt = new Date();
    const docs = Object.entries(collections).flatMap(([name, list]) => list.map((d) => ({
      ...d,
      _id: `${typeOf[name]}:${d.slug ?? d._id}`,
      type: typeOf[name],
      backed_up_at: backedUpAt,
    })));
    const col = db.collection(singleName);
    await col.deleteMany({});
    if (docs.length) await col.insertMany(docs);
    const counts = Object.fromEntries(Object.entries(collections).map(([n, l]) => [typeOf[n], l.length]));
    console.log(`Backed up ${sqlitePath} -> ${uri.replace(/\/\/[^@]*@/, '//***@')}/${dbName}.${singleName} (${docs.length} documents)`);
    console.table(counts);
    const outDir = path.join(root, 'backups', 'mongo');
    mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${dbName}-${singleName}-${backedUpAt.toISOString().slice(0, 10)}.json`);
    writeFileSync(file, EJSON.stringify(await col.find().sort({ type: 1, sort_order: 1, _id: 1 }).toArray(), null, 2, { relaxed: false }));
    console.log(`Exported ${file}`);
  } else {
  const counts = {};
  for (const [name, docs] of Object.entries(collections)) {
    const col = db.collection(name);
    await col.deleteMany({});
    if (docs.length) await col.insertMany(docs);
    counts[name] = docs.length;
  }
  await db.collection('backup_log').insertOne({ at: new Date(), source: sqlitePath, counts });
  console.log(`Backed up ${sqlitePath} -> ${uri.replace(/\/\/[^@]*@/, '//***@')}/${dbName}`);
  console.table(counts);

  // Also export every collection to backups/mongo/<db>-<date>/<collection>.json
  // (Extended JSON arrays, restorable with: mongoimport --db ultramodern --collection <name> --jsonArray --file <name>.json)
  const stamp = new Date().toISOString().slice(0, 10);
  const outDir = path.join(root, 'backups', 'mongo', `${dbName}-${stamp}`);
  mkdirSync(outDir, { recursive: true });
  for (const { name } of await db.listCollections().toArray()) {
    const docs = await db.collection(name).find().toArray();
    writeFileSync(path.join(outDir, `${name}.json`), EJSON.stringify(docs, null, 2, { relaxed: false }));
  }
  console.log(`Exported JSON files to ${outDir}`);
  }
} finally {
  await client.close();
}
