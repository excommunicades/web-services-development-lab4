const http = require('http');

const port = Number(process.argv[2]);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && new URL(req.url, 'http://localhost').pathname === '/time') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port);
