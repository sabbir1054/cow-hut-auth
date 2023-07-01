import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import IPaginationOptions from '../../../interfaces/paginations';
import { cowFilterableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCowsToDB = async (payload: ICow): Promise<ICow | null> => {
  // check duplicate cow entry using it is not possible that same user have same name cow
  const checked = await Cow.find({ name: payload.name }, { seller: 1 });
  if (checked) {
    if (payload.seller == checked[0]?.seller) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'This cow is already exist in this seller account'
      );
    }
  }

  if (!payload?.label) {
    payload.label = 'for sale';
  }
  const result = (await Cow.create(payload)).populate('seller');
  return result;
};

const getAllCowsFromDB = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (maxPrice) {
    andConditions.push({
      price: { $lte: maxPrice },
    });
  }
  if (minPrice) {
    andConditions.push({
      price: { $gte: minPrice },
    });
  }

  if (searchTerm) {
    const searchTermRegex = new RegExp(searchTerm, 'i');
    andConditions.push({
      $or: cowFilterableFields.map(field => ({
        [field]: {
          $regex: searchTermRegex,
          //   options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    Object.entries(filtersData).forEach(([field, value]) => {
      const filterValueRegex = new RegExp(String(value), 'i');
      andConditions.push({ [field]: { $regex: filterValueRegex } });
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCowFromDB = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  return result;
};
const updateCowToDB = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not Found');
  }
  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('seller');
  return result;
};
const deleteCowFromDB = async (id: string): Promise<ICow | null> => {
  const isExist = await Cow.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cow not Found');
  }
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowService = {
  createCowsToDB,
  getAllCowsFromDB,
  getSingleCowFromDB,
  updateCowToDB,
  deleteCowFromDB,
};
