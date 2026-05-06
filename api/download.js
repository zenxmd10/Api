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

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url, fid } = req.query;
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
      return res.status(404).json({ success: false, error: "No files found" });
    }

    const shareid = info.shareid;
    const uk = info.uk;

    // pick specific file or first one
    const targetFile = fid
      ? info.list.find((f) => String(f.fs_id) === String(fid))
      : info.list[0];

    if (!targetFile) {
      return res.status(404).json({ success: false, error: "File ID not found" });
    }

    const params = new URLSearchParams({
      app_id: "250528",
      shareid: String(shareid),
      uk: String(uk),
      fid_list: `[${targetFile.fs_id}]`,
    });

    const dlRes = await fetch(
      `https://www.terabox.com/api/download?${params}`,
      { headers: HEADERS }
    );
    const dl = await dlRes.json();

    if (!dl.dlink) {
      return res.status(500).json({ success: false, error: "No dlink returned", raw: dl });
    }

    // Redirect browser directly to terabox CDN
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(targetFile.server_filename)}"`
    );
    return res.redirect(302, dl.dlink);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
