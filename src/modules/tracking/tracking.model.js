const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema(
  {
    walkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Walk',
      required: true,
      index: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WalkTrackingPoint', trackingSchema);