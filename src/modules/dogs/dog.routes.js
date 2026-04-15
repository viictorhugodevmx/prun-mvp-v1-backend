const express = require('express');
const dogController = require('./dog.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const {
  createDogValidation,
  updateDogValidation,
  dogIdValidation,
} = require('./dog.validation');
const { ROLES } = require('../../config/constants');

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.PROWNER));

router.post('/', createDogValidation, validateMiddleware, dogController.createDog);
router.get('/', dogController.getMyDogs);
router.get('/:dogId', dogIdValidation, validateMiddleware, dogController.getMyDogById);
router.put('/:dogId', dogIdValidation, updateDogValidation, validateMiddleware, dogController.updateMyDog);
router.delete('/:dogId', dogIdValidation, validateMiddleware, dogController.deleteMyDog);

module.exports = router;