const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const dogRoutes = require('./modules/dogs/dog.routes');

const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const AppError = require('./utils/app-error');
const { successResponse } = require('./utils/api-response');


const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return res.status(200).json(
    successResponse({
      message: 'Prun backend is running',
      data: {
        status: 'ok',
        database: dbStatusMap[dbState] || 'unknown',
      },
    })
  );
});

app.get('/api/test-error', (_req, _res, next) => {
  return next(new AppError('Manual test error', 500));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;