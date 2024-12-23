import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../moduls/user/user.constant';
import { User } from '../moduls/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    // check if the token send from client side
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError('You are not Authorized', httpStatus.UNAUTHORIZED);
    }

    // verify token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const {userId, role, iat} = decoded

    // check user exist or not
    const user = await User.isUserExists(userId);
    if (!user) {
      throw new AppError('User does not found', httpStatus.NOT_FOUND);
    }

    //check if user is already deleted
    const deletedUser = await User.isDeleted(userId);
    if (deletedUser) {
      throw new AppError('User is already deleted', httpStatus.FORBIDDEN);
    }

    //check is user is blocked
    const blockedUser = await User.isBlocked(userId);
    if (blockedUser) {
      throw new AppError('User is blocked !!', httpStatus.FORBIDDEN);
    }

    //check if passwordchanged is less than or equal to iat
    if (user.passwordChangedAt && await User.isJWTIssuedBefforePasswordChanged(user?.passwordChangedAt , iat as number)) {
      throw new AppError(
        'Password changed please login again',
        httpStatus.UNAUTHORIZED,
      );
    }

    if (requiredRoles && requiredRoles.includes(role)) {
      req.user = decoded as JwtPayload;
    } else {
      throw new AppError('You are not Authorized', httpStatus.UNAUTHORIZED);
    }

    next();
  });
};

export default auth;
