const Walk = require('../walks/walk.model');
const Photo = require('./photo.model');
const AppError = require('../../utils/app-error');
const { WALK_STATUS, ROLES } = require('../../config/constants');
const { sanitizePhoto } = require('./photo.utils');

const addPhoto = async (user, walkId, payload) => {
  if (user.role !== ROLES.PRUNNER) {
    throw new AppError('Only Prunner can upload walk photos', 403);
  }

  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  const isAssigned =
    walk.prunnerId && walk.prunnerId.toString() === user.id;

  if (!isAssigned) {
    throw new AppError('You can only upload photos for your assigned walks', 403);
  }

  if (
    walk.status !== WALK_STATUS.IN_PROGRESS &&
    walk.status !== WALK_STATUS.COMPLETED
  ) {
    throw new AppError('Photos can only be uploaded during or after the walk', 422);
  }

  const photo = await Photo.create({
    walkId,
    uploadedBy: user.id,
    photoUrl: payload.photoUrl,
    caption: payload.caption ?? null,
  });

  return sanitizePhoto(photo);
};

const getWalkPhotos = async (user, walkId) => {
  const walk = await Walk.findById(walkId);

  if (!walk) {
    throw new AppError('Walk not found', 404);
  }

  if (user.role === ROLES.PROWNER) {
    if (walk.prownerId.toString() !== user.id) {
      throw new AppError('Walk not found', 404);
    }
  }

  if (user.role === ROLES.PRUNNER) {
    const isAssigned =
      walk.prunnerId && walk.prunnerId.toString() === user.id;

    if (!isAssigned) {
      throw new AppError('Walk not found', 404);
    }
  }

  const photos = await Photo.find({ walkId }).sort({ createdAt: 1 });

  return photos.map(sanitizePhoto);
};

module.exports = {
  addPhoto,
  getWalkPhotos,
};