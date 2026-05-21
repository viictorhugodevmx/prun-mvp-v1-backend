const sanitizeTrackingPoint = (point) => {
  return {
    id: point._id,
    walkId: point.walkId,
    lat: point.lat,
    lng: point.lng,
    timestamp: point.timestamp,
  };
};

module.exports = {
  sanitizeTrackingPoint,
};