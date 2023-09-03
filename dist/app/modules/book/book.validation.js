"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title is required' }),
        author: zod_1.z.string({ required_error: 'author is required' }),
        genre: zod_1.z.string({ required_error: 'genre is required' }),
        price: zod_1.z.number({ required_error: 'title is required' }),
        publicationDate: zod_1.z.string({
            required_error: 'publicationDate is required',
        }),
        categoryId: zod_1.z.string({ required_error: 'categoryId is required' }),
    }),
});
const updateValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'title is required' }).optional(),
        author: zod_1.z.string({ required_error: 'author is required' }).optional(),
        genre: zod_1.z.string({ required_error: 'genre is required' }).optional(),
        price: zod_1.z.number({ required_error: 'title is required' }).optional(),
        publicationDate: zod_1.z
            .string({ required_error: 'publicationDate is required' })
            .optional(),
        categoryId: zod_1.z
            .string({ required_error: 'categoryId is required' })
            .optional(),
    }),
});
exports.BookValidation = {
    createValidation,
    updateValidation,
};
