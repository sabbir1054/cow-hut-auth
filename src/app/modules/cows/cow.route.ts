import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { Auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validedRequest';
import { CowController } from './cow.controller';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(CowValidation.createCowZodValidation),
  Auth.validateUsersRole(ENUM_USER_ROLE.SELLER),
  CowController.createCows
);

router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodValidation),
  Auth.validateSpecificUser(ENUM_USER_ROLE.SELLER),
  CowController.updateCow
);
router.delete(
  '/:id',
  Auth.validateSpecificUser(ENUM_USER_ROLE.SELLER),
  CowController.deleteCow
);
router.get(
  '/:id',
  Auth.validateUsersRole(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.SELLER
  ),
  CowController.getSingleCow
);
router.get(
  '/',
  Auth.validateUsersRole(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.SELLER
  ),
  CowController.getAllCows
);

export const CowRoutes = router;
