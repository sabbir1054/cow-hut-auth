import express from 'express';
import validateRequest from '../../middlewares/validedRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);
router.get('/', OrderController.getAllOrders);
export const OrderRoutes = router;
