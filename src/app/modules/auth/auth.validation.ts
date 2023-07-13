import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const signUpZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    role: z.string({ required_error: 'Role is required' }),
    password: z.string({ required_error: 'Password is required' }),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string().optional(),
    }),
    address: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh Token is required' }),
  }),
});

export const AuthValidation = {
  signUpZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
};
