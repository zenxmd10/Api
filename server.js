const http = require('http');
const url = require('url');
const downloadHandler = require('./api/download');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (parsed.pathname === '/api/download') {
    req.query = parsed.query;
    await downloadHandler(req, res);
  } else if (parsed.pathname === '/') {
    res.setHeader('Content-Type', 'text/html');
    const fs = require('fs');
    const path = require('path');
    const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    res.end(html);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
