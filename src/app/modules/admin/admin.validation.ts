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

export const AdminValidation = {
  createAdminZodValidation,
};
