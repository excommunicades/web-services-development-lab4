const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]);
const dataPath = path.join(process.cwd(), 'data.json');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'POST' && pathname === '/data') {
    const body = await readBody(req);

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    fs.writeFile(dataPath, JSON.stringify(parsed, null, 2), (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Cannot write data.json');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
