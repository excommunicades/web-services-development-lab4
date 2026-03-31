const http = require('http');

const port = Number(process.argv[2]);

const server = http.createServer((req, res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port);
