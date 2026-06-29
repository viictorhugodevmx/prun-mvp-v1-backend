const { Server } = require('socket.io');
const env = require('../config/env');
const registerTrackingSocket = require('./tracking.socket');

let ioInstance = null;

const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      methods: ['GET', 'POST'],
    },
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    registerTrackingSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!ioInstance) {
    return null;
  }

  return ioInstance;
};

module.exports = initSockets;
module.exports.getIO = getIO;