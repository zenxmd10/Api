const fetch = require('node-fetch');

// Parse short ID from multiple terabox domains
function parseShareId(url) {
  // Handle /s/1xxxxx format
  const sMatch = url.match(/\/s\/([A-Za-z0-9_-]+)/);
  if (sMatch) return sMatch[1];

  // Handle ?surl=xxxxx format
  const urlObj = new URL(url);
  const surl = urlObj.searchParams.get('surl');
  if (surl) return surl;

  return null;
}

async function getFileList(shareId, ndus) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Cookie': `ndus=${ndus}`,
    'Accept': 'application/json, text/plain, */*',
    'Referer': 'https://www.terabox.com/'
  };

  // Step 1: Get shareid & uk from short URL page
  const shortInfoUrl = `https://www.terabox.com/api/shorturlinfo?shorturl=${shareId}&root=1`;
  console.log('[1] Fetching shorturl info:', shortInfoUrl);

  const infoRes = await fetch(shortInfoUrl, { headers });
  const infoText = await infoRes.text();
  console.log('[1] Response status:', infoRes.status);
  console.log('[1] Response body (first 500):', infoText.substring(0, 500));

  let infoData;
  try {
    infoData = JSON.parse(infoText);
  } catch (e) {
    throw new Error('Failed to parse shorturl info: ' + infoText.substring(0, 200));
  }

  if (infoData.errno !== 0) {
    throw new Error(`Terabox shorturl API error: errno=${infoData.errno}, msg=${infoData.errmsg || 'unknown'}`);
  }

  const shareid = infoData.shareid;
  const uk = infoData.uk;
  const fileList = infoData.list || [];

  console.log('[1] shareid:', shareid, 'uk:', uk, 'files:', fileList.length);

  if (fileList.length === 0) {
    // Try nested folder — path might be /
    const listUrl = `https://www.terabox.com/share/list?shorturl=${shareId}&shareid=${shareid}&uk=${uk}&root=1&dir=%2F&page=1&num=100`;
    console.log('[2] Trying share/list:', listUrl);

    const listRes = await fetch(listUrl, { headers });
    const listText = await listRes.text();
    console.log('[2] Response (first 500):', listText.substring(0, 500));

    let listData;
    try {
      listData = JSON.parse(listText);
    } catch (e) {
      throw new Error('Failed to parse share/list: ' + listText.substring(0, 200));
    }

    if (listData.list && listData.list.length > 0) {
      return { shareid, uk, files: listData.list };
    }
  }

  return { shareid, uk, files: fileList };
}

async function getDownloadLink(shareid, uk, fsId, ndus) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Cookie': `ndus=${ndus}`,
    'Referer': 'https://www.terabox.com/'
  };

  const dlUrl = `https://www.terabox.com/share/download?shareid=${shareid}&uk=${uk}&fid_list=[${fsId}]&extra=%7B%22sekey%22%3A%22%22%7D`;
  console.log('[3] Fetching download link:', dlUrl);

  const res = await fetch(dlUrl, { headers, redirect: 'manual' });

  // Sometimes it redirects directly
  if (res.status === 302) {
    return res.headers.get('location');
  }

  const text = await res.text();
  console.log('[3] Response (first 500):', text.substring(0, 500));

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse download response');
  }

  if (data.dlink) return data.dlink;
  if (data.list && data.list[0] && data.list[0].dlink) return data.list[0].dlink;

  return null;
}

module.exports = async (req, res) => {
  const { url } = req.query;
  const ndus = process.env.TERABOX_NDUS;

  if (!url) {
    return res.status(400).json({ success: false, error: 'Missing url parameter' });
  }

  if (!ndus) {
    return res.status(500).json({ success: false, error: 'TERABOX_NDUS env not set' });
  }

  try {
    const shareId = parseShareId(url);
    if (!shareId) {
      return res.status(400).json({ success: false, error: 'Could not parse share ID from URL' });
    }

    console.log('Parsed shareId:', shareId);

    const { shareid, uk, files } = await getFileList(shareId, ndus);

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No files found',
        debug: { shareId, shareid, uk }
      });
    }

    // Build result with download links
    const results = [];
    for (const file of files) {
      const fsId = file.fs_id;
      let dlink = file.dlink || null;

      if (!dlink) {
        try {
          dlink = await getDownloadLink(shareid, uk, fsId, ndus);
        } catch (e) {
          console.log('Download link failed for', fsId, e.message);
        }
      }

      results.push({
        filename: file.server_filename || file.filename,
        size: file.size,
        fs_id: fsId,
        isdir: file.isdir,
        dlink: dlink,
        thumbs: file.thumbs || null
      });
    }

    return res.json({
      success: true,
      shareid,
      uk,
      total: results.length,
      files: results
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
