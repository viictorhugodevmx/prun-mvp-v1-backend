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

router.post('/:walkId/accept', walkIdValidation, validateMiddleware, walkController.acceptWalk);
router.post('/:walkId/start', walkIdValidation, validateMiddleware, walkController.startWalk);
router.post('/:walkId/complete', walkIdValidation, validateMiddleware, walkController.completeWalk);

module.exports = router;