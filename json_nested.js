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

  if (req.method === 'POST' && pathname === '/json-nested') {
    const body = await readBody(req);

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
      return;
    }

    const user = parsed.user;
    if (!user || typeof user !== 'object') {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('Missing user');
      return;
    }

    if (!Array.isArray(user.roles)) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      res.end('Invalid roles');
      return;
    }

    const result = {
      name: user.name,
      roleCount: user.roles.length,
      isAdmin: user.roles.includes('admin'),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
