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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const category_service_1 = require("../category/category.service");
const book_constant_1 = require("./book.constant");
const getAllBook = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, maxPrice, minPrice } = filters, filterData = __rest(filters, ["searchTerm", "maxPrice", "minPrice"]);
    const andCondition = [];
    if (searchTerm) {
        const searchAbleFields = book_constant_1.bookSearchableFields.map(single => {
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
            AND: Object.keys(filterData).map(key => key === 'category'
                ? {
                    ['categoryId']: {
                        equals: filterData[key],
                    },
                }
                : {
                    [key]: {
                        equals: filterData[key],
                    },
                }),
        });
    }
    if (minPrice) {
        andCondition.push({ price: { gte: parseFloat(minPrice) } });
    }
    if (maxPrice) {
        andCondition.push({ price: { lte: parseFloat(maxPrice) } });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    console.log({ page, size, skip }, whereConditions);
    const result = yield prisma_1.default.book.findMany({
        where: whereConditions,
        skip,
        take: size,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                id: 'desc',
            },
    });
    const total = yield prisma_1.default.book.count();
    const output = {
        data: result,
        meta: { page, size, total, totalPage: Math.ceil(total / size) },
    };
    return output;
});
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking is category exits
    const { publicationDate } = payload, rest = __rest(payload, ["publicationDate"]);
    const data = yield category_service_1.CategoryService.getSingleCategory(payload.categoryId);
    if (!(data === null || data === void 0 ? void 0 : data.id)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid categoryId!');
    }
    const newBook = yield prisma_1.default.book.create({
        data: Object.assign({ publicationDate: new Date(publicationDate) }, rest),
        include: {
            category: true,
        },
    });
    return newBook;
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findFirst({
        where: {
            id,
        },
    });
    return result;
});
const getBooksByCategoryId = (id, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, size, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const result = yield prisma_1.default.book.findMany({
        where: {
            categoryId: id,
        },
        skip,
        take: size,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? {
                [paginationOptions.sortBy]: paginationOptions.sortOrder,
            }
            : {
                id: 'desc',
            },
    });
    const total = yield prisma_1.default.book.count({
        where: {
            categoryId: id,
        },
    });
    const output = {
        data: result,
        meta: { page, size, total, totalPage: Math.ceil(total / size) },
    };
    return output;
});
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.categoryId) {
        const isCategoryExits = yield prisma_1.default.category.findFirst({
            where: { id: payload.categoryId },
        });
        if (!(isCategoryExits === null || isCategoryExits === void 0 ? void 0 : isCategoryExits.id)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid category Id');
        }
    }
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    return result;
});
exports.BookService = {
    getAllBook,
    createBook,
    updateBook,
    getSingleBook,
    deleteBook,
    getBooksByCategoryId,
};
