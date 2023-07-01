/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const adminData = req.body;
  const result = await AdminService.createAdminToDB(adminData);

  sendResponse<Partial<IAdmin>>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Admin created Successfully',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
};
