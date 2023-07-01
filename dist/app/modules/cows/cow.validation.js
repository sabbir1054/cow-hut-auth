"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = require("zod");
const cow_constant_1 = require("./cow.constant");
const createCowZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        age: zod_1.z.number({ required_error: 'Age is required' }),
        price: zod_1.z.number({ required_error: 'Price is required' }),
        location: zod_1.z.enum([...cow_constant_1.location], {
            required_error: 'Valid Location is required',
        }),
        breed: zod_1.z.enum([...cow_constant_1.breed], {
            required_error: 'Breed is required',
        }),
        weight: zod_1.z.number().optional(),
        label: zod_1.z.enum([...cow_constant_1.label]).optional(),
        category: zod_1.z.enum([...cow_constant_1.category], {
            required_error: 'Category is required',
        }),
        seller: zod_1.z.string({ required_error: 'Seller info is required' }),
    }),
});
const updateCowZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        location: zod_1.z.enum([...cow_constant_1.location]).optional(),
        breed: zod_1.z.enum([...cow_constant_1.breed]).optional(),
        weight: zod_1.z.number().optional(),
        label: zod_1.z.enum([...cow_constant_1.label]).optional(),
        category: zod_1.z.enum([...cow_constant_1.category]).optional(),
        seller: zod_1.z.string().optional(),
    }),
});
exports.CowValidation = {
    createCowZodValidation,
    updateCowZodValidation,
};
