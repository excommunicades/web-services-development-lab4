const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const port = Number(process.argv[2]);

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'GET' && pathname === '/sequential') {
    const start = Date.now();
    try {
      const a = await fs.readFile(path.join(process.cwd(), 'a.txt'), 'utf8');
      const b = await fs.readFile(path.join(process.cwd(), 'b.txt'), 'utf8');
      const c = await fs.readFile(path.join(process.cwd(), 'c.txt'), 'utf8');
      const elapsedMs = Date.now() - start;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ combined: a + b + c, elapsedMs }));
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Read error');
    }
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
