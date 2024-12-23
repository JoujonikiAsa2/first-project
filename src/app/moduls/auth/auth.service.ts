import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUser = async (payload: Partial<TLoginUser>) => {
  const { id, password } = payload;

  // check user exist or not
  const user = await User.isUserExists(id as string);
  if (!user) {
    throw new AppError('User does not found', httpStatus.NOT_FOUND);
  }

  //check if user is already deleted
  const deletedUser = await User.isDeleted(id as string);
  if (deletedUser) {
    throw new AppError('User is already deleted', httpStatus.FORBIDDEN);
  }

  //check is user is blocked
  const blockedUser = await User.isBlocked(id as string);
  if (blockedUser) {
    throw new AppError('User is blocked', httpStatus.FORBIDDEN);
  }

  // compare password with hash password
  const passwordMatch = await User.isPasswordMatch(
    password as string,
    user?.password,
  );

  // if password does not match
  if (!passwordMatch) {
    throw new AppError('Password does not match', httpStatus.FORBIDDEN);
  }

  //jwt payload
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  //create token and send it to the user
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  //create token and send it to the user
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check user exist or not
  const user = await User.isUserExists(userData?.userId);
  if (!user) {
    throw new AppError('User does not found', httpStatus.NOT_FOUND);
  }

  //check if user is already deleted
  const deletedUser = await User.isDeleted(userData?.userId);
  if (deletedUser) {
    throw new AppError('User is already deleted', httpStatus.FORBIDDEN);
  }

  //check is user is blocked
  const blockedUser = await User.isBlocked(userData?.userId);
  if (blockedUser) {
    throw new AppError('User is blocked', httpStatus.FORBIDDEN);
  }

  //check if password is match
  const passwordMatch = await User.isPasswordMatch(
    payload?.oldPassword, //plain text pass
    user?.password, //hash pass
  );

  if (!passwordMatch) {
    throw new AppError('Password does not match', httpStatus.FORBIDDEN);
  }

  //hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    {
      new: true,
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExists(userId);

  if (!user) {
    throw new AppError( 'This user is not found !', httpStatus.NOT_FOUND,);
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError('This user is deleted !', httpStatus.FORBIDDEN);
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError('This user is blocked ! !',httpStatus.FORBIDDEN);
  }

  if (
    user.passwordChangedAt &&
    await User.isJWTIssuedBefforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError('You are not authorized !',httpStatus.UNAUTHORIZED);
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
};
