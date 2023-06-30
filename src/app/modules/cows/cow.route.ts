import express from 'express';
import validateRequest from '../../middlewares/validedRequest';
import { CowController } from './cow.controller';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(CowValidation.createCowZodValidation),
  CowController.createCows
);

router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodValidation),
  CowController.updateCow
);
router.delete('/:id', CowController.deleteCow);
router.get('/:id', CowController.getSingleCow);
router.get('/', CowController.getAllCows);

export const CowRoutes = router;
