const http = require('http');

const PORT = process.env.PORT || 3000;

const requestListener = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello from Simple Task App (placeholder)\n');
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Simple Task App running at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
