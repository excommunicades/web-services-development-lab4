const http = require('http');
const fs = require('fs/promises');
const path = require('path');

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

  if (req.method === 'POST' && pathname === '/error-handling') {
    const body = await readBody(req);

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    if (!Array.isArray(parsed)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Body must be an array');
      return;
    }

    const results = await Promise.allSettled(
      parsed.map((name) => fs.readFile(path.join(process.cwd(), name), 'utf8'))
    );

    const successes = [];
    const failures = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        successes.push({ file: parsed[i], content: r.value });
      } else {
        failures.push({ file: parsed[i], error: String(r.reason && r.reason.message || r.reason) });
      }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ successes, failures, total: parsed.length }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
