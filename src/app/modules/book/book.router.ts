import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookValidation } from './book.validation';
const router = express.Router();

router.get('/', BookController.getAllBook);

router.get('/:id/category', BookController.getBooksByCategoryId);
router.get('/:id', BookController.getSingleBook);

router.post(
  '/create-book',
  auth(UserRole.admin),
  validateRequest(BookValidation.createValidation),
  BookController.createBook
);

router.patch(
  '/:id',
  auth(UserRole.admin),
  validateRequest(BookValidation.updateValidation),
  BookController.updateBook
);
router.delete('/:id', auth(UserRole.admin), BookController.deleteBook);

export const BookRoutes = router;
