import { ENUM_USER_ROLE } from '../../../enums/users';

export type ILoginUser = {
  phoneNumber: string;
  password: string;
};

export type IUsersLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IVerifiedLoginUser = {
  userId: string;
  phoneNumber: string;
  role: ENUM_USER_ROLE;
};
