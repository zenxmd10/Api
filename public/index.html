<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terabox Downloader</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #050505;
      color: #d0d0d0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 16px;
    }

    .wrap { width: 100%; max-width: 640px; }

    h1 {
      font-size: 2rem;
      color: #fff;
      margin-bottom: 4px;
    }

    .tag {
      display: inline-block;
      font-size: 0.7rem;
      background: #1a2a1a;
      color: #4f8;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 24px;
      font-weight: 600;
    }

    .sub {
      color: #555;
      font-size: 0.85rem;
      margin-bottom: 28px;
      line-height: 1.5;
    }

    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    input {
      flex: 1;
      padding: 14px 16px;
      border: 1px solid #1a1a1a;
      border-radius: 10px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    input:focus { border-color: #4f8cff; }
    input::placeholder { color: #333; }

    .btn {
      padding: 14px 22px;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-primary { background: #4f8cff; color: #fff; }
    .btn-primary:hover { background: #3b6fcc; }
    .btn-primary:disabled { background: #151515; color: #444; cursor: not-allowed; }

    .status {
      font-size: 0.82rem;
      color: #555;
      min-height: 22px;
      margin-bottom: 20px;
    }

    .status.err { color: #f55; }
    .status.ok { color: #4f8; }

    .loader {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #333;
      border-top-color: #4f8cff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      vertical-align: middle;
      margin-right: 6px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .files { display: flex; flex-direction: column; gap: 10px; }

    .card {
      background: #0d0d0d;
      border: 1px solid #151515;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      gap: 14px;
      align-items: center;
      transition: border-color 0.2s;
    }

    .card:hover { border-color: #222; }

    .thumb {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      object-fit: cover;
      background: #111;
      flex-shrink: 0;
    }

    .finfo { flex: 1; min-width: 0; }

    .fname {
      font-weight: 600;
      font-size: 0.88rem;
      color: #eee;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .fmeta {
      font-size: 0.75rem;
      color: #444;
      margin-top: 4px;
    }

    .btn-group {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .btn-dl {
      padding: 8px 14px;
      font-size: 0.78rem;
      border-radius: 8px;
      border: 1px solid #1a2a1a;
      background: #0d1a0d;
      color: #4f8;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.15s;
    }

    .btn-dl:hover { background: #1a2a1a; }

    .btn-stream {
      padding: 8px 14px;
      font-size: 0.78rem;
      border-radius: 8px;
      border: 1px solid #1a1a2a;
      background: #0d0d1a;
      color: #88f;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.15s;
    }

    .btn-stream:hover { background: #1a1a2a; }

    .btn-dl.disabled, .btn-stream.disabled {
      opacity: 0.3;
      pointer-events: none;
    }

    .api-section {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #111;
    }

    .api-section h2 {
      font-size: 1rem;
      color: #888;
      margin-bottom: 16px;
    }

    .endpoint {
      background: #0a0a0a;
      border: 1px solid #151515;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
      font-family: "SF Mono", "Fira Code", monospace;
      font-size: 0.78rem;
      color: #4f8cff;
      word-break: break-all;
      line-height: 1.6;
    }

    .endpoint .method {
      color: #4f8;
      font-weight: 700;
    }

    .endpoint .desc {
      color: #555;
      font-family: -apple-system, sans-serif;
    }

    @media (max-width: 500px) {
      .input-row { flex-direction: column; }
      .btn-group { flex-direction: column; }
      .card { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>⚡ Terabox DL</h1>
    <span class="tag">API + PROXY STREAM</span>
    <p class="sub">
      Paste any Terabox share link. Get direct download links or stream through proxy.
    </p>

    <div class="input-row">
      <input
        type="text"
        id="urlInput"
        placeholder="https://www.terabox.com/s/1xxxxxx"
        autocomplete="off"
        spellcheck="false"
      />
      <button class="btn btn-primary" id="fetchBtn" onclick="go()">
        Fetch
      </button>
    </div>

    <div class="status" id="status"></div>
    <div class="files" id="files"></div>

    <div class="api-section">
      <h2>API Endpoints</h2>

      <div class="endpoint">
        <span class="method">GET</span> /api/info?url={TERABOX_LINK}<br />
        <span class="desc">→ Returns JSON with file info + direct links</span>
      </div>

      <div class="endpoint">
        <span class="method">GET</span> /api/download?url={TERABOX_LINK}&fid={optional}<br />
        <span class="desc">→ 302 redirect to Terabox CDN (fast, may be blocked by some browsers)</span>
      </div>

      <div class="endpoint">
        <span class="method">GET</span> /api/stream?url={TERABOX_LINK}&fid={optional}<br />
        <span class="desc">→ Proxied stream through server (always works, supports Range headers for video seeking)</span>
      </div>
    </div>
  </div>

  <script>
    const $ = (id) => document.getElementById(id);

    $("urlInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });

    async function go() {
      const url = $("urlInput").value.trim();
      if (!url) {
        setStatus("Paste a link.", true);
        return;
      }

      $("fetchBtn").disabled = true;
      $("files").innerHTML = "";
      setStatus('<span class="loader"></span> Fetching file info...');

      try {
        const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (!data.success) {
          setStatus(data.error || "Failed.", true);
          return;
        }

        setStatus(`${data.total_files} file(s) found`, false, true);

        data.files.forEach((f) => {
          const card = document.createElement("div");
          card.className = "card";

          const thumbHtml = f.thumbnail
            ? `<img class="thumb" src="${f.thumbnail}" alt="" loading="lazy" />`
            : `<div class="thumb"></div>`;

          const dlUrl = `/api/download?url=${encodeURIComponent(url)}&fid=${f.fs_id}`;
          const streamUrl = `/api/stream?url=${encodeURIComponent(url)}&fid=${f.fs_id}`;

          const hasDl = !!f.dlink;

          card.innerHTML = `
            ${thumbHtml}
            <div class="finfo">
              <div class="fname" title="${f.filename}">${f.filename}</div>
              <div class="fmeta">${f.size_readable} · ${f.fs_id}</div>
            </div>
            <div class="btn-group">
              <a href="${hasDl ? dlUrl : "#"}" class="btn-dl ${hasDl ? "" : "disabled"}" target="_blank">Direct</a>
              <a href="${hasDl ? streamUrl : "#"}" class="btn-stream ${hasDl ? "" : "disabled"}" target="_blank">Stream</a>
            </div>
          `;

          $("files").appendChild(card);
        });
      } catch (err) {
        setStatus("Network error: " + err.message, true);
      } finally {
        $("fetchBtn").disabled = false;
      }
    }

    function setStatus(msg, isErr = false, isOk = false) {
      const el = $("status");
      el.innerHTML = msg;
      el.className = `status ${isErr ? "err" : ""} ${isOk ? "ok" : ""}`;
    }
  </script>
</body>
</html>
