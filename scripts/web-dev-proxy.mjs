/**
 * Local web dev proxy — avoids browser CORS by serving API under the same origin.
 * Browser: http://localhost:8083/queueflow-api/... → https://api.caribbargains.com/queueflow-api/...
 * Everything else is forwarded to the Expo dev server on EXPO_PORT.
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import httpProxy from 'http-proxy';

const PROXY_PORT = Number(process.env.PROXY_PORT || 8090);
const EXPO_PORT = Number(process.env.EXPO_PORT || 8091);
const API_PREFIX = '/queueflow-api';
const API_TARGET = (
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/functions\/v1\/?$/, '') ||
  'https://api.caribbargains.com/queueflow-api'
).replace(/\/+$/, '');

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on('error', (_err, _req, res) => {
  if (res && typeof res.writeHead === 'function' && !res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error — is the Expo dev server running?');
  }
});

const server = http.createServer((req, res) => {
  if (req.url?.startsWith(API_PREFIX)) {
    proxy.web(req, res, { target: API_TARGET, changeOrigin: true, secure: true });
    return;
  }
  proxy.web(req, res, { target: `http://127.0.0.1:${EXPO_PORT}` });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, { target: `http://127.0.0.1:${EXPO_PORT}` });
});

const expo = spawn('npx', ['expo', 'start', '--web', '--port', String(EXPO_PORT)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

server.listen(PROXY_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\n  Banking Kiosk (web): http://localhost:${PROXY_PORT}/kiosk`);
  // eslint-disable-next-line no-console
  console.log(`  API proxied via:     http://localhost:${PROXY_PORT}${API_PREFIX}\n`);
});

function shutdown() {
  expo.kill('SIGTERM');
  server.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
