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

const VALID_OPS = new Set(['add', 'subtract', 'multiply', 'divide']);

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'POST' && pathname === '/json-calc') {
    const body = await readBody(req);

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    if (
      typeof parsed.a !== 'number' ||
      typeof parsed.b !== 'number' ||
      typeof parsed.operation !== 'string'
    ) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('Missing fields');
      return;
    }

    if (!VALID_OPS.has(parsed.operation)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid operation');
      return;
    }

    if (parsed.operation === 'divide' && parsed.b === 0) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Division by zero');
      return;
    }

    let result;
    switch (parsed.operation) {
      case 'add':
        result = parsed.a + parsed.b;
        break;
      case 'subtract':
        result = parsed.a - parsed.b;
        break;
      case 'multiply':
        result = parsed.a * parsed.b;
        break;
      case 'divide':
        result = parsed.a / parsed.b;
        break;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ result }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
