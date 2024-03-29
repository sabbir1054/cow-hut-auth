import express from 'express';
import validateRequest from '../../middlewares/validedRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodValidation),
  AdminController.createAdmin
);

router.post(
  '/login',
  validateRequest(AdminValidation.adminLoginZodSchema),
  AdminController.loginAdmin
);

export const AdminRoutes = router;
