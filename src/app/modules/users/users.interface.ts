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

export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  phoneNumber?: string;
  role?: string;
};
