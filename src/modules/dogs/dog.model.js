const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
      required: true,
      enum: ['small', 'medium', 'large'],
    },
    breed: {
      type: String,
      default: null,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dog', dogSchema);