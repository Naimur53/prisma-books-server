import { Order, UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const OrderData = req.body;
    const { userId } = req.user as JwtPayload;

    const result = await OrderService.createOrder(userId, OrderData);
    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Created successfully!',
      data: result,
    });
  }
);

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const { role, userId } = req.user as JwtPayload;
  let result;
  if (role === UserRole.admin) {
    result = await OrderService.getAllOrder();
  } else {
    result = await OrderService.getOrdersByUserId(userId);
  }

  sendResponse<Order[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully !',
    data: result,
  });
});

const getSingleOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user as JwtPayload;
    const result = await OrderService.getSingleOrder(user, id);

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrieved  successfully!',
      data: result,
    });
  }
);
const getOrdersByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await OrderService.getOrdersByUserId(userId);

    sendResponse<Order[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved  successfully!',
      data: result,
    });
  }
);

const updateOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateAbleData = req.body;

    const result = await OrderService.updateOrder(id, updateAbleData);

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Updated successfully!',
      data: result,
    });
  }
);
const deleteOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await OrderService.deleteOrder(id);

    sendResponse<Order>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order deleted successfully!',
      data: result,
    });
  }
);

export const OrderController = {
  getAllOrder,
  createOrder,
  updateOrder,
  getSingleOrder,
  getOrdersByUserId,
  deleteOrder,
};
