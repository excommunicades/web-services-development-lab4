const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]);
const dataPath = path.join(process.cwd(), 'data.json');

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'GET' && pathname === '/data') {
    fs.readFile(dataPath, 'utf8', (err, raw) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Cannot read data.json');
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON in data.json');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsed));
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
