import { Order, Prisma } from '@prisma/client';
        import httpStatus from 'http-status';
        import ApiError from '../../../errors/ApiError';
        import { paginationHelpers } from '../../../helpers/paginationHelper';
        import { IGenericResponse } from '../../../interfaces/common';
        import { IPaginationOptions } from '../../../interfaces/pagination';
        import prisma from '../../../shared/prisma';
        import { orderSearchableFields } from './order.constant';
        import { IOrderFilters } from './order.interface';
        
        const getAllOrder = async (
          filters: IOrderFilters,
          paginationOptions: IPaginationOptions
        ): Promise<IGenericResponse<Order[]>> => {
          const { page, limit, skip } =
            paginationHelpers.calculatePagination(paginationOptions);
        
          const { searchTerm, ...filterData } = filters;
        
          const andCondition = [];
        
          if (searchTerm) {
            const searchAbleFields = orderSearchableFields.map(single => {
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
              AND: Object.keys(filterData).map(key => ({
                [key]: {
                  equals: (filterData as any)[key],
                },
              })),
            });
          }
        
          const whereConditions: Prisma.OrderWhereInput =
            andCondition.length > 0 ? { AND: andCondition } : {};
        
          const result = await prisma.order.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy:
              paginationOptions.sortBy && paginationOptions.sortOrder
                ? {
                    [paginationOptions.sortBy]: paginationOptions.sortOrder,
                  }
                : {
                    createdAt: 'desc',
                  },
          });
          const total = await prisma.order.count();
          const output = {
            data: result,
            meta: { page, limit, total },
          };
          return output;
        };
        
        const createOrder = async (
          payload: Order
        ): Promise<Order | null> => {
          const newOrder = await prisma.order.create({
            data: payload,
          });
          return newOrder;
        };
        
        const getSingleOrder = async (
          id: string
        ): Promise<Order | null> => {
          const result = await prisma.order.findUnique({
            where: {
              id,
            },
          });
          return result;
        };
        
        const updateOrder = async (
          id: string,
          payload: Partial<Order>
        ): Promise<Order | null> => {
          const result = await prisma.order.update({
            where: {
              id,
            },
            data: payload,
          });
          return result;
        };
        
        const deleteOrder = async (
          id: string
        ): Promise<Order | null> => {
          const result = await prisma.order.delete({
            where: { id },
          });
          if (!result) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Order not found!');
          }
          return result;
        };
        
        export const OrderService = {
          getAllOrder,
          createOrder,
          updateOrder,
          getSingleOrder,
          deleteOrder,
        };