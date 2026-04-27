const http = require('http');
const crypto = require('crypto');

const port = Number(process.argv[2]);

function pbkdf2(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (req.method === 'GET' && pathname === '/threadpool-limit') {
    const start = Date.now();
    const tasks = 8;
    const promises = [];
    for (let i = 0; i < tasks; i++) {
      promises.push(pbkdf2(`password-${i}`, `salt-${i}`));
    }
    await Promise.all(promises);
    const durationMs = Date.now() - start;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ tasks, durationMs }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port);
