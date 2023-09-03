import { z } from 'zod';

const createValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }),
    author: z.string({ required_error: 'author is required' }),
    genre: z.string({ required_error: 'genre is required' }),
    price: z.number({ required_error: 'title is required' }),
    publicationDate: z.string({
      required_error: 'publicationDate is required',
    }),
    categoryId: z.string({ required_error: 'categoryId is required' }),
  }),
});
const updateValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'title is required' }).optional(),
    author: z.string({ required_error: 'author is required' }).optional(),
    genre: z.string({ required_error: 'genre is required' }).optional(),
    price: z.number({ required_error: 'title is required' }).optional(),
    publicationDate: z
      .string({ required_error: 'publicationDate is required' })
      .optional(),
    categoryId: z
      .string({ required_error: 'categoryId is required' })
      .optional(),
  }),
});
export const BookValidation = {
  createValidation,
  updateValidation,
};
