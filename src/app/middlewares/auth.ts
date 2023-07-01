import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiErrors';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { Cow } from '../modules/cows/cow.model';
import { Order } from '../modules/orders/order.model';

const validateUsersRole =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

const validateSpecificUser =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser;

      const isCorrectUserRole = requiredRoles.includes(verifiedUser.role);
      if (requiredRoles.length && !isCorrectUserRole) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      // work for specific user
      let findUser;
      if (verifiedUser.role === 'seller') {
        findUser = await Cow.findOne({
          _id: req.params.id,
          seller: verifiedUser.userId,
        });
      }
      if (verifiedUser.role === 'buyer') {
        findUser = await Order.findOne({
          cow: req.params.id,
          buyer: verifiedUser.userId,
        });
      }

      if (!findUser) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const Auth = {
  validateUsersRole,
  validateSpecificUser,
};
