import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { categoryFilterAbleFields } from './category.constant';
import { CategoryService } from './category.service';
const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const CategoryData = req.body;

    const result = await CategoryService.createCategory(CategoryData);
    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category fetched  successfully!',
      data: result,
    });
  }
);

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', ...categoryFilterAbleFields]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryService.getAllCategory(
    filters,
    paginationOptions
  );

  sendResponse<Category[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched  successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CategoryService.getSingleCategory(id);

    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category fetched   successfully!',
      data: result,
    });
  }
);

const updateCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await CategoryService.updateCategory(id, updateAbleData);

    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category Updated successfully!',
      data: result,
    });
  }
);
const deleteCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await CategoryService.deleteCategory(id);

    sendResponse<Category>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category deleted successfully!',
      data: result,
    });
  }
);

export const CategoryController = {
  getAllCategory,
  createCategory,
  updateCategory,
  getSingleCategory,
  deleteCategory,
};
