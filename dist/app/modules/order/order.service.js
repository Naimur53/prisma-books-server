"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany({ include: { orderBooks: true } });
    return result;
});
const createOrder = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is user exits
    const isUserExist = yield prisma_1.default.user.findFirst({ where: { id: userId } });
    if (!(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found!');
    }
    for (const singleBookOrder of payload.orderedBooks) {
        console.log(singleBookOrder);
        const isBookExits = yield prisma_1.default.book.findFirst({
            where: { id: singleBookOrder.bookId },
        });
        if (!(isBookExits === null || isBookExits === void 0 ? void 0 : isBookExits.id)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid book Id');
        }
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield tx.order.create({ data: { userId: userId } });
        // create order books
        const allOrderBooksWithOrderId = payload.orderedBooks.map(single => (Object.assign(Object.assign({}, single), { orderId: order.id })));
        console.log(allOrderBooksWithOrderId);
        const allOrderBooks = yield tx.orderBook.createMany({
            data: allOrderBooksWithOrderId,
        });
        console.log(allOrderBooks);
        const output = yield tx.order.findFirst({
            where: { id: order.id },
            include: {
                orderBooks: true,
            },
        });
        return output;
    }));
    return result;
});
const getSingleOrder = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === client_1.UserRole.admin) {
        const result = yield prisma_1.default.order.findUnique({
            where: {
                id,
            },
        });
        return result;
    }
    else if (user.role === client_1.UserRole.customer) {
        const result = yield prisma_1.default.order.findUnique({
            where: {
                id,
            },
            include: {
                orderBooks: true,
            },
        });
        if (!(result === null || result === void 0 ? void 0 : result.id)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Data not found!');
        }
        if ((result === null || result === void 0 ? void 0 : result.userId) !== user.userId) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are  unauthorized!');
        }
        return result;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
});
const getOrdersByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findMany({
        where: {
            userId: id,
        },
        include: {
            orderBooks: true,
        },
    });
    return result;
});
const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found!');
    }
    return result;
});
exports.OrderService = {
    getAllOrder,
    createOrder,
    updateOrder,
    getSingleOrder,
    deleteOrder,
    getOrdersByUserId,
};
