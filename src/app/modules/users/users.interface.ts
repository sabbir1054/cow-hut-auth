/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  phoneNumber: string;
  role: 'seller' | 'buyer';
  password: string;
  name: IUserName;
  address?: string;
  budget?: string;
  income?: string;
};

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  phoneNumber?: string;
  role?: string;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IUser, '_id' | 'role' | 'password'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
