const Walk = require('./walk.model');
const Dog = require('../dogs/dog.model');
const User = require('../users/user.model');
const AppError = require('../../utils/app-error');
const { WALK_STATUS, ROLES } = require('../../config/constants');
const { sanitizeWalk } = require('./walk.utils');
const { calculateDistanceKm } = require('../../utils/distance');

const createWalk = async (user, payload) => {
  if (user.role !== ROLES.PROWNER) {
    throw new AppError('Only Prowner users can create walks', 403);
  }

  const dogs = await Dog.find({
    _id: { $in: payload.dogIds },
    ownerId: user.id,
  });

  if (dogs.length !== payload.dogIds.length) {
    throw new AppError(
      'One or more dogs were not found or do not belong to the authenticated user',
      404
    );
  }

  if (payload.type === 'individual' && payload.dogIds.length !== 1) {
    throw new AppError(
      'Individual walks must include exactly one dog',
      422
    );
  }

  const walk = await Walk.create({
    prownerId: user.id,
    prunnerId: null,
    dogIds: payload.dogIds,
    type: payload.type,
    status: WALK_STATUS.REQUESTED,
    estimatedDuration: payload.estimatedDuration,
    price: payload.price,
    address: payload.address,
    pickupLocation: payload.pickupLocation,
  });

  return sanitizeWalk(walk);
};

const getWalks = async (user) => {
  if (user.role === ROLES.PROWNER) {
    const walks = await Walk.find({
      prownerId: user.id,
    }).sort({ createdAt: -1 });

    return walks.map(sanitizeWalk);
  }

  if (user.role === ROLES.PRUNNER) {
    const prunner = await User.findById(user.id);

    if (
      !prunner ||
      !prunner.serviceLocation ||
      prunner.serviceLocation.lat === null ||
      prunner.serviceLocation.lng === null
    ) {
      return [];
    }

    const walks = await Walk.find({
      $or: [
        { status: WALK_STATUS.REQUESTED },
        { prunnerId: user.id },
      ],
    }).sort({ createdAt: -1 });

    const visibleWalks = walks.filter((walk) => {
      if (
        walk.prunnerId &&
        walk.prunnerId.toString() === user.id
      ) {
        return true;
      }

      const distanceKm = calculateDistanceKm(
        prunner.serviceLocation.lat,
        prunner.serviceLocation.lng,
        walk.pickupLocation.lat,
        walk.pickupLocation.lng
      );

      return distanceKm <= prunner.serviceRadiusKm;
    });

    return visibleWalks.map(sanitizeWalk);
  }

  return [];
};

const getWalkById = async (user, walkId) => {
  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (
    user.role === ROLES.PROWNER &&
    walk.prownerId.toString() !== user.id
  ) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PRUNNER) {
    const isRequested = walk.status === WALK_STATUS.REQUESTED;

    const isAssignedToPrunner =
      walk.prunnerId &&
      walk.prunnerId.toString() === user.id;

    if (!isRequested && !isAssignedToPrunner) {
      throw new AppError('Walk not found', 404);
    }
  }

  return sanitizeWalk(walk);
};

const acceptWalk = async (user, walkId) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError('Only Prunner users can accept walks', 403);
  }

  const activeAssignments = await Walk.countDocuments({
    prunnerId: user.id,
    status: {
      $in: [
        WALK_STATUS.ACCEPTED,
        WALK_STATUS.IN_PROGRESS,
      ],
    },
  });

  if (activeAssignments >= 2) {
    throw new AppError(
      'You already have the maximum number of active walks',
      422
    );
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (walk.status !== WALK_STATUS.REQUESTED) {
    throw new AppError(
      'Only requested walks can be accepted',
      422
    );
  }

  if (walk.prunnerId) {
    throw new AppError(
      'This walk has already been assigned',
      422
    );
  }

  walk.prunnerId = user.id;
  walk.status = WALK_STATUS.ACCEPTED;

  await walk.save();

  return sanitizeWalk(walk);
};

const startWalk = async (user, walkId) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError('Only Prunner users can start walks', 403);
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  const isAssignedToPrunner =
    walk.prunnerId &&
    walk.prunnerId.toString() === user.id;

  if (!isAssignedToPrunner) {
    throw new AppError(
      'You can only start walks assigned to you',
      403
    );
  }

  if (walk.status !== WALK_STATUS.ACCEPTED) {
    throw new AppError(
      'Only accepted walks can be started',
      422
    );
  }

  walk.status = WALK_STATUS.IN_PROGRESS;
  walk.actualStartAt = new Date();

  await walk.save();

  return sanitizeWalk(walk);
};

const completeWalk = async (user, walkId) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError(
      'Only Prunner users can complete walks',
      403
    );
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  const isAssignedToPrunner =
    walk.prunnerId &&
    walk.prunnerId.toString() === user.id;

  if (!isAssignedToPrunner) {
    throw new AppError(
      'You can only complete walks assigned to you',
      403
    );
  }

  if (walk.status !== WALK_STATUS.IN_PROGRESS) {
    throw new AppError(
      'Only in-progress walks can be completed',
      422
    );
  }

  walk.status = WALK_STATUS.COMPLETED;
  walk.actualEndAt = new Date();

  await walk.save();

  return sanitizeWalk(walk);
};

const addWalkSummary = async (user, walkId, payload) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError(
      'Only Prunner can add summaries',
      403
    );
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  const isAssigned =
    walk.prunnerId &&
    walk.prunnerId.toString() === user.id;

  if (!isAssigned) {
    throw new AppError(
      'You can only summarize your assigned walks',
      403
    );
  }

  if (walk.status !== WALK_STATUS.COMPLETED) {
    throw new AppError(
      'Summary can only be added after completing the walk',
      422
    );
  }

  walk.summary = payload.summary;

  await walk.save();

  return sanitizeWalk(walk);
};

module.exports = {
  createWalk,
  getWalks,
  getWalkById,
  acceptWalk,
  startWalk,
  completeWalk,
  addWalkSummary,
};
