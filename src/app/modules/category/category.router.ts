import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
const router = express.Router();

router.get('/', CategoryController.getAllCategory);
router.get('/:id', CategoryController.getSingleCategory);

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createValidation),
  auth(UserRole.admin),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth(UserRole.admin),
  validateRequest(CategoryValidation.updateValidation),
  CategoryController.updateCategory
);
router.delete('/:id', auth(UserRole.admin), CategoryController.deleteCategory);

export const CategoryRoutes = router;
