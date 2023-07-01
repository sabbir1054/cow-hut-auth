"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const admin_constant_1 = require("./admin.constant");
const createAdminZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
        role: zod_1.z.enum([...admin_constant_1.adminRole], {
            required_error: 'Role is required',
        }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First name is required' }),
            lastName: zod_1.z.string().optional(),
        }),
        address: zod_1.z.string().optional(),
    }),
});
const adminLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
exports.AdminValidation = {
    createAdminZodValidation,
    adminLoginZodSchema,
    refreshTokenZodSchema,
};
