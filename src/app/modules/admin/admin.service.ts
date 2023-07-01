import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiErrors';
import { jwtHelpers } from './../../../helpers/jwtHelpers';
import { IAdmin, IAdminLoginResponse } from './admin.interface';
import { Admin } from './admin.model';

const createAdminToDB = async (payload: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(payload);
  return result;
};
const adminLogin = async (payload: IAdmin): Promise<IAdminLoginResponse> => {
  const { phoneNumber, password } = payload;

  // check admin is exist
  const isAdminExist = await Admin.isAdminExist(phoneNumber);
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }

  // password checking
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is not matched');
  }

  // create access token and refresh token
  const { _id: adminId, role } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    { adminId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { adminId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AdminService = {
  createAdminToDB,
  adminLogin,
};
