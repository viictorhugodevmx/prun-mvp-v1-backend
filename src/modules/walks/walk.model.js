const mongoose = require('mongoose');
const { WALK_STATUS } = require('../../config/constants');

const walkSchema = new mongoose.Schema(
  {
    prownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    prunnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    dogIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dog',
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ['individual', 'group'],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(WALK_STATUS),
      default: WALK_STATUS.REQUESTED,
      index: true,
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    actualStartAt: {
      type: Date,
      default: null,
    },
    actualEndAt: {
      type: Date,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Walk', walkSchema);