const asyncHandler = require('../../utils/async-handler');
const { successResponse } = require('../../utils/api-response');
const dogService = require('./dog.service');

const createDog = asyncHandler(async (req, res) => {
  const dog = await dogService.createDog(req.user.id, req.body);

  return res.status(201).json(
    successResponse({
      message: 'Dog created successfully',
      data: dog,
    })
  );
});

const getMyDogs = asyncHandler(async (req, res) => {
  const dogs = await dogService.getMyDogs(req.user.id);

  return res.status(200).json(
    successResponse({
      message: 'Dogs fetched successfully',
      data: dogs,
    })
  );
});

const getMyDogById = asyncHandler(async (req, res) => {
  const dog = await dogService.getMyDogById(req.user.id, req.params.dogId);

  return res.status(200).json(
    successResponse({
      message: 'Dog fetched successfully',
      data: dog,
    })
  );
});

const updateMyDog = asyncHandler(async (req, res) => {
  const dog = await dogService.updateMyDog(req.user.id, req.params.dogId, req.body);

  return res.status(200).json(
    successResponse({
      message: 'Dog updated successfully',
      data: dog,
    })
  );
});

const deleteMyDog = asyncHandler(async (req, res) => {
  const result = await dogService.deleteMyDog(req.user.id, req.params.dogId);

  return res.status(200).json(
    successResponse({
      message: 'Dog deleted successfully',
      data: result,
    })
  );
});

module.exports = {
  createDog,
  getMyDogs,
  getMyDogById,
  updateMyDog,
  deleteMyDog,
};