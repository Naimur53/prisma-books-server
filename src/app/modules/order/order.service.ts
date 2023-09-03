import { Order, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IOrderPayload } from './order.interface';

const getAllOrder = async (): Promise<Order[]> => {
  const result = await prisma.order.findMany({ include: { orderBooks: true } });
  return result;
};

const createOrder = async (
  userId: string,
  payload: IOrderPayload
): Promise<Order | null> => {
  // check is user exits
  const isUserExist = await prisma.user.findFirst({ where: { id: userId } });
  if (!isUserExist?.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  for (const singleBookOrder of payload.orderedBooks) {
    console.log(singleBookOrder);
    const isBookExits = await prisma.book.findFirst({
      where: { id: singleBookOrder.bookId },
    });
    if (!isBookExits?.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid book Id');
    }
  }

  const result = await prisma.$transaction(async tx => {
    const order = await tx.order.create({ data: { userId: userId } });

    // create order books
    const allOrderBooksWithOrderId = payload.orderedBooks.map(single => ({
      ...single,
      orderId: order.id,
    }));
    console.log(allOrderBooksWithOrderId);

    const allOrderBooks = await tx.orderBook.createMany({
      data: allOrderBooksWithOrderId,
    });
    console.log(allOrderBooks);
    const output = await tx.order.findFirst({
      where: { id: order.id },
      include: {
        orderBooks: true,
      },
    });
    return output;
  });

  return result;
};

const getSingleOrder = async (
  user: JwtPayload,
  id: string
): Promise<Order | null> => {
  if (user.role === UserRole.admin) {
    const result = await prisma.order.findUnique({
      where: {
        id,
      },
    });
    return result;
  } else if (user.role === UserRole.customer) {
    const result = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderBooks: true,
      },
    });

    if (!result?.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found!');
    }

    if (result?.userId !== user.userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are  unauthorized!');
    }

    return result;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
  }
};
const getOrdersByUserId = async (id: string): Promise<Order[] | null> => {
  const result = await prisma.order.findMany({
    where: {
      userId: id,
    },
    include: {
      orderBooks: true,
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

const deleteOrder = async (id: string): Promise<Order | null> => {
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
  getOrdersByUserId,
};
