/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import IPaginationOptions from '../../../interfaces/paginations';
import { IGenericResponse } from './../../../interfaces/common';
import { userFilterableFields } from './users.constant';
import { IUser, IUserFilters } from './users.interface';
import { User } from './users.model';

const createUserToDB = async (payload: IUser): Promise<IUser | null> => {
  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userFilterableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUserToDB = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const { name, ...userData } = payload;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate(id, updatedUserData, {
    new: true,
  });
  return result;
};

const deleteUserFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

const getMyProfileFromDB = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id, {
    name: 1,
    phoneNumber: 1,
    address: 1,
  });
  return result;
};

export const UserService = {
  createUserToDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
  getMyProfileFromDB,
};
