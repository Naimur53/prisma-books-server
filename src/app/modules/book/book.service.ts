import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CategoryService } from '../category/category.service';
import { bookSearchableFields } from './book.constant';
import { IBookFilters } from './book.interface';

const getAllBook = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { page, size, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, maxPrice, minPrice, ...filterData } = filters;

  const andCondition = [];

  if (searchTerm) {
    const searchAbleFields = bookSearchableFields.map(single => {
      const query = {
        [single]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      };
      return query;
    });
    andCondition.push({
      OR: searchAbleFields,
    });
  }
  if (Object.keys(filters).length) {
    andCondition.push({
      AND: Object.keys(filterData).map(key =>
        key === 'category'
          ? {
              ['categoryId']: {
                equals: (filterData as any)[key],
              },
            }
          : {
              [key]: {
                equals: (filterData as any)[key],
              },
            }
      ),
    });
  }

  if (minPrice) {
    andCondition.push({ price: { gte: parseFloat(minPrice) } });
  }
  if (maxPrice) {
    andCondition.push({ price: { lte: parseFloat(maxPrice) } });
  }
  const whereConditions: Prisma.BookWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};
  console.log({ page, size, skip }, whereConditions);
  const result = await prisma.book.findMany({
    where: whereConditions,
    skip,
    take: size,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            id: 'desc',
          },
  });
  const total = await prisma.book.count();
  const output = {
    data: result,
    meta: { page, size, total, totalPage: Math.ceil(total / size) },
  };
  return output;
};

const createBook = async (payload: Book): Promise<Book | null> => {
  // checking is category exits
  const { publicationDate, ...rest } = payload;
  const data = await CategoryService.getSingleCategory(payload.categoryId);
  if (!data?.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid categoryId!');
  }
  const newBook = await prisma.book.create({
    data: { publicationDate: new Date(publicationDate), ...rest },
    include: {
      category: true,
    },
  });
  return newBook;
};

const getSingleBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findFirst({
    where: {
      id,
    },
  });
  return result;
};
const getBooksByCategoryId = async (
  id: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { page, size, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const result = await prisma.book.findMany({
    where: {
      categoryId: id,
    },
    skip,
    take: size,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? {
            [paginationOptions.sortBy]: paginationOptions.sortOrder,
          }
        : {
            id: 'desc',
          },
  });
  const total = await prisma.book.count({
    where: {
      categoryId: id,
    },
  });
  const output = {
    data: result,
    meta: { page, size, total, totalPage: Math.ceil(total / size) },
  };
  return output;
};

const updateBook = async (
  id: string,
  payload: Partial<Book>
): Promise<Book | null> => {
  if (payload.categoryId) {
    const isCategoryExits = await prisma.category.findFirst({
      where: { id: payload.categoryId },
    });
    if (!isCategoryExits?.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid category Id');
    }
  }
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteBook = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.delete({
    where: { id },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }
  return result;
};

export const BookService = {
  getAllBook,
  createBook,
  updateBook,
  getSingleBook,
  deleteBook,
  getBooksByCategoryId,
};
