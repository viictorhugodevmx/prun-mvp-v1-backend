const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    walkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Walk',
      required: true,
      unique: true,
    },

    prownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    prunnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Rating', ratingSchema);