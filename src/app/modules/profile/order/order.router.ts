import express from 'express';
        import validateRequest from '../../middlewares/validateRequest';
        import { OrderController } from './order.controller';
        import { OrderValidation } from './order.validation';
        const router = express.Router();
        
        router.get('/', OrderController.getAllOrder);
        router.get('/:id', OrderController.getSingleOrder);
        
        router.post(
          '/',
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