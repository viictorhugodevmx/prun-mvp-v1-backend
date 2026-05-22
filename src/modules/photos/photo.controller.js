const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const photoService = require('./photo.service');

const addPhoto = asyncHandler(async (req, res) => {
  const photo = await photoService.addPhoto(
    req.user,
    req.params.walkId,
    req.body
  );

  return res.status(201).json(
    successResponse({
      message: 'Photo uploaded successfully',
      data: photo,
    })
  );
});

const getWalkPhotos = asyncHandler(async (req, res) => {
  const photos = await photoService.getWalkPhotos(
    req.user,
    req.params.walkId
  );

  return res.status(200).json(
    successResponse({
      message: 'Walk photos fetched successfully',
      data: photos,
    })
  );
});

module.exports = {
  addPhoto,
  getWalkPhotos,
};