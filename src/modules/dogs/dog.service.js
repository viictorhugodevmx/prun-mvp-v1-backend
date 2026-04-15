const Dog = require('./dog.model');
const AppError = require('../../utils/app-error');
const { sanitizeDog } = require('./dog.utils');

const createDog = async (ownerId, payload) => {
  const dog = await Dog.create({
    ownerId,
    name: payload.name,
    age: payload.age,
    size: payload.size,
    breed: payload.breed ?? null,
    photo: payload.photo ?? null,
    notes: payload.notes ?? null,
  });

  return sanitizeDog(dog);
};

const getMyDogs = async (ownerId) => {
  const dogs = await Dog.find({ ownerId }).sort({ createdAt: -1 });

  return dogs.map(sanitizeDog);
};

const getMyDogById = async (ownerId, dogId) => {
  const dog = await Dog.findOne({ _id: dogId, ownerId });

  if (!dog) {
    throw new AppError('Dog not found', 404);
  }

  return sanitizeDog(dog);
};

const updateMyDog = async (ownerId, dogId, payload) => {
  const dog = await Dog.findOne({ _id: dogId, ownerId });

  if (!dog) {
    throw new AppError('Dog not found', 404);
  }

  const allowedFields = ['name', 'age', 'size', 'breed', 'photo', 'notes'];

  allowedFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      dog[field] = payload[field];
    }
  });

  await dog.save();

  return sanitizeDog(dog);
};

const deleteMyDog = async (ownerId, dogId) => {
  const dog = await Dog.findOne({ _id: dogId, ownerId });

  if (!dog) {
    throw new AppError('Dog not found', 404);
  }

  await dog.deleteOne();

  return {
    id: dog._id,
  };
};

module.exports = {
  createDog,
  getMyDogs,
  getMyDogById,
  updateMyDog,
  deleteMyDog,
};