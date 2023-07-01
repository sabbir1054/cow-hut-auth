import { Model } from 'mongoose';

export type IAdmin = {
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type IAdminLogin = {
  phoneNumber: string;
  password: string;
};

export type IAdminLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
