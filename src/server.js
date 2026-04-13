const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`🚀 Prun backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();