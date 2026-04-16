const Walk = require('./walk.model');
const Dog = require('../dogs/dog.model');
const AppError = require('../../utils/app-error');
const { WALK_STATUS, ROLES } = require('../../config/constants');
const { sanitizeWalk } = require('./walk.utils');

const createWalk = async (user, payload) => {
  if (user.role !== ROLES.PROWNER) {
    throw new AppError('Only Prowner users can create walks', 403);
  }

  const dogs = await Dog.find({
    _id: { $in: payload.dogIds },
    ownerId: user.id,
  });

  if (dogs.length !== payload.dogIds.length) {
    throw new AppError('One or more dogs were not found or do not belong to the authenticated user', 404);
  }

  if (payload.type === 'individual' && payload.dogIds.length !== 1) {
    throw new AppError('Individual walks must include exactly one dog', 422);
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
  });

  return sanitizeWalk(walk);
};

const getWalks = async (user) => {
  let query = {};

  if (user.role === ROLES.PROWNER) {
    query = { prownerId: user.id };
  }

  if (user.role === ROLES.PRUNNER) {
    query = {
      $or: [
        { status: WALK_STATUS.REQUESTED },
        { prunnerId: user.id },
      ],
    };
  }

  const walks = await Walk.find(query).sort({ createdAt: -1 });

  return walks.map(sanitizeWalk);
};

const getWalkById = async (user, walkId) => {
  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PROWNER && walk.prownerId.toString() !== user.id) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PRUNNER) {
    const isRequested = walk.status === WALK_STATUS.REQUESTED;
    const isAssignedToPrunner =
      walk.prunnerId && walk.prunnerId.toString() === user.id;

    if (!isRequested && !isAssignedToPrunner) {
      throw new AppError('Walk not found', 404);
    }
  }

  return sanitizeWalk(walk);
};

module.exports = {
  createWalk,
  getWalks,
  getWalkById,
};