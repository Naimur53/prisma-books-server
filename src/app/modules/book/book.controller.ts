import { Book } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterAbleFields, bookFilterByPrice } from './book.constant';
import { BookService } from './book.service';
const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const BookData = req.body;

    const result = await BookService.createBook(BookData);
    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book Created successfully!',
      data: result,
    });
  }
);

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    ...bookFilterAbleFields,
    ...bookFilterByPrice,
  ]);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BookService.getAllBook(filters, paginationOptions);

  sendResponse<Book[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookService.getSingleBook(id);
    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved  successfully!',
      data: result,
    });
  }
);
const getBooksByCategoryId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BookService.getBooksByCategoryId(
      id,
      paginationOptions
    );

    sendResponse<Book[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book fetched   successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await BookService.updateBook(id, updateAbleData);

    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book fetched  successfully!',
      data: result,
    });
  }
);
const deleteBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await BookService.deleteBook(id);

    sendResponse<Book>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book deleted successfully!',
      data: result,
    });
  }
);

export const BookController = {
  getAllBook,
  createBook,
  updateBook,
  getSingleBook,
  deleteBook,
  getBooksByCategoryId,
};
