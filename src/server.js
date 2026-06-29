const http = require('http');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  initSockets(server);

  server.listen(env.port, () => {
    console.log(`🚀 Prun backend running on port ${env.port}`);
  });
};

startServer();