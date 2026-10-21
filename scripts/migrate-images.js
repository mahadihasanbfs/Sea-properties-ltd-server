// Usage: node scripts/migrate-images.js scan|migrate
// scan    : read-only, lists every legacy image URL found in MongoDB
// migrate : backs up affected docs, uploads images to Cloudinary, rewrites links
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cloudinary = require("../cloudinary_config");

const uri = `mongodb+srv://sea-property-ltd:sea-property-ltd@sea-property-ltd.swfflkv.mongodb.net/?retryWrites=true&w=majority&appName=sea-property-ltd`;
const LEGACY = /https?:\/\/(?:backend\.seapropertiesltd\.com\.bd|localhost:\d+)\/api\/v1\/image\/([A-Za-z0-9]+)\.(jpg|pdf)/g;
const SKIP_DBS = ["admin", "local", "config"];

const urlsIn = (value, found = new Set()) => {
      if (typeof value === "string") for (const m of value.matchAll(LEGACY)) found.add(m[0]);
      else if (Array.isArray(value)) value.forEach((v) => urlsIn(v, found));
      else if (value && typeof value === "object" && !value._bsontype) Object.values(value).forEach((v) => urlsIn(v, found));
      return found;
};

const rewrite = (value, map) => {
      if (typeof value === "string") return value.replace(LEGACY, (u) => map.get(u) || u);
      if (Array.isArray(value)) return value.map((v) => rewrite(v, map));
      if (value && typeof value === "object" && !value._bsontype)
            return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, rewrite(v, map)]));
      return value;
};

const upload = async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const isPdf = url.endsWith(".pdf");
      const out = await new Promise((resolve, reject) =>
            cloudinary.uploader
                  .upload_stream({ folder: "sea-properties", resource_type: isPdf ? "raw" : "image" }, (e, r) => (e ? reject(e) : resolve(r)))
                  .end(buf)
      );
      return out.secure_url;
};

(async () => {
      const mode = process.argv[2];
      if (!["scan", "migrate"].includes(mode)) throw new Error("mode: scan|migrate");
      const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
      await client.connect();
      const dbs = (await client.db().admin().listDatabases()).databases.map((d) => d.name).filter((n) => !SKIP_DBS.includes(n));

      const hits = []; // {db, col, doc}
      const all = new Set();
      for (const dbName of dbs) {
            const db = client.db(dbName);
            for (const { name } of await db.listCollections().toArray()) {
                  const docs = await db.collection(name).find({}).toArray();
                  let n = 0;
                  for (const doc of docs) {
                        const u = urlsIn(doc);
                        if (u.size) { hits.push({ dbName, name, doc }); u.forEach((x) => all.add(x)); n++; }
                  }
                  console.log(`${dbName}.${name}: ${docs.length} docs, ${n} with legacy links`);
            }
      }
      console.log(`\nunique legacy URLs: ${all.size}, docs affected: ${hits.length}`);
      if (mode === "scan") return client.close();

      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backup = path.join(__dirname, `backup-${stamp}.json`);
      fs.writeFileSync(backup, JSON.stringify(hits, null, 2));
      console.log("backup:", backup);

      const mapFile = path.join(__dirname, "image-map.json");
      const map = new Map(fs.existsSync(mapFile) ? Object.entries(JSON.parse(fs.readFileSync(mapFile))) : []);
      for (const url of all) {
            if (map.has(url)) continue;
            try {
                  map.set(url, await upload(url));
                  fs.writeFileSync(mapFile, JSON.stringify(Object.fromEntries(map), null, 2));
                  console.log("ok  ", url, "->", map.get(url));
            } catch (e) {
                  console.log("FAIL", url, e.message);
            }
      }

      let updated = 0;
      for (const { dbName, name, doc } of hits) {
            const { _id, ...rest } = rewrite(doc, map);
            await client.db(dbName).collection(name).updateOne({ _id }, { $set: rest });
            updated++;
      }
      console.log(`updated ${updated} docs; unmapped (failed) links stay as-is`);
      await client.close();
})().catch((e) => { console.error(e); process.exit(1); });
