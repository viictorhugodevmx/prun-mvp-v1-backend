const registerTrackingSocket = (_io, socket) => {
  socket.on('walk:join', ({ walkId }) => {
    if (!walkId) {
      return;
    }

    socket.join(`walk:${walkId}`);
    console.log(`📍 Socket ${socket.id} joined walk:${walkId}`);
  });

  socket.on('walk:leave', ({ walkId }) => {
    if (!walkId) {
      return;
    }

    socket.leave(`walk:${walkId}`);
    console.log(`📍 Socket ${socket.id} left walk:${walkId}`);
  });
};

module.exports = registerTrackingSocket;