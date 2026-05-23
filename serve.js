const http = require('http');
const { spawn } = require('child_process');

const START_PORT = 9000;
const MAX_PORT = 9999;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => { server.close(() => resolve(true)); });
    server.listen(port, '0.0.0.0');
  });
}

async function findFreePort() {
  for (let port = START_PORT; port <= MAX_PORT; port++) {
    if (await isPortFree(port)) return port;
  }
  console.error(`No free port found in range ${START_PORT}-${MAX_PORT}`);
  process.exit(1);
}

(async () => {
  const port = await findFreePort();
  console.log(`Starting server on port ${port}...`);
  const args = ['http-server', '.', '-p', String(port), '-c-1', '-o'];
  const child = spawn('npx', args, { stdio: 'inherit', shell: true });
  child.on('exit', code => process.exit(code));
})();

