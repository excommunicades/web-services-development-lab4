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

  if (req.method === 'POST' && pathname === '/json-array') {
    const body = await readBody(req);

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    if (!Array.isArray(parsed.numbers)) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('Missing numbers');
      return;
    }

    if (!parsed.numbers.every((n) => typeof n === 'number')) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('Non-numeric value');
      return;
    }

    const count = parsed.numbers.length;
    const sum = parsed.numbers.reduce((acc, n) => acc + n, 0);
    const average = count === 0 ? 0 : sum / count;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count, sum, average }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
