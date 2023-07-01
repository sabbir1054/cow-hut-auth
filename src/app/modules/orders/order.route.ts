import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/users';
import { Auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validedRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  Auth.validateUsersRole(ENUM_USER_ROLE.BUYER),
  OrderController.createOrder
);

/* Specific user  ===> Specific Order*/
router.get(
  '/:id',
  Auth.validateSpecificUser(
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.BUYER,
    ENUM_USER_ROLE.ADMIN
  ),
  OrderController.getSingleOrders
);

/* Admin ===> All Order*/
router.get(
  '/',
  Auth.validateUsersRole(ENUM_USER_ROLE.ADMIN),
  OrderController.getAllOrders
);
export const OrderRoutes = router;
