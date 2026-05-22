const sanitizePhoto = (photo) => {
  return {
    id: photo._id,
    walkId: photo.walkId,
    uploadedBy: photo.uploadedBy,
    photoUrl: photo.photoUrl,
    caption: photo.caption,
    createdAt: photo.createdAt,
  };
};

module.exports = {
  sanitizePhoto,
};