const sanitizeDog = (dog) => {
  return {
    id: dog._id,
    ownerId: dog.ownerId,
    name: dog.name,
    age: dog.age,
    size: dog.size,
    breed: dog.breed,
    photo: dog.photo,
    notes: dog.notes,
    createdAt: dog.createdAt,
    updatedAt: dog.updatedAt,
  };
};

module.exports = {
  sanitizeDog,
};