const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const NDUS = process.env.TERABOX_NDUS;

const TERA_HEADERS = {
  Cookie: `ndus=${NDUS}; lang=en`,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "*/*",
  Referer: "https://www.terabox.com/",
  Origin: "https://www.terabox.com",
};

function extractShortId(url) {
  const sMatch = url.match(/\/s\/([A-Za-z0-9_-]+)/);
  if (sMatch) return sMatch[1];
  const surlMatch = url.match(/surl=([A-Za-z0-9_-]+)/);
  if (surlMatch) return surlMatch[1];
  return url.trim();
}

const MIME_MAP = {
  mp4: "video/mp4",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mp3: "audio/mpeg",
  flac: "audio/flac",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

function getMime(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return MIME_MAP[ext] || "application/octet-stream";
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url, fid } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "Missing 'url' param" });
  }

  try {
    const shortId = extractShortId(url);

    // Get file info
    const infoRes = await fetch(
      `https://www.terabox.com/api/shorturlinfo?shorturl=${shortId}&root=1`,
      { headers: TERA_HEADERS }
    );
    const info = await infoRes.json();

    if (!info.list || info.list.length === 0) {
      return res.status(404).json({ success: false, error: "No files found" });
    }

    const shareid = info.shareid;
    const uk = info.uk;

    const targetFile = fid
      ? info.list.find((f) => String(f.fs_id) === String(fid))
      : info.list[0];

    if (!targetFile) {
      return res.status(404).json({ success: false, error: "File not found" });
    }

    // Get download link
    const params = new URLSearchParams({
      app_id: "250528",
      shareid: String(shareid),
      uk: String(uk),
      fid_list: `[${targetFile.fs_id}]`,
    });

    const dlRes = await fetch(
      `https://www.terabox.com/api/download?${params}`,
      { headers: TERA_HEADERS }
    );
    const dl = await dlRes.json();

    if (!dl.dlink) {
      return res.status(500).json({ success: false, error: "No download link" });
    }

    // Stream file through our server
    const rangeHeader = req.headers.range || null;
    const fetchHeaders = { ...TERA_HEADERS };
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }

    const fileRes = await fetch(dl.dlink, {
      headers: fetchHeaders,
      redirect: "follow",
    });

    const filename = targetFile.server_filename;
    const contentType = getMime(filename);

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader("Accept-Ranges", "bytes");

    if (fileRes.headers.get("content-length")) {
      res.setHeader("Content-Length", fileRes.headers.get("content-length"));
    }
    if (fileRes.headers.get("content-range")) {
      res.setHeader("Content-Range", fileRes.headers.get("content-range"));
    }

    const statusCode = rangeHeader && fileRes.status === 206 ? 206 : 200;
    res.status(statusCode);

    // Pipe the stream
    const reader = fileRes.body;
    reader.pipe(res);

    reader.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream failed" });
      }
    });
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
