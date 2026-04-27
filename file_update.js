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
  const match = pathname.match(/^\/data\/([^/]+)$/);

  if (req.method === 'PUT' && match) {
    const id = match[1];
    const body = await readBody(req);

    let bodyParsed;
    try {
      bodyParsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON body');
      return;
    }

    let raw;
    try {
      raw = fs.readFileSync(dataPath, 'utf8');
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Cannot read data.json');
      return;
    }

    let items;
    try {
      items = JSON.parse(raw);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Invalid data.json');
      return;
    }

    const idx = items.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    items[idx] = { ...items[idx], ...bodyParsed, id: items[idx].id };

    try {
      fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Cannot write data.json');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items[idx]));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
