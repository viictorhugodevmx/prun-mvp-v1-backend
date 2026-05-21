const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    walkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Walk',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WalkPhoto', photoSchema);