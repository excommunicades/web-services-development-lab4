const http = require('http');

const port = Number(process.argv[2]);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/sum') {
    const a = Number(url.searchParams.get('a'));
    const b = Number(url.searchParams.get('b'));
    if (!url.searchParams.has('a') || !url.searchParams.has('b') || isNaN(a) || isNaN(b)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid numbers' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sum: a + b }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port);
