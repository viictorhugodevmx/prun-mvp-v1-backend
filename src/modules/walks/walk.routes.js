const express = require('express');
const walkController = require('./walk.controller');
const validateMiddleware = require('../../middlewares/validate.middleware');
const { protect } = require('../../middlewares/auth.middleware');
const { createWalkValidation, walkIdValidation } = require('./walk.validation');

const router = express.Router();

router.use(protect);

router.post('/', createWalkValidation, validateMiddleware, walkController.createWalk);
router.get('/', walkController.getWalks);
router.get('/:walkId', walkIdValidation, validateMiddleware, walkController.getWalkById);

module.exports = router;