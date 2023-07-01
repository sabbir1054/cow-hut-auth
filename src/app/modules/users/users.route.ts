import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';

import { Auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validedRequest';
import { UserController } from './users.controller';
import { UserValidation } from './users.validation';

const router = express.Router();
// my profile
router.get(
  '/my-profile',
  Auth.validateUsersRole(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.getMyProfile
);
router.patch(
  '/my-profile',
  validateRequest(UserValidation.updateUserZodSchema),
  Auth.validateUsersRole(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.updateMyProfile
);

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);
router.delete(
  '/:id',
  Auth.validateUsersRole(ENUM_USER_ROLE.ADMIN),
  UserController.deleteUser
);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  Auth.validateUsersRole(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);
router.get(
  '/:id',
  Auth.validateUsersRole(ENUM_USER_ROLE.ADMIN),
  UserController.getSingleUser
);

router.get(
  '/',
  Auth.validateUsersRole(ENUM_USER_ROLE.ADMIN),
  UserController.getAllUsers
);

export const UserRoutes = router;
