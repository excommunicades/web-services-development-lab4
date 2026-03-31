const http = require('http');

const port = Number(process.argv[2]);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && new URL(req.url, 'http://localhost').pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Manual HTTP Router');
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port);
