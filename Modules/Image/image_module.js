const cloudinary = require("../../cloudinary_config");

const legacyMap = require("./legacy_image_map.json");

const CLOUD = "lxi4x7zb";
const PROD_BASE = "https://backend.seapropertiesltd.com.bd";

// Public origin of this API, used in links so Cloudinary is never exposed.
const publicBase = (req) => (/^(localhost|127\.0\.0\.1)/.test(req.get("host")) ? `${req.protocol}://${req.get("host")}` : PROD_BASE);

// Upload Image (Cloudinary)
const upload_image = async (req, res, next) => {
      try {
            const isImage = req.file.mimetype.startsWith("image");
            const result = await new Promise((resolve, reject) => {
                  cloudinary.uploader
                        .upload_stream(
                              { folder: "sea-properties", resource_type: isImage ? "image" : "raw" },
                              (err, uploaded) => (err ? reject(err) : resolve(uploaded))
                        )
                        .end(req.file.buffer);
            });
            // Cloudinary public_id is "sea-properties/<name>"; raw files keep their extension in it.
            const name = isImage ? `${result.public_id.split("/").pop()}.${result.format}` : result.public_id.split("/").pop();
            res.json({ imageUrl: `${publicBase(req)}/api/v1/image/${name}` });
      } catch (err) {
            next(err);
      }
};

// Serve an image from Cloudinary under our own URL: /image/<name>.<ext>?w=&h=&fit=&fmt=
// Old numeric ids (/image/524.jpg) resolve through the legacy map.
const get_image_by_id = async (req, res, next) => {
      try {
            let name = req.params.id;
            const legacy = legacyMap[name.replace(/\.[^/.]+$/, "")];
            if (legacy) name = legacy.split("/").pop();
            if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/.test(name)) return res.status(404).json({ error: "Image not found" });

            const isRaw = name.endsWith(".pdf");
            const { w, h, fit, fmt } = req.query;
            const tr = isRaw
                  ? ""
                  : [
                        `f_${fmt === "jpg" ? "jpg" : "auto"}`,
                        "q_auto",
                        /^\d{1,4}$/.test(w) && `w_${w}`,
                        /^\d{1,4}$/.test(h) && `h_${h}`,
                        fit === "pad" ? "c_pad,b_white" : fit === "fill" ? "c_fill" : (w || h) && "c_limit",
                  ].filter(Boolean).join(",") + "/";
            const upstream = `https://res.cloudinary.com/${CLOUD}/${isRaw ? "raw" : "image"}/upload/${tr}sea-properties/${name}`;

            const r = await fetch(upstream, { headers: { Accept: req.get("accept") || "*/*" } });
            if (!r.ok) return res.status(404).json({ error: "Image not found" });

            res.set({
                  "Content-Type": r.headers.get("content-type"),
                  "Cache-Control": "public, max-age=31536000, immutable",
                  Vary: "Accept",
                  "Access-Control-Allow-Origin": "*",
            });
            res.send(Buffer.from(await r.arrayBuffer()));
      } catch (err) {
            next(err);
      }
};

// Rewrite Cloudinary links inside a JSON string to our own image URLs.
const CLOUDINARY_LINK = /https:\/\/res\.cloudinary\.com\/lxi4x7zb\/(?:image|raw)\/upload\/(?:[^/"\s\\]*,[^/"\s\\]*\/)?(?:v\d+\/)?sea-properties\/([A-Za-z0-9_.-]+)/g;
const hide_cloudinary = (req, res, next) => {
      const send = res.send.bind(res);
      res.send = (body) => {
            if (typeof body === "string" && /json/.test(res.get("Content-Type") || "")) {
                  body = body.replace(CLOUDINARY_LINK, (_, name) => `${publicBase(req)}/api/v1/image/${name}`);
            }
            return send(body);
      };
      next();
};

module.exports = { upload_image, get_image_by_id, hide_cloudinary };
