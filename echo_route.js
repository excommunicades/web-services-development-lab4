const http = require('http');

const port = Number(process.argv[2]);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/echo') {
    const msg = url.searchParams.get('msg') ?? '';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(msg);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port);
