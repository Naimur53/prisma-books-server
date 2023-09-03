import { Order } from '@prisma/client';
        import { Request, Response } from 'express';
        import { RequestHandler } from 'express-serve-static-core';
        import httpStatus from 'http-status';
        import { paginationFields } from '../../../constants/pagination';
        import catchAsync from '../../../shared/catchAsync';
        import pick from '../../../shared/pick';
        import sendResponse from '../../../shared/sendResponse';
        import { OrderService } from './order.service';
        import { orderFilterAbleFields } from './order.constant';
        const createOrder: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const OrderData = req.body;
        
            const result = await OrderService.createOrder(
              OrderData
            );
            sendResponse<Order>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Order Created successfully!',
              data: result,
            });
          }
        );
        
        const getAllOrder = catchAsync(
          async (req: Request, res: Response) => {
            const filters = pick(req.query, [
              'searchTerm',
              ...orderFilterAbleFields,
            ]);
            const paginationOptions = pick(req.query, paginationFields);
        
            const result = await OrderService.getAllOrder(
              filters,
              paginationOptions
            );
        
            sendResponse<Order[]>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Order retrieved successfully !',
              meta: result.meta,
              data: result.data,
            });
          }
        );
        
        const getSingleOrder: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
        
            const result = await OrderService.getSingleOrder(id);
        
            sendResponse<Order>(res, {
              statusCode: httpStatus.OK,
              success: true,
              message: 'Order retrieved  successfully!',
              data: result,
            });
          }
        );
        
        const updateOrder: RequestHandler = catchAsync(
          async (req: Request, res: Response) => {
            const id = req.params.id;
            const updateAbleData = req.body;
        
            const result = await OrderService.updateOrder(
              id,
              updateAbleData
            );
        
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
          deleteOrder,
        };