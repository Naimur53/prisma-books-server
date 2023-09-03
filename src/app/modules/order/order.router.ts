import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
const router = express.Router();

router.get(
  '/',
  auth(UserRole.customer, UserRole.admin),
  OrderController.getAllOrder
);
router.get(
  '/:id',
  auth(UserRole.customer, UserRole.admin),
  OrderController.getSingleOrder
);

router.post(
  '/create-order',
  auth(UserRole.customer),
  validateRequest(OrderValidation.createValidation),
  OrderController.createOrder
);

router.patch(
  '/:id',
  validateRequest(OrderValidation.updateValidation),
  OrderController.updateOrder
);
router.delete('/:id', OrderController.deleteOrder);

export const OrderRoutes = router;
