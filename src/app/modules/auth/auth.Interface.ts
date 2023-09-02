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
  user: Pick<User, 'id' | 'email' | 'name' | 'role'>;
  refreshToken?: string;
};
