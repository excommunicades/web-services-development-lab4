const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]);
const dataPath = path.join(process.cwd(), 'data.json');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const match = pathname.match(/^\/data\/([^/]+)$/);

  if (req.method === 'DELETE' && match) {
    const id = match[1];

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
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON in data.json');
      return;
    }

    const idx = items.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const removed = items.splice(idx, 1)[0];

    try {
      fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Cannot write data.json');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(removed));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
