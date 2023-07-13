"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const signUpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
        role: zod_1.z.string({ required_error: 'Role is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First name is required' }),
            lastName: zod_1.z.string().optional(),
        }),
        address: zod_1.z.string().optional(),
        budget: zod_1.z.number().optional(),
        income: zod_1.z.number().optional(),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh Token is required' }),
    }),
});
exports.AuthValidation = {
    signUpZodSchema,
    loginZodSchema,
    refreshTokenZodSchema,
};
