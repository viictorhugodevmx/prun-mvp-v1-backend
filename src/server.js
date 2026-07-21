const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const initSockets = require('./sockets');

let server;

const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down Prun backend...`);

  if (!server) {
    await mongoose.connection.close();
    process.exit(0);
  }

  server.close(async (error) => {
    if (error) {
      console.error('❌ Error closing HTTP server:', error);
      process.exit(1);
    }

    try {
      await mongoose.connection.close();
      console.log('✅ HTTP server closed');
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    } catch (dbError) {
      console.error('❌ Error closing MongoDB connection:', dbError);
      process.exit(1);
    }
  });
};

const startServer = async () => {
  await connectDB();

  server = http.createServer(app);

  initSockets(server);

  server.listen(env.port, () => {
    console.log(`🚀 Prun backend running on port ${env.port}`);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('❌ Prun backend failed to start:', error);
  process.exit(1);
});
