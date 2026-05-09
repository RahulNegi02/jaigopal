const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const publicDir = path.join(__dirname, 'public');
const defaultPort = process.env.PORT ? Number(process.env.PORT) : 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function getFilePathFromRequest(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return path.join(publicDir, 'index.html');
  return path.join(publicDir, ...parts);
}

function now() {
  return new Date().toISOString();
}

function logRequest(req) {
  const ip = (req.socket && req.socket.remoteAddress) || 'unknown';
  try {
    console.log(now(), req.method, req.url, ip);
  } catch (e) {}
}

function requestHandler(req, res) {
  try {
    logRequest(req);
    const parsed = new url.URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsed.pathname || '/');
    const filePath = getFilePathFromRequest(pathname);

    const resolved = path.resolve(filePath);
    const base = path.resolve(publicDir);
    if (!resolved.startsWith(base)) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Bad request');
      console.log(now(), 'bad_request', req.url);
      return;
    }

    fs.stat(resolved, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(resolved).toLowerCase();
        const type = mime[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        const stream = fs.createReadStream(resolved);
        stream.on('open', () => console.log(now(), 'serve', resolved));
        stream.on('error', function(err) {
          console.log(now(), 'stream_error', err && err.message);
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Server error');
        });
        stream.pipe(res);
      } else {
        const indexFile = path.join(publicDir, 'index.html');
        fs.stat(indexFile, (ie, istats) => {
          if (!ie && istats.isFile()) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(indexFile).pipe(res);
            console.log(now(), 'spa_fallback', req.url);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            console.log(now(), 'not_found', req.url);
          }
        });
      }
    });
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
    console.log(now(), 'server_error', e && (e.stack || e.message));
  }
}

function start(port) {
  const server = http.createServer(requestHandler);
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(now(), `port_in_use`, port, 'retry', port + 1);
      start(port + 1);
    } else {
      console.error(now(), 'server_error', err && err.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log(now(), `listening`, `http://localhost:${port}`);
  });

  process.on('SIGINT', () => {
    console.log(now(), 'shutting_down');
    server.close(() => process.exit(0));
  });
}

start(defaultPort);
