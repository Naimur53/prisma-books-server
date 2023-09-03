import { User } from '@prisma/client';
export type IRefreshTokenResponse = {
  accessToken: string;
};

export type ILogin = {
  email: string;
  password: string;
};
export type ILoginResponse = {
  accessToken: string;
  user: Omit<User, 'password'>;
  refreshToken?: string;
};
