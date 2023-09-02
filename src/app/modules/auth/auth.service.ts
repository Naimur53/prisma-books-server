import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import createBycryptPassword from '../../../helpers/createBycryptPassword';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
} from './auth.Interface';
const createUser = async (user: User): Promise<ILoginResponse> => {
  // checking is user buyer
  try {
    const { password: givenPassword, ...rest } = user;
    const genarateBycryptPass = await createBycryptPassword(givenPassword);

    const newUser = await prisma.user.create({
      data: { password: genarateBycryptPass, ...rest },
    });
    // eslint-disable-next-line no-unused-vars
    const { password, id, email, name } = newUser;
    //create access token & refresh token
    const accessToken = jwtHelpers.createToken(
      { id, email, role: newUser.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      { id, email, role: newUser.role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    return {
      user: { email, id, name, role: newUser.role },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Already exits ');
  }
  // eslint-disable-next-line no-unused-vars
};

const loginUser = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email: givenEmail, password } = payload;

  const isUserExist = await prisma.user.findFirst({
    where: { email: givenEmail },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await bcrypt.compare(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { email, id, role, name } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id, email, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { id, email, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    user: { email, id, name, role },
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { id } = verifiedToken;
  // checking deleted user's refresh token

  const isUserExist = await prisma.user.findFirst({ where: { id } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new Access token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
  refreshToken,
};
