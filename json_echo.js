const http = require('http');

const port = Number(process.argv[2]);

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

  if (req.method === 'POST' && pathname === '/json-echo') {
    const body = await readBody(req);

    if (!body) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing body');
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(parsed));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
