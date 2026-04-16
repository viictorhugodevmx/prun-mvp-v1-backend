const sanitizeWalk = (walk) => {
  return {
    id: walk._id,
    prownerId: walk.prownerId,
    prunnerId: walk.prunnerId,
    dogIds: walk.dogIds,
    type: walk.type,
    status: walk.status,
    estimatedDuration: walk.estimatedDuration,
    actualStartAt: walk.actualStartAt,
    actualEndAt: walk.actualEndAt,
    price: walk.price,
    address: walk.address,
    createdAt: walk.createdAt,
    updatedAt: walk.updatedAt,
  };
};

module.exports = {
  sanitizeWalk,
};