import { z } from 'zod';
import { adminRole } from './admin.constant';

const createAdminZodValidation = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    role: z.enum([...adminRole] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    password: z.string({ required_error: 'Password is required' }),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string().optional(),
    }),
    address: z.string().optional(),
  }),
});

const adminLoginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

export const AdminValidation = {
  createAdminZodValidation,
  adminLoginZodSchema,
  refreshTokenZodSchema,
};
