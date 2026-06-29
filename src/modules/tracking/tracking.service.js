const Walk = require('../walks/walk.model');
const TrackingPoint = require('./tracking.model');
const AppError = require('../../utils/app-error');
const { WALK_STATUS, ROLES } = require('../../config/constants');
const { sanitizeTrackingPoint } = require('./tracking.utils');
const { getIO } = require('../../sockets');

const addTrackingPoint = async (user, walkId, payload) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError('Only Prunner can send tracking', 403);
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  const isAssigned =
    walk.prunnerId && walk.prunnerId.toString() === user.id;

  if (!isAssigned) {
    throw new AppError('You can only send tracking for your assigned walks', 403);
  }

  if (walk.status !== WALK_STATUS.IN_PROGRESS) {
    throw new AppError('Tracking can only be sent during an active walk', 422);
  }

  const point = await TrackingPoint.create({
    walkId,
    lat: payload.lat,
    lng: payload.lng,
    timestamp: payload.timestamp,
  });

  const sanitizedPoint = sanitizeTrackingPoint(point);

  const io = getIO();

  if (io) {
    io.to(`walk:${walkId}`).emit('walk:tracking:new-point', sanitizedPoint);
  }

  return sanitizedPoint;
};

const getTrackingByWalk = async (user, walkId) => {
  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PROWNER && walk.prownerId.toString() !== user.id) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PRUNNER) {
    const isAssigned =
      walk.prunnerId && walk.prunnerId.toString() === user.id;

    if (!isAssigned) {
      throw new AppError('Walk not found', 404);
    }
  }

  const points = await TrackingPoint.find({ walkId }).sort({ timestamp: 1 });

  return points.map(sanitizeTrackingPoint);
};

module.exports = {
  addTrackingPoint,
  getTrackingByWalk,
};