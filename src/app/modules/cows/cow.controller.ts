import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constant';
import { ICow } from './cow.interface';
import { CowService } from './cow.service';

const createCows = catchAsync(async (req: Request, res: Response) => {
  const cowData = req.body;

  const result = await CowService.createCowsToDB(cowData);

  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCowsFromDB(filters, paginationOptions);
  sendResponse<ICow[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow retrieve successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowService.getSingleCowFromDB(id);
  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow retrieve successfully',
    data: result,
  });
});
const updateCow = catchAsync(async (req: Request, res: Response) => {
  const updatedCowData = req.body;
  const id = req.params.id;

  const result = await CowService.updateCowToDB(id, updatedCowData);
  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow updated successfully',
    data: result,
  });
});
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowService.deleteCowFromDB(id);
  sendResponse<ICow>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cow delete successfully',
    data: result,
  });
});

export const CowController = {
  createCows,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
