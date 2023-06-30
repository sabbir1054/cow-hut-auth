import express from 'express';
import validateRequest from '../../middlewares/validedRequest';
import { UserController } from './users.controller';
import { UserValidation } from './users.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id', UserController.updateUser);
router.get('/:id', UserController.getSingleUser);
router.get('/', UserController.getAllUsers);

export const UserRoutes = router;
