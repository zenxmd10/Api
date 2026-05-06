const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

const NDUS = process.env.TERABOX_NDUS;

const HEADERS = {
  Cookie: `ndus=${NDUS}; lang=en`,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
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

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, error: "Missing 'url' param" });
  }

  try {
    const shortId = extractShortId(url);

    const infoRes = await fetch(
      `https://www.terabox.com/api/shorturlinfo?shorturl=${shortId}&root=1`,
      { headers: HEADERS }
    );
    const info = await infoRes.json();

    if (!info.list || info.list.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No files found. Link expired or cookie dead.",
        errno: info.errno || null,
      });
    }

    const shareid = info.shareid;
    const uk = info.uk;
    const files = [];

    for (const file of info.list) {
      const params = new URLSearchParams({
        app_id: "250528",
        shareid: String(shareid),
        uk: String(uk),
        fid_list: `[${file.fs_id}]`,
      });

      const dlRes = await fetch(
        `https://www.terabox.com/api/download?${params}`,
        { headers: HEADERS }
      );
      const dl = await dlRes.json();

      files.push({
        filename: file.server_filename,
        size_bytes: file.size,
        size_readable: formatBytes(file.size),
        fs_id: String(file.fs_id),
        dlink: dl.dlink || null,
        is_dir: file.isdir === 1,
        thumbnail: file.thumbs
          ? file.thumbs.url3 || file.thumbs.url2 || file.thumbs.url1
          : null,
        md5: file.md5 || null,
      });
    }

    return res.status(200).json({
      success: true,
      shareid: String(shareid),
      uk: String(uk),
      total_files: files.length,
      files,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
