import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', auth(UserRole.admin), UserController.getAllUser);
router.get('/:id', UserController.getSingleUser);

router.post(
  '/',
  validateRequest(UserValidation.createValidation),
  UserController.createUser
);

router.patch(
  '/:id',
  validateRequest(UserValidation.updateValidation),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);

export const UserRoutes = router;
