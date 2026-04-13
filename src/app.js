const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

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

  return res.status(200).json({
    success: true,
    message: 'Prun backend is running',
    data: {
      status: 'ok',
      database: dbStatusMap[dbState] || 'unknown',
    },
  });
});

module.exports = app;